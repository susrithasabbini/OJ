const {
  downloadJavaOutputFromFirebase,
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

const executeJava = (filepath, inputPath, timelimit) => {
  return new Promise((resolve, reject) => {
    // Read the input file contents
    fs.readFile(inputPath, "utf8", (err, inputData) => {
      if (err) {
        return reject({ error: err });
      }

      // Execute the compiled Java file
      const runCommand = `java "${filepath}"`;

      const execCommand = exec(
        runCommand,
        { timeout: timelimit * 1000 },
        (error, stdout, stderr) => {
          if (stderr) {
            reject({ stderr });
            return;
          }
          if (error) {
            if (error.killed) {
              return resolve("time limit exceeded");
            }
            reject({ error: error.message, stderr });
            return;
          }
          resolve(stdout);
        }
      );

      // Pass the input data to the process stdin
      execCommand.stdin.end(inputData);

      // Kill the process if it exceeds the time limit
      setTimeout(() => {
        execCommand.kill();
      }, timelimit * 1000);
    });
  });
};

const validateJavaTestCases = async (
  filePath,
  inputPath,
  expectedOutputPath,
  timelimit
) => {
  const localExpectedOutputPath = await downloadJavaOutputFromFirebase(
    expectedOutputPath
  );
  const jobId = path.basename(filePath).split(".")[0];
  const codeOutputPath = path.join(outputPath, `${jobId}_output.txt`);

  console.log(`java "${filePath}" < "${inputPath}" > "${codeOutputPath}"`);

  return new Promise((resolve, reject) => {
    const execCommand = exec(
      `java "${filePath}" < "${inputPath}" > "${codeOutputPath}"`,
      { timeout: timelimit * 1000 },
      async (error, stdout, stderr) => {
        if (stderr) {
          reject(stderr);
          return;
        }
        if (error) {
          if (error.killed) {
            return resolve("time limit exceeded");
          }
          reject({ error, stderr });
          return;
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
  executeJava,
  validateJavaTestCases,
};
