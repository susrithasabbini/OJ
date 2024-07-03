const { StatusCodes } = require("http-status-codes");
const Problem = require("../models/Problem");
const User = require("../models/User");
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
  const {
    slug,
    description,
    title,
    difficulty,
    constraints,
    tags,
    testCases,
    cppCodeStub,
    javaCodeStub,
    pythonCodeStub,
  } = req.body;

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

    // Handle code stubs
    if (cppCodeStub || javaCodeStub || pythonCodeStub) {
      if (
        !existingProblem.codeStubs ||
        !Array.isArray(existingProblem.codeStubs)
      ) {
        existingProblem.codeStubs = [{ cpp: "", java: "", python: "" }];
      }

      if (existingProblem.codeStubs.length !== 0)
        updateData.codeStubs = existingProblem.codeStubs;
      else updateData.codeStubs = [{ cpp: "", java: "", python: "" }];

      if (cppCodeStub !== undefined) updateData.codeStubs[0].cpp = cppCodeStub;
      if (javaCodeStub !== undefined)
        updateData.codeStubs[0].java = javaCodeStub;
      if (pythonCodeStub !== undefined)
        updateData.codeStubs[0].python = pythonCodeStub;
    }

    if (!existingProblem.output || !Array.isArray(existingProblem.output)) {
      existingProblem.output = [{ cpp: "", java: "", python: "" }];
    }

    if (existingProblem.output.length !== 0)
      updateData.output = existingProblem.output;
    else updateData.output = [{ cpp: "", java: "", python: "" }];

    // Handle file uploads and update paths
    if (input) {
      const inputFilePath = await saveFileToFirebase(
        "testinputs",
        "txt",
        input[0].buffer // Accessing buffer directly
      );
      updateData.input = inputFilePath;
    }

    if (cppoutput) {
      const cppOutputFilePath = await saveFileToFirebase(
        "cppoutputs",
        "txt",
        cppoutput[0].buffer // Accessing buffer directly
      );
      updateData.output[0].cpp = cppOutputFilePath;
    }

    if (javaoutput) {
      const javaOutputFilePath = await saveFileToFirebase(
        "javaoutputs",
        "txt",
        javaoutput[0].buffer // Accessing buffer directly
      );
      updateData.output[0].java = javaOutputFilePath;
    }

    if (pythonoutput) {
      const pythonOutputFilePath = await saveFileToFirebase(
        "pythonoutputs",
        "txt",
        pythonoutput[0].buffer // Accessing buffer directly
      );
      updateData.output[0].python = pythonOutputFilePath;
    }

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

const getLeaderboard = async (req, res) => {
  try {
    // Retrieve all problems and count how many unique users solved each problem
    const problems = await Problem.find({}, "solvedBy");

    // Create a map to count the number of unique problems solved by each user
    const userProblemCounts = {};

    // Iterate through all problems and update the count for each user
    problems.forEach((problem) => {
      problem.solvedBy.forEach((userId) => {
        if (userProblemCounts[userId]) {
          userProblemCounts[userId]++;
        } else {
          userProblemCounts[userId] = 1;
        }
      });
    });

    // Convert the userProblemCounts map into an array for further processing
    const userProblemCountsArray = Object.entries(userProblemCounts).map(
      ([userId, solvedProblems]) => ({
        userId,
        solvedProblems,
      })
    );

    // Sort users by the number of solved problems in descending order
    userProblemCountsArray.sort((a, b) => b.solvedProblems - a.solvedProblems);

    // Get usernames for each userId
    const userIds = userProblemCountsArray.map((u) => u.userId);
    const users = await User.find({ _id: { $in: userIds } });

    // Format the data
    const positions = userProblemCountsArray.map((userCount, index) => {
      const user = users.find(
        (u) => u._id.toString() === userCount.userId.toString()
      );
      return {
        username: user ? user.username : "Unknown",
        rank: index + 1,
        solvedProblems: userCount.solvedProblems,
      };
    });

    res.status(200).json({ positions });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

const getSolvedProblems = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming user ID is available in req.user.id

    // Fetch all problems from the database
    const problems = await Problem.find();

    // Group problems by difficulty
    const problemsByDifficulty = problems.reduce((acc, problem) => {
      if (!acc[problem.difficulty]) {
        acc[problem.difficulty] = [];
      }
      acc[problem.difficulty].push(problem);
      return acc;
    }, {});

    // Initialize the result array
    const result = [];

    // Total problems and solved problems counters
    let totalProblems = 0;
    let totalSolvedProblems = 0;

    // Function to calculate statistics for a given difficulty
    const calculateStatistics = (difficulty) => {
      const problemsCount = problemsByDifficulty[difficulty]?.length || 0;
      totalProblems += problemsCount;

      // Count the number of solved problems for the user at this difficulty level
      const solvedProblems =
        problemsByDifficulty[difficulty]?.filter((problem) =>
          problem.solvedBy.includes(userId)
        ).length || 0;
      totalSolvedProblems += solvedProblems;

      // Calculate the percentage of solved problems
      const percentageSolved = problemsCount
        ? Math.round((solvedProblems / problemsCount) * 100)
        : 0;

      return {
        difficulty,
        problemsCount,
        solvedProblems,
        percentageSolved,
      };
    };

    // Calculate statistics for each difficulty in the required order
    const difficulties = ["Easy", "Medium", "Hard"];
    for (const difficulty of difficulties) {
      const stats = calculateStatistics(difficulty);
      result.push(stats);
    }

    // Calculate the total percentage of solved problems
    const totalPercentageSolved = totalProblems
      ? Math.round((totalSolvedProblems / totalProblems) * 100)
      : 0;

    // Add the total data to the result array
    result.push({
      totalPercentageSolved,
      totalProblems,
      totalSolvedProblems,
    });

    return res.status(StatusCodes.OK).json({ statistics: result });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getProblemsAddedData = async (req, res) => {
  try {
    // Aggregate problems by month
    const results = await Problem.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
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
    const problemsAddedData = {
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
          label: "Problems Added",
          data: monthlyCounts,
          backgroundColor: "rgba(59, 130, 246, 0.6)",
        },
      ],
    };

    return res.status(StatusCodes.OK).json({ problemsAddedData });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  getLeaderboard,
  getAllProblems,
  createProblem,
  getProblemBySlug,
  getProblemById,
  editProblem,
  deleteProblem,
  getSolvedProblems,
  getProblemsAddedData,
};
