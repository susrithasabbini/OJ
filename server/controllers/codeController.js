const { generateInputFile } = require("../generateInputFile");
const { generateFile } = require("../generateFile");
const { executeCpp, validateCppTestCases } = require("../executeCpp");
const { executeJava, validateJavaTestCases } = require("../executeJava");
const { executePython, validatePythonTestCases } = require("../executePy");
const Problem = require("../models/Problem");
const { StatusCodes } = require("http-status-codes");
const {
  downloadTestInputsFromFirebase,
} = require("../firebase/downloadFileFromFirebase");
const Submission = require("../models/Submission");
const Contest = require("../models/Contest");

const runCode = async (req, res) => {
  const { language = "cpp", code, input } = req.body;
  if (!code) {
    return res.status(404).json({ message: "Empty code!" });
  }
  try {
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    const timelimit = 5; // Set the timelimit for running (s)
    let output;
    if (language === "cpp")
      output = await executeCpp(filePath, inputPath, timelimit);
    else if (language === "java")
      output = await executeJava(filePath, inputPath, timelimit);
    else if (language === "python")
      output = await executePython(filePath, inputPath, timelimit);

    res.json({ filePath, inputPath, output });
  } catch (error) {
    res.status(500).json({ error: error.message, stderr: error.stderr });
  }
};

const submitCode = async (req, res) => {
  let { language, code, problemId, userId, contestId } = req.body;

  if (code === undefined || !code) {
    return res.status(400).json({ error: "Empty code body!" });
  }

  try {
    // Generate a file with content from the request
    const filepath = await generateFile(language, code);
    let output;

    // Fetch the problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No problem found!" });
    }

    const timelimit = problem.timelimit; // Get the time limit from the problem
    const expectedOutputPath = problem.output;
    const inputPath = await downloadTestInputsFromFirebase(problem.input);

    // Validate code based on the language
    if (language === "cpp") {
      output = await validateCppTestCases(
        filepath,
        inputPath,
        expectedOutputPath[0].cpp,
        timelimit
      );
    } else if (language === "java") {
      output = await validateJavaTestCases(
        filepath,
        inputPath,
        expectedOutputPath[0].java,
        timelimit
      );
    } else if (language === "python") {
      output = await validatePythonTestCases(
        filepath,
        inputPath,
        expectedOutputPath[0].python,
        timelimit
      );
    }

    // Save the submission
    const submission = new Submission({
      code,
      language,
      output,
      problemId,
      userId,
      contestId: contestId || "", // Handle undefined contestId
    });
    await submission.save();

    if (output === "accepted") {
      // Mark user as solved that problem
      if (!problem.solvedBy.includes(userId)) {
        problem.solvedBy.push(userId);
        await problem.save(); // Save the updated problem
      }
    }

    // Update the contest if contestId is provided
    if (contestId) {
      const contest = await Contest.findById(contestId);
      if (!contest) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "No contest found!" });
      }

      // Find the problem in the contest and update its solvedBy
      const contestProblem = contest.problems.find(
        (p) => p.problemId === problemId
      );
      if (contestProblem) {
        if (
          !contestProblem.solvedBy.includes(userId) &&
          output === "accepted"
        ) {
          contestProblem.solvedBy.push(userId);
          await contest.save(); // Save the updated contest
        }
      } else {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Problem not found in contest!" });
      }
    }

    res.json({ filepath, inputPath, output });
  } catch (err) {
    console.error("Error during code submission:", err);

    // Save a failed submission
    const submission = new Submission({
      userId,
      problemId,
      language,
      code,
      output: "failed",
    });
    await submission.save();

    return res.status(500).json({ stderr: err });
  }
};

module.exports = {
  runCode,
  submitCode,
};
