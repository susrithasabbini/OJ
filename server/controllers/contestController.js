const { StatusCodes } = require("http-status-codes");
const Contest = require("../models/Contest");
const Problem = require("../models/Problem");
const User = require("../models/User");

const getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find({});
    return res.status(StatusCodes.OK).json({ contests });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getSingleContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Contest not found" });
    }

    // Fetch the full details of each problem
    const problemPromises = contest.problems.map((problem) =>
      Problem.findById(problem.problemId)
    );
    const problems = await Promise.all(problemPromises);

    // Determine the status of the contest
    const now = new Date();
    let status;

    if (contest.startDate > now) {
      status = "Upcoming";
    } else if (contest.startDate <= now && contest.endDate >= now) {
      status = "Ongoing";
    } else if (contest.endDate < now) {
      status = "Ended";
    }

    // Combine the contest data with the full problem details
    const contestWithProblems = {
      ...contest.toObject(), // Convert Mongoose document to plain JavaScript object
      problems: contest.problems.map((problem, index) => ({
        ...problems[index].toObject(), // Full problem details
        points: problem.points,
        solvedBy: problem.solvedBy, // contest problem solvers
      })),
      status, // Add status to the contest data
    };

    return res.status(StatusCodes.OK).json({ contest: contestWithProblems });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const editContest = async (req, res) => {
  const { title, description, problems, startDate, endDate } = req.body;
  const id = req.params.id;

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Contest ID is required" });
  }

  try {
    const existingContest = await Contest.findById(id);
    if (!existingContest) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Contest not found" });
    }

    await existingContest.updateOne(
      {
        title,
        description,
        problems,
        startDate,
        endDate,
      },
      { new: true }
    );

    return res.status(StatusCodes.OK).json(existingContest);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteContest = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Contest ID is required" });
  }

  try {
    const contest = await Contest.findByIdAndDelete(id);

    if (!contest) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Contest not found" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Contest deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const createContest = async (req, res) => {
  const { title, description, problems, startDate, endDate } = req.body;

  console.log("Request Body:", req.body); // Check if this logs the expected data

  if (!title || !description || !problems || !startDate || !endDate) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  // Validate problems array
  if (
    !Array.isArray(problems) ||
    problems.some((p) => !p.problemId || !p.points)
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid problems format" });
  }

  const contest = new Contest({
    title,
    description,
    problems,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  try {
    await contest.save();
    return res.status(StatusCodes.CREATED).json({ contest });
  } catch (error) {
    console.log("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const registerContest = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    // Find the contest
    const contest = await Contest.findById(id);
    if (!contest) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Contest not found" });
    }

    // Check if the user is already registered
    if (contest.participants.includes(userId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User is already registered for this contest" });
    }

    contest.participants.push(userId);
    await contest.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Registration successful" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to register for contest" });
  }
};

const getRecentContests = async (req, res) => {
  try {
    // Get the current date and year
    const now = new Date();
    const currentYear = now.getFullYear();
    const endOfYear = new Date(currentYear + 1, 0, 1); // January 1st of the next year
    const startOfYear = new Date(currentYear, 0, 1);

    // Query the database to find contests within the current year
    const contests = await Contest.find({
      startDate: { $lte: endOfYear },
      endDate: { $gte: startOfYear },
    }).sort({ startDate: 1 }); // Sort by startDate in ascending order

    // Process contests to add status
    const processedContests = contests.map((contest) => {
      let status;

      if (contest.startDate > now) {
        status = "Upcoming";
      } else if (contest.startDate <= now && contest.endDate >= now) {
        status = "Ongoing";
      } else if (contest.endDate < now) {
        status = "Ended";
      }

      return {
        ...contest.toObject(), // Convert Mongoose document to plain JavaScript object
        status,
      };
    });

    // Return the processed contests
    return res.status(StatusCodes.OK).json({ contests: processedContests });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getContestLeaderboard = async (req, res) => {
  try {
    const contestId = req.params.id;
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Contest not found" });
    }

    // Create an object to store the total points for each user
    const userPoints = {};

    // Add registered participants to the userPoints object with 0 points initially
    contest.participants.forEach((userId) => {
      userPoints[userId] = 0;
    });

    // Iterate through each problem in the contest
    contest.problems.forEach((problem) => {
      // Iterate through each user who solved the problem
      problem.solvedBy.forEach((userId) => {
        if (!userPoints[userId]) {
          userPoints[userId] = 0;
        }
        userPoints[userId] += problem.points;
      });
    });

    // Convert userPoints object to an array of users with their total points
    const leaderboard = Object.keys(userPoints).map((userId) => ({
      userId,
      points: userPoints[userId],
    }));

    // Sort the leaderboard in descending order of points
    leaderboard.sort((a, b) => b.points - a.points);

    // Populate user details if needed
    const populatedLeaderboard = await User.find({
      _id: { $in: leaderboard.map((u) => u.userId) },
    });
    const leaderboardWithDetails = leaderboard.map((u) => ({
      ...u,
      username:
        populatedLeaderboard.find(
          (user) => user._id.toString() === u.userId.toString()
        )?.username || "Unknown",
    }));

    return res.status(StatusCodes.OK).json({ leaderboardWithDetails });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllContestsLeaderboard = async (req, res) => {
  try {
    const now = new Date();

    // Find all ongoing and completed contests
    const relevantContests = await Contest.find({
      $or: [
        { endDate: { $lt: now } }, // Completed contests
        { $and: [{ startDate: { $lte: now } }, { endDate: { $gte: now } }] }, // Ongoing contests
      ],
    });

    // Create an object to store the total points for each user across all contests
    const userPoints = {};

    // Iterate through each relevant contest
    relevantContests.forEach((contest) => {
      // Iterate through each problem in the contest
      contest.problems.forEach((problem) => {
        // Iterate through each user who solved the problem
        problem.solvedBy.forEach((userId) => {
          if (!userPoints[userId]) {
            userPoints[userId] = 0;
          }
          userPoints[userId] += problem.points;
        });
      });
    });

    // Convert userPoints object to an array of users with their total points
    const leaderboard = Object.keys(userPoints).map((userId) => ({
      userId,
      points: userPoints[userId],
    }));

    // Sort the leaderboard in descending order of points
    leaderboard.sort((a, b) => b.points - a.points);

    // Populate user details if needed
    const populatedLeaderboard = await User.find({
      _id: { $in: leaderboard.map((u) => u.userId) },
    });

    // Create the leaderboard with details
    const leaderboardWithDetails = leaderboard.map((u, index) => {
      const user = populatedLeaderboard.find(
        (user) => user._id.toString() === u.userId.toString()
      );
      return {
        ...u,
        username: user ? user.username : "Unknown",
        ...(index === 0 && user ? { email: user.email } : {}),
      };
    });

    return res
      .status(StatusCodes.OK)
      .json({ leaderboard: leaderboardWithDetails });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  getAllContests,
  getSingleContest,
  editContest,
  deleteContest,
  createContest,
  getRecentContests,
  registerContest,
  getContestLeaderboard,
  getAllContestsLeaderboard,
};
