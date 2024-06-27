const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const {
  downloadCodeFromFirebase,
  downloadInputFromFirebase,
  downloadPythonOutputFromFirebase,
} = require("./firebase/downloadFileFromFirebase");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = async (filepath, inputPath) => {
  try {
    const localFilePath = await downloadCodeFromFirebase(filepath);
    const localInputPath = await downloadInputFromFirebase(inputPath);

    return new Promise((resolve, reject) => {
      fs.readFile(localInputPath, "utf8", (err, inputData) => {
        if (err) {
          return reject({ error: err });
        }

        // Execute Python command
        const command = `python "${localFilePath}"`;

        const process = exec(
          command,
          { shell: "cmd.exe" },
          (error, stdout, stderr) => {
            if (error) {
              reject({ error, stderr });
            } else if (stderr) {
              reject(stderr);
            } else {
              resolve(stdout);
            }
          }
        );

        process.stdin.end(inputData); // Pass the input data to the process stdin
      });
    });
  } catch (error) {
    throw error;
  }
};

const validatePythonTestCases = async (
  filePath,
  inputPath,
  expectedOutputPath
) => {
  const localFilePath = await downloadCodeFromFirebase(filePath);
  const localExpectedOutputPath = await downloadPythonOutputFromFirebase(
    expectedOutputPath
  );
  const jobId = path.basename(localFilePath).split(".")[0];
  const codeOutputPath = path.join(outputPath, `${jobId}_output.txt`);

  // console.log({
  //   jobId,
  //   codeOutputPath,
  //   filePath,
  //   inputPath,
  //   expectedOutputPath,
  // });

  return new Promise((resolve, reject) => {
    exec(
      `python "${localFilePath}" < "${inputPath}" > "${codeOutputPath}"`,
      { shell: "cmd.exe" },
      async (error, stdout, stderr) => {
        if (error) {
          return reject({ error, stderr });
        } else if (stderr) {
          return reject(stderr);
        }

        try {
          const generatedOutput = await fs.promises.readFile(
            codeOutputPath,
            "utf8"
          );
          const expectedOutput = await fs.promises.readFile(
            localExpectedOutputPath,
            "utf8"
          );

          if (generatedOutput.trim() === expectedOutput.trim()) {
            resolve("accepted");
          } else {
            resolve("failed");
          }
        } catch (readError) {
          reject(readError);
        }
      }
    );
  });
};

module.exports = {
  executePython,
  validatePythonTestCases,
};
