const {
  downloadCppOutputFromFirebase,
} = require("./firebase/downloadFileFromFirebase");

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const normalize = (str) => {
  return str.replace(/\r\n/g, "\n").trim();
};

const executeCpp = (filepath, inputPath, timelimit) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(path.dirname(filepath), `${jobId}.out`);

  return new Promise((resolve, reject) => {
    // Compile the C++ code
    exec(
      `g++ "${filepath}" -o "${outPath}"`,
      (compileError, stdout, stderr) => {
        if (compileError) {
          return reject({ error: compileError.message, stderr });
        } else if (stderr) {
          return reject({ stderr });
        } else {
          // Execute the compiled executable with time limit
          const execCommand = exec(
            `"${outPath}" < "${inputPath}"`,
            { timeout: timelimit * 1000 },
            (execError, execStdout, execStderr) => {
              if (execStderr) {
                return reject({ stderr: execStderr });
              } else if (execError) {
                if (execError.killed) {
                  return resolve("time limit exceeded");
                }
                return reject({ error: execError.message, stderr: execStderr });
              } else {
                return resolve(execStdout);
              }
            }
          );

          // Kill the process if it exceeds the time limit
          setTimeout(() => {
            execCommand.kill();
          }, timelimit * 1000);
        }
      }
    );
  });
};

const validateCppTestCases = async (
  filePath,
  inputPath,
  expectedOutputPath,
  timelimit
) => {
  const localExpectedOutputPath = await downloadCppOutputFromFirebase(
    expectedOutputPath
  );

  const jobId = path.basename(filePath).split(".")[0];
  const codeOutputPath = path.join(outputPath, `${jobId}_output.txt`);
  const outPath = path.join(path.dirname(filePath), `${jobId}.out`);

  console.log(
    `g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputPath}" > "${codeOutputPath}"`
  );

  return new Promise((resolve, reject) => {
    const execCommand = exec(
      `g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputPath}" > "${codeOutputPath}"`,
      { timeout: timelimit * 1000 },
      async (error, stdout, stderr) => {
        if (stderr) {
          return reject(stderr);
        } else if (error) {
          if (error.killed) {
            return resolve("time limit exceeded");
          }
          return reject({ error, stderr });
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

          if (normalize(generatedOutput) === normalize(expectedOutput)) {
            resolve("accepted");
          } else {
            resolve("failed");
          }
        } catch (readError) {
          reject(readError);
        }
      }
    );

    setTimeout(() => {
      execCommand.kill();
    }, timelimit * 1000);
  });
};

module.exports = {
  executeCpp,
  validateCppTestCases,
};
