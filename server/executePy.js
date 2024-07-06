const {
  downloadPythonOutputFromFirebase,
} = require("./firebase/downloadFileFromFirebase");

const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const normalize = (str) => {
  return str.replace(/\r\n/g, "\n").trim();
};

const executePython = (filepath, inputPath, timelimit) => {
  console.log({ filepath, inputPath, timelimit });
  return new Promise((resolve, reject) => {
    fs.readFile(inputPath, "utf8", (err, inputData) => {
      if (err) {
        return reject({ error: err });
      }

      const command = "python";
      const args = [filepath];

      const proc = spawn(command, args);

      let stdout = "";
      let stderr = "";

      proc.stdin.write(inputData);
      proc.stdin.end();

      proc.stdout.on("data", (data) => {
        if (data) stdout += data.toString();
      });

      proc.stderr.on("data", (data) => {
        if (data) stderr += data.toString();
      });

      proc.on("close", (code) => {
        if (code !== 0) {
          return reject({ error: `Process exited with code ${code}`, stderr });
        }
        resolve(stdout);
      });

      setTimeout(() => {
        proc.kill();
        resolve("time limit exceeded");
      }, timelimit * 1000);
    });
  });
};

const validatePythonTestCases = async (
  filePath,
  inputPath,
  expectedOutputPath,
  timelimit
) => {
  const localExpectedOutputPath = await downloadPythonOutputFromFirebase(
    expectedOutputPath
  );
  const jobId = path.basename(filePath).split(".")[0];
  const codeOutputPath = path.join(outputPath, `${jobId}_output.txt`);

  console.log(`python "${filePath}" < "${inputPath}" > "${codeOutputPath}"`);

  return new Promise((resolve, reject) => {
    const execCommand = exec(
      `python "${filePath}" < "${inputPath}" > "${codeOutputPath}"`,
      { timeout: timelimit * 1000 },
      async (error, stdout, stderr) => {
        if (stderr) {
          return reject(stderr);
        } else if (error) {
          if (error.killed) {
            return resolve("time limit exceeded");
          }
          return reject({ error: error.message, stderr });
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
  executePython,
  validatePythonTestCases,
};
