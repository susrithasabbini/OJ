const { generateInputFile } = require("../generateInputFile");
const { generateFile } = require("../generateFile");
const { executeCpp } = require("../executeCpp");
const { executeJava } = require("../executeJava");
const { executePython } = require("../executePy");

const runCode = async (req, res) => {
  const { language = "cpp", code, input } = req.body;
  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty code!" });
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
    res.status(500).json({ error: error });
  }
};

const submitCode = async (req, res) => {
  let { language = "cpp", code, userInput, problemId, userId } = req.body;

  if (code === undefined || !code) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }

  let job;
  try {
    // need to generate a c++ file with content from the request
    const filepath = await generateFile(language, code);

    job = await Job({ language, filepath, userInput }).save();
    const jobId = job["_id"];
    addSubmitToQueue(jobId, problemId, userId);

    res.status(201).json({ sueccess: true, jobId });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getStatus = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json("Missing required fields");
  }

  try {
    const job = await Job.findById(req.params.id);

    res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, success: false });
  }
};

const getAllSubmissions = async (req, res) => {
  const userId = req.user._id;
  const problemId = req.params.id;
  if (!userId) return res.status(400).json("Missing required fields.");

  try {
    const submissions = await Job.find({
      userId,
      problemId,
      verdict: { $exists: true },
    }).sort({ submittedAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const downloadSubmission = async (req, res) => {
  const id = req.params.id;

  if (!id) return res.status(400).json("Missing required fields");

  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(400).json("File not found");
    }
    res.download(job.filepath);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  runCode,
  submitCode,
  getStatus,
  getAllSubmissions,
  downloadSubmission,
};
