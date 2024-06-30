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

const getUserSubmissions = async (req, res) => {
  const userId = req.params.userId;
  try {
    const submissions = await Submission.find({ userId }, "createdAt");
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

module.exports = {
  getAllSubmissions,
  createSubmission,
  getUserSubmissions,
  getSingleSubmission,
  deleteSubmission,
  editSubmission,
};
