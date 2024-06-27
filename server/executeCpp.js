const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const {
  downloadCodeFromFirebase,
  downloadInputFromFirebase,
  downloadCppOutputFromFirebase,
} = require("./firebase/downloadFileFromFirebase");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filepath, inputpath) => {
  const localFilePath = await downloadCodeFromFirebase(filepath);
  const localInputPath = await downloadInputFromFirebase(inputpath);

  const jobId = path.basename(localFilePath).split(".")[0];
  const outPath = path.join(path.dirname(localFilePath), `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    exec(
      `g++ "${localFilePath}" -o "${outPath}" && "${outPath}" < "${localInputPath}"`,
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
  });
};

const validateCppTestCases = async (
  filePath,
  inputPath,
  expectedOutputPath
) => {
  const localFilePath = await downloadCodeFromFirebase(filePath);
  const localExpectedOutputPath = await downloadCppOutputFromFirebase(
    expectedOutputPath
  );

  const jobId = path.basename(localFilePath).split(".")[0];
  const codeOutputPath = path.join(outputPath, `${jobId}_output.txt`);
  const outPath = path.join(path.dirname(localFilePath), `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    exec(
      `g++ "${localFilePath}" -o "${outPath}" && "${outPath}" < "${inputPath}" > "${codeOutputPath}"`,
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
  executeCpp,
  validateCppTestCases,
};
