const {
  downloadCodeFromFirebase,
  downloadCppOutputFromFirebase,
} = require("./firebase/downloadFileFromFirebase");

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

  return new Promise((resolve, reject) => {
    exec(
      `g++ "${filepath}" -o "${outPath}"`,
      { shell: "cmd.exe" },
      (error, stdout, stderr) => {
        if (error) {
          reject({ error: error.message, stderr });
        } else if (stderr) {
          reject({ stderr });
        } else {
          exec(
            `"${outPath}" < "${inputPath}"`,
            { shell: "cmd.exe" },
            (error, stdout, stderr) => {
              if (error) {
                reject({ error: error.message, stderr });
              } else if (stderr) {
                reject({ stderr });
              } else {
                resolve(stdout);
              }
            }
          );
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
  const outPath = path.join(path.dirname(filePath), `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    const execCommand = exec(
      `g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputPath}" > "${codeOutputPath}"`,
      { shell: "cmd.exe", timeout: timelimit * 1000 },
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

    setTimeout(() => {
      execCommand.kill();
    }, timelimit * 1000);
  });
};

module.exports = {
  executeCpp,
  validateCppTestCases,
};
