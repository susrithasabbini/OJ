const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  console.log(req.user);
  // find users without password
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  // get user without password
  const user = await User.findOne({ username: req.params.username }).select(
    "-password"
  );
  // not found
  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `No user found with username: ${req.params.username}` });
    throw new CustomError.NotFoundError(
      `No user found with username: ${req.params.username}`
    );
  }
  // checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  // req.user
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  // check requirements
  const { email, username } = req.body;
  if (!email && !username) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide email or username!" });
    throw new CustomError.BadRequestError("Please provide email or username!");
  }
  // check username already exists
  const userCount = await User.findOne({ username }).countDocuments();
  if (userCount !== 0) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Username already exists!" });
    throw new CustomError.BadRequestError("Username already exists!");
  }

  // find user
  const user = await User.findOne({ _id: req.user.userId });

  // update
  if (email) user.email = email;
  if (username) user.username = username;
  await user.save();
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res
    .status(StatusCodes.OK)
    .json({ user: tokenUser, message: "Username updated!" });
};

const updateUserPassword = async (req, res) => {
  // take old and new passwords
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide old and new passwords!" });
    throw new CustomError.BadRequestError(
      "Please provide old and new passwords!"
    );
  }
  // matches
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid Credentials!" });
    throw new CustomError.UnauthenticatedError("Invalid Credentials!");
  }
  // update
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ message: "Updated password successfully!" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
