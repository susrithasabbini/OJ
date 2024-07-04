const { StatusCodes } = require("http-status-codes");
const Submission = require("../models/Submission");

const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({});
    res.status(StatusCodes.OK).json({ submissions });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const createSubmission = async (req, res) => {
  try {
    const { userId, problemId, language, code, output, executionTime } =
      req.body;

    const submission = new Submission({
      userId,
      problemId,
      language,
      code,
      output,
      executionTime,
    });

    await submission.save();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create submission",
      error: error.message,
    });
  }
};

const getSingleSubmission = async (req, res) => {
  try {
    const submission = await Submission.find(req.params.id);
    res.status(StatusCodes.OK).json({ submission });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteSubmission = async (req, res) => {
  // delete based on id
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await Submission.findByIdAndDelete(id);

    return res.status(StatusCodes.OK).json({ message: "Submission deleted!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getAllUserSubmissions = async (req, res) => {
  const { userId, contestId, problemId } = req.body;

  if (!userId || !problemId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User Id & Problem Id are required!" });
  }

  try {
    if (contestId) {
      const submissions = await Submission.find(
        {
          userId,
          problemId,
          contestId,
        },
        "language code output createdAt"
      )
        .sort({ createdAt: -1 }) // Sort by creation date in descending order to get the most recent submission
        .exec();
      return res.status(StatusCodes.OK).json({ submissions });
    } else {
      const submissions = await Submission.find(
        {
          userId,
          problemId,
        },
        "language code output createdAt"
      )
        .sort({ createdAt: -1 }) // Sort by creation date in descending order to get the most recent submission
        .exec();
      return res.status(StatusCodes.OK).json({ submissions });
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const getUserSubmissions = async (req, res) => {
  const userId = req.params.userId;

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Define the start and end of the current year
  const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${currentYear + 1}-01-01T00:00:00.000Z`);

  try {
    const submissions = await Submission.find(
      {
        userId,
        createdAt: { $gte: startOfYear, $lt: endOfYear },
      },
      "createdAt"
    );

    res.status(StatusCodes.OK).json({ submissions });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const editSubmission = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { userId, problemId, language, code, output, executionTime } =
      req.body;

    const submission = await Submission.findById(id);

    if (userId) submission.userId = userId;
    if (problemId) submission.problemId = problemId;
    if (language) submission.language = language;
    if (code) submission.code = code;
    if (output) submission.output = output;
    if (executionTime) submission.executionTime = executionTime;

    await submission.save();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to edit submission",
      error: error.message,
    });
  }
};

const getSubmissionsData = async (req, res) => {
  try {
    // Aggregate submissions by month
    const results = await Submission.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" }, // Assuming 'createdAt' is the timestamp field
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
    const submissionsData = {
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
          label: "Submissions",
          data: monthlyCounts,
          backgroundColor: "rgba(29, 78, 216, 0.6)", // Adjust color as needed
        },
      ],
    };

    return res.status(StatusCodes.OK).json({ submissionsData });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const retrieveLastSubmittedCode = async (req, res) => {
  try {
    const userId = req.user.userId; // Retrieve user ID from request object
    const { problemId } = req.params; // Retrieve problem ID from request parameters

    // Find the most recent submission for the given user and problem
    const latestSubmission = await Submission.findOne({
      userId: userId,
      problemId: problemId,
      language: req.body.language,
    })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order to get the most recent submission
      .exec();

    if (!latestSubmission) {
      return res
        .status(404)
        .json({ message: "No submissions found for this problem." });
    }

    // Send the submission details as the response
    res.status(200).json({ latestSubmission });
  } catch (error) {
    // Handle any errors that occur
    console.error("Error retrieving the last submission:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getAllSubmissions,
  createSubmission,
  getUserSubmissions,
  getSingleSubmission,
  deleteSubmission,
  editSubmission,
  getSubmissionsData,
  getAllUserSubmissions,
  retrieveLastSubmittedCode,
};
