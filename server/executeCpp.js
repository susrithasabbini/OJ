const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(path.dirname(filepath), `${jobId}.exe`);
  // console.log({ jobId, filepath, inputPath, jobId, outputPath, outPath });

  return new Promise((resolve, reject) => {
    // execute cpp command in cmd
    exec(
      `g++ "${filepath}" -o "${outPath}" && "${outPath}" < "${inputPath}"`,
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

const validateCppTestCases = (filePath, inputPath, expectedOutputPath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const codeOutputPath = path.join(outputPath, `${jobId}_output.txt`);
  const outPath = path.join(path.dirname(filePath), `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    exec(
      `g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputPath}" > "${codeOutputPath}"`,
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
            expectedOutputPath,
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
