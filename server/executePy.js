const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = (filepath, inputPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(inputPath, "utf8", (err, inputData) => {
      if (err) {
        return reject({ error: err });
      }

      // execute python command
      const command = `python "${filepath}"`;

      exec(command, { shell: "cmd.exe" }, (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
          return;
        }
        if (stderr) {
          reject(stderr);
          return;
        }
        resolve(stdout);
      }).stdin.end(inputData);
    });
  });
};

const validatePythonTestCases = (filePath, inputPath, expectedOutputPath) => {
  const jobId = path.basename(filePath).split(".")[0];
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
      `python "${filePath}" < "${inputPath}" > "${codeOutputPath}"`,
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
  executePython,
  validatePythonTestCases,
};
