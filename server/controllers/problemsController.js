const { StatusCodes } = require("http-status-codes");
const Problem = require("../models/Problem");

const getAllProblems = async (req, res) => {
  try {
    // get only specific fields
    const problems = await Problem.find({}, "slug title difficulty tags");
    res.status(StatusCodes.OK).json({ problems });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const createProblem = async (req, res) => {
  // take required fields
  const { details, tags, testCases } = req.body;
  if (!details || !tags || !testCases) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing required fields" });
  }

  const data = {
    ...details,
    testCases: [...testCases],
    tags: [...tags],
    createdBy: req.user.userId,
  };

  try {
    const newProblem = new Problem(data);
    const problem = await newProblem.save();

    return res.status(StatusCodes.CREATED).json({ problem });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getProblemBySlug = async (req, res) => {
  // for unique get problem
  try {
    const problem = await Problem.find({ slug: req.params.slug });
    return res.status(StatusCodes.OK).json({ problem });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    return res.status(StatusCodes.OK).json({ problem });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const editProblem = async (req, res) => {
  const { testCases, details, tags } = req.body;
  const id = req.params.id;
  // edit based on id
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Problem ID is required" });
  }

  const updateData = {};

  if (details) {
    Object.assign(updateData, details);
  }

  if (tags) {
    updateData.tags = [...tags];
  }

  // Always set createdBy field to the current user ID
  updateData.createdBy = req.user._id;

  try {
    const existingProblem = await Problem.findById(id);

    if (!existingProblem) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Problem not found" });
    }

    if (testCases) {
      updateData.testCases = [...testCases];
    }

    const saved = await Problem.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res
      .status(StatusCodes.OK)
      .json({ problem: saved, message: "Problem updated!" });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const deleteProblem = async (req, res) => {
  // delete based on id
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await Problem.findByIdAndDelete(id);

    return res.status(StatusCodes.OK).json({ message: "Problem deleted!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  getAllProblems,
  createProblem,
  getProblemBySlug,
  getProblemById,
  editProblem,
  deleteProblem,
};
