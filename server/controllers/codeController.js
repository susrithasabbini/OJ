const { generateInputFile } = require("../generateInputFile");
const { generateFile } = require("../generateFile");
const { executeCpp, validateCppTestCases } = require("../executeCpp");
const { executeJava, validateJavaTestCases } = require("../executeJava");
const { executePython, validatePythonTestCases } = require("../executePy");
const Problem = require("../models/Problem");
const { StatusCodes } = require("http-status-codes");
const { downloadInputFromFirebase, downloadTestInputsFromFirebase } = require("../firebase/downloadFileFromFirebase");

const runCode = async (req, res) => {
  const { language = "cpp", code, input } = req.body;
  if (!code) {
    return res.status(404).json({ message: "Empty code!" });
  }
  try {
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    let output;
    if (language === "cpp") output = await executeCpp(filePath, inputPath);
    else if (language === "java")
      output = await executeJava(filePath, inputPath);
    else if (language === "python")
      output = await executePython(filePath, inputPath);
    res.json({ filePath, inputPath, output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitCode = async (req, res) => {
  let { language, code, userInput, problemId, userId } = req.body;

  if (code === undefined || !code) {
    return res.status(400).json({ error: "Empty code body!" });
  }

  try {
    // Generate a file with content from the request
    const filepath = await generateFile(language, code);
    let output;

    const problem = await Problem.findById(problemId);
    if (!problem)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No problem found!" });

    const expectedOutputPath = problem.output;
    const inputPath = await downloadTestInputsFromFirebase(problem.input);

    if (language === "cpp")
      output = await validateCppTestCases(
        filepath,
        inputPath,
        expectedOutputPath[0].cpp
      );
    else if (language === "java")
      output = await validateJavaTestCases(
        filepath,
        inputPath,
        expectedOutputPath[0].java
      );
    else if (language === "python")
      output = await validatePythonTestCases(
        filepath,
        inputPath,
        expectedOutputPath[0].python
      );

    res.json({ filepath, inputPath, output });
  } catch (err) {
    console.error("Error submitting code:", err);
    return res.status(500).json(err);
  }
};

module.exports = {
  runCode,
  submitCode,
};
