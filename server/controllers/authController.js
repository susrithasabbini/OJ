const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
} = require("../utils");
const crypto = require("crypto");
const Token = require("../models/Token");
const { ORIGIN } = require("../config");
const validator = require("validator");

const register = async (req, res) => {
  const { email, username, password } = req.body;

  // check if email exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email already exists!" });
    throw new CustomError.BadRequestError("Email already exists!");
  }

  // first registered user is an admin
  const isFirst = (await User.countDocuments({})) === 0;
  const role = isFirst ? "admin" : "user";

  // create user
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({
    username,
    email,
    password,
    role,
    verificationToken,
  });
  // send verification token back only while testing in postman!!
  const origin = ORIGIN;
  await sendVerificationEmail({
    username: user.username,
    email: user.email,
    verificationToken: user.verificationToken,
    origin: origin,
  });
  res.status(StatusCodes.OK).json({
    msg: "Success! Please check your email to verify account",
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  // check user
  const user = await User.findOne({ email });
  if (!user) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email!" });
    throw new CustomError.BadRequestError("Invalid email!");
  }

  // validate token
  if (user.verificationToken !== verificationToken) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid token!" });
    throw new CustomError.BadRequestError("Invalid token!");
  }

  // mark as verified
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Email verified!!" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  // check requirements
  if (!email || !password) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide email and password!" });
    throw new CustomError.BadRequestError("Please provide email and password!");
  }

  // check user exists
  const user = await User.findOne({ email });
  if (!user) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Email does not exist!" });
    throw new CustomError.UnauthenticatedError("Email does not exist!");
  }

  // check password match
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid password!" });
    throw new CustomError.UnauthenticatedError("Invalid password!");
  }

  // if not verified, send please verify
  if (!user.isVerified) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Please verify your email!" });
    throw new CustomError.UnauthenticatedError("Please verify your email!");
  }
  const tokenUser = createTokenUser(user);
  // create refresh token
  let refreshToken = "";
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid Credentials!" });
      throw new CustomError.UnauthenticatedError("Invalid Credentials!");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  // create token & attach cookie
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  // delete token
  await Token.findOneAndDelete({ user: req.user.userId });
  // remove cookie
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "Logged out!!" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // check email exist
  if (!email) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide valid email!" });
    throw new CustomError.BadRequestError("Please provide valid email!");
  }

  // check user exist
  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    // send email
    const origin = ORIGIN;
    await sendResetPasswordEmail({
      username: user.username,
      email: user.email,
      token: passwordToken,
      origin,
    });

    // create password token
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
  // check requirements
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all required fields!" });
    throw new CustomError.BadRequestError(
      "Please provide all required fields!"
    );
  }

  // validate strong password
  if (!validator.isStrongPassword(password)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide strong password!" });
  }

  // check user exist
  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();

    // if valid token, save user password
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
        .json({ message: "Success, redirecting to login page shortly..." });
      return;
    }
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
