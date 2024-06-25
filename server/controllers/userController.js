const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  // console.log(req.user);
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
  const { email, username, skill, skillToRemove } = req.body;

  try {
    // Check if email or username is provided
    if (!email && !username && !skill && !skillToRemove) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide required fields!",
      });
    }

    // Check if username already exists
    if (username) {
      const userWithUsername = await User.findOne({ username });
      if (
        userWithUsername &&
        userWithUsername._id.toString() !== req.user.userId
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Username already exists!",
        });
      }
    }

    // Find the user by userId
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }

    // Update email and username if provided
    if (email) user.email = email;
    if (username) user.username = username;

    // If skill is provided, add it to user.skills (considering case-insensitive comparison)
    if (skill) {
      // Convert existing skills to lower case for comparison
      const lowerCaseSkills = user.skills.map((s) => s.toLowerCase());

      // Check if skill already exists (case-insensitive)
      if (lowerCaseSkills.includes(skill.toLowerCase())) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Skill already exists for user",
        });
      }

      // Add skill
      user.skills.push(skill);
      await user.save();

      return res.status(StatusCodes.OK).json({
        updatedSkills: user.skills,
        message: "Skill added successfully",
      });
    }

    // If skillToRemove is provided, remove it from user.skills (considering case-insensitive comparison)
    if (skillToRemove) {
      // Remove skill (case-insensitive)
      user.skills = user.skills.filter(
        (s) => s.toLowerCase() !== skillToRemove.toLowerCase()
      );
      await user.save();

      return res.status(StatusCodes.OK).json({
        updatedSkills: user.skills,
        message: "Skill removed successfully",
      });
    }

    // Save user changes and return updated user profile
    await user.save();
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    return res.status(StatusCodes.OK).json({
      user: tokenUser,
      message: "Profile updated!",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update user",
    });
  }
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
  res
    .status(StatusCodes.OK)
    .json({ message: "Updated password successfully!" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
