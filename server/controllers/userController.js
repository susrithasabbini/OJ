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
  return res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  // get user without password
  const user = await User.findOne({ username: req.params.username }).select(
    "-password"
  );
  // not found
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `No user found with username: ${req.params.username}` });
    // throw new CustomError.NotFoundError(
    //   `No user found with username: ${req.params.username}`
    // );
  }
  // checkPermissions(req.user, user._id);
  return res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  // req.user
  return res.status(StatusCodes.OK).json({ user: req.user });
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
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide old and new passwords!" });
    // throw new CustomError.BadRequestError(
    //   "Please provide old and new passwords!"
    // );
  }
  // matches
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid Credentials!" });
    // throw new CustomError.UnauthenticatedError("Invalid Credentials!");
  }
  // update
  user.password = newPassword;
  await user.save();
  return res
    .status(StatusCodes.OK)
    .json({ message: "Updated password successfully!" });
};

const getUsersAddedData = async (req, res) => {
  try {
    // Aggregate users by month, but only for those with the role "user"
    const results = await User.aggregate([
      {
        $match: { role: "user" }, // Filter for role "user"
      },
      {
        $project: {
          month: { $month: "$verified" }, // Assuming 'verified' is the timestamp field
        },
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    // Map results to data structure
    const monthlyCounts = new Array(12).fill(0); // Initialize array for 12 months

    results.forEach(({ _id, count }) => {
      monthlyCounts[_id - 1] = count; // _id is the month number (1-12)
    });

    // Prepare data for front-end
    const usersAddedData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Users Added (Role: User)",
          data: monthlyCounts,
          backgroundColor: "rgba(37, 99, 235, 0.6)", // Adjust color as needed
        },
      ],
    };

    return res.status(StatusCodes.OK).json({ usersAddedData });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getUserRolesData = async (req, res) => {
  try {
    // Aggregate user counts by role
    const results = await User.aggregate([
      {
        $group: {
          _id: "$role", // Group by role
          count: { $sum: 1 }, // Count number of users per role
        },
      },
      {
        $sort: { _id: 1 }, // Optional: Sort by role if needed
      },
    ]);

    // Map results to data structure
    const roles = ["admin", "owner", "user"]; // Define roles
    const counts = roles.map((role) => {
      const result = results.find((r) => r._id === role);
      return result ? result.count : 0; // Get count or default to 0
    });

    // Prepare data for front-end
    const userRolesData = {
      labels: roles,
      datasets: [
        {
          label: "User Roles",
          data: counts,
          backgroundColor: [
            "rgba(37, 99, 235, 0.6)", // Admin
            "rgba(29, 78, 216, 0.6)", // Owner
            "rgba(59, 130, 246, 0.6)", // User
          ],
        },
      ],
    };

    return res.status(StatusCodes.OK).json({ userRolesData });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getUsersAddedData,
  getUserRolesData,
};
