const User = require("../models/User");
const Token = require("../models/Token");
const CustomError = require("../errors");
const crypto = require("crypto");
const { ORIGIN } = require("../config");
const { StatusCodes } = require("http-status-codes");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const { attachCookiesToResponse } = require("../utils/jwt");
const createHash = require("../utils/createHash");
const createTokenUser = require("../utils/createTokenUser");
const validator = require("validator");

const register = async (req, res) => {
  const { email, username, password } = req.body;
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email already exists!" });
    throw new CustomError.BadRequestError("Email already exists!");
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");

  if (!validator.isStrongPassword(password)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide strong password!",
    });
  }

  const user = await User.create({
    username,
    email,
    password,
    verificationToken,
  });

  const origin = ORIGIN;
  await sendVerificationEmail({
    name: user.username,
    email: user.email,
    verificationToken: user.verificationToken,
    origin: origin,
  });

  res.status(StatusCodes.OK).json({
    message: "Success! Please check your email to verify account",
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new CustomError.BadRequestError("Invalid email!");
  if (user.verificationToken !== verificationToken)
    throw new CustomError.BadRequestError("Invalid token!");
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";
  await user.save();
  res.status(StatusCodes.OK).json({ message: "Email verified!" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide email and password!" });
    throw new CustomError.BadRequestError("Please provide email and password!");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email does not exist!" });
    throw new CustomError.UnauthenticatedError("Email does not exist!");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid password!" });
    throw new CustomError.UnauthenticatedError("Invalid password!");
  }

  if (!user.isVerified) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please verify your email!" });
    throw new CustomError.UnauthenticatedError("Please verify your email!");
  }

  const tokenUser = createTokenUser(user);
  let refreshToken = "";

  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid Credentials!" });
      throw new CustomError.UnauthenticatedError("Invalid Credentials!");
    }

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "Logged out!!" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    throw new CustomError.BadRequestError("Please provide valid email!");
  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    // send email
    const origin = ORIGIN;
    await sendResetPasswordEmail({
      name: user.username,
      email: user.email,
      token: passwordToken,
      origin,
    });
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ message: "Please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError(
      "Please provide all required fields!"
    );
  }
  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    const isTokenValid =
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate;
    if (isTokenValid) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
      res
        .status(StatusCodes.OK)
        .json({ message: "Password reset successfully!" });
      return;
    }
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
