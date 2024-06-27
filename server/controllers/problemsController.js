const { StatusCodes } = require("http-status-codes");
const Problem = require("../models/Problem");
const { saveFileToFirebase } = require("../firebase/saveFileToFirebase");

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

    // Handle the uploaded files (input and output)
    if (!input && !cppoutput && !javaoutput && !pythonoutput) {
      return res
        .status(400)
        .json({ message: "Input and Output files are required" });
    }

    // Save input file to Firebase storage
    const inputFilePath = await saveFileToFirebase(
      "testinputs",
      "txt",
      input[0].buffer
    );

    // Save output files to Firebase storage
    const cppOutputFilePath = await saveFileToFirebase(
      "cppoutputs",
      "txt",
      cppoutput[0].buffer
    );
    const javaOutputFilePath = await saveFileToFirebase(
      "javaoutputs",
      "txt",
      javaoutput[0].buffer
    );
    const pythonOutputFilePath = await saveFileToFirebase(
      "pythonoutputs",
      "txt",
      pythonoutput[0].buffer
    );

    // Create an array of output file paths
    const output = [
      {
        cpp: cppOutputFilePath,
        java: javaOutputFilePath,
        python: pythonOutputFilePath,
      },
    ];

    // Create a new Problem instance
    const problem = new Problem({
      input: inputFilePath,
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

    // Save the problem to the database
    await problem.save();

    return res.status(StatusCodes.CREATED).json({ problem });
  } catch (error) {
    console.error("Error in creating problem:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create problem",
      error: error.message,
    });
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
    let existingProblem = await Problem.findById(id);

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

    // Initialize updateData.output if not already initialized
    if (!updateData.output) {
      updateData.output = [];
    }

    // Handle file uploads and update paths
    if (input) {
      const inputFilePath = await saveFileToFirebase(
        "testinputs",
        "txt",
        input[0].buffer // Accessing buffer directly
      );
      updateData.input = inputFilePath;
    }

    // Construct a single object for all output file paths
    const outputObject = {};

    if (cppoutput) {
      const cppOutputFilePath = await saveFileToFirebase(
        "cppoutputs",
        "txt",
        cppoutput[0].buffer // Accessing buffer directly
      );
      outputObject.cpp = cppOutputFilePath;
    }

    if (javaoutput) {
      const javaOutputFilePath = await saveFileToFirebase(
        "javaoutputs",
        "txt",
        javaoutput[0].buffer // Accessing buffer directly
      );
      outputObject.java = javaOutputFilePath;
    }

    if (pythonoutput) {
      const pythonOutputFilePath = await saveFileToFirebase(
        "pythonoutputs",
        "txt",
        pythonoutput[0].buffer // Accessing buffer directly
      );
      outputObject.python = pythonOutputFilePath;
    }

    // Push the single output object containing all file paths to updateData.output
    updateData.output.push(outputObject);

    // Perform the update operation and return the updated problem
    existingProblem = await Problem.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res
      .status(StatusCodes.OK)
      .json({ problem: existingProblem, message: "Problem updated!" });
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
