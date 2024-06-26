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
  try {
    const {
      slug,
      description,
      title,
      difficulty,
      constraints,
      tags,
      testCases,
    } = req.body;
    const { input, cppoutput, javaoutput, pythonoutput } = req.files;

    const output = [
      {
        cpp: cppoutput[0].path,
        java: javaoutput[0].path,
        python: pythonoutput[0].path,
      },
    ];

    // Handle the uploaded files (input and output)
    if (!input || !cppoutput || !javaoutput || !pythonoutput) {
      return res
        .status(400)
        .json({ message: "Input and Output files are required" });
    }

    // Proceed with storing details, tags, testCases, and file URLs or paths in database
    const problem = new Problem({
      input: input[0].path,
      output: [...output],
      tags,
      testCases,
      slug,
      description,
      title,
      difficulty,
      constraints,
      createdBy: req.user.userId,
    });

    await problem.save();

    return res.status(201).json({ problem });
  } catch (error) {
    console.error("Error in creating problem:", error);
    return res.status(500).json({ message: "Failed to create problem" });
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
  const { slug, description, title, difficulty, constraints, tags, testCases } =
    req.body;
  const { input, cppoutput, javaoutput, pythonoutput } = req.files;

  const id = req.params.id;

  // Ensure an ID is provided
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Problem ID is required" });
  }

  // Prepare update data object
  const updateData = {};

  // Always set createdBy field to the current user ID
  updateData.createdBy = req.user._id;

  try {
    // Find the existing problem by ID
    const existingProblem = await Problem.findById(id);

    // Handle case where problem does not exist
    if (!existingProblem) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Problem not found" });
    }

    // Update fields if provided in request body
    if (testCases) updateData.testCases = testCases;
    if (slug) updateData.slug = slug;
    if (description) updateData.description = description;
    if (title) updateData.title = title;
    if (difficulty) updateData.difficulty = difficulty;
    if (constraints) updateData.constraints = constraints;
    if (tags) updateData.tags = tags;
    if (input) updateData.input = input[0].path;

    // Update output fields only if corresponding files are present
    if (cppoutput) {
      updateData.output = updateData.output || [{ cpp: "" }];
      updateData.output[0].cpp = cppoutput[0].path;
    }
    if (javaoutput) {
      updateData.output = updateData.output || [{ java: "" }];
      updateData.output[0].java = javaoutput[0].path;
    }
    if (pythonoutput) {
      updateData.output = updateData.output || [{ python: "" }];
      updateData.output[0].python = pythonoutput[0].path;
    }

    // Perform the update operation and return the updated problem
    const updatedProblem = await Problem.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res
      .status(StatusCodes.OK)
      .json({ problem: updatedProblem, message: "Problem updated!" });
  } catch (error) {
    console.error("Error editing problem:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to update problem" });
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
