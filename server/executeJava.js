const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const {
  downloadCodeFromFirebase,
  downloadInputFromFirebase,
  downloadJavaOutputFromFirebase,
} = require("./firebase/downloadFileFromFirebase");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const sanitizeJobId = (jobId) => {
  // Replace non-alphanumeric characters with underscores and prepend with "Class" to ensure a valid class name
  return `Class_${jobId.replace(/[^a-zA-Z0-9]/g, "_")}`;
};

const executeJava = async (filepath, inputpath) => {
  try {
    const localFilePath = await downloadCodeFromFirebase(filepath);
    const localInputPath = await downloadInputFromFirebase(inputpath);

    const jobId = path.basename(localFilePath).split(".")[0];
    const sanitizedJobId = sanitizeJobId(jobId);

    const dirPath = path.dirname(localFilePath);
    const newJavaFile = path.join(dirPath, `${sanitizedJobId}.java`);

    // Read the original Java file contents
    const fileData = await fs.promises.readFile(localFilePath, "utf8");

    // Replace the class name with the sanitized job ID
    const modifiedData = fileData.replace(
      /public class \w+/,
      `public class ${sanitizedJobId}`
    );

    // Write the modified data to a new Java file
    await fs.promises.writeFile(newJavaFile, modifiedData, "utf8");

    // Compile the Java file
    await new Promise((resolve, reject) => {
      exec(
        `javac "${newJavaFile}"`,
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

    // Read the input file contents
    const inputData = await fs.promises.readFile(localInputPath, "utf8");

    // Execute the compiled Java file
    return new Promise((resolve, reject) => {
      const runCommand = `java -cp "${dirPath}" "${sanitizedJobId}"`;
      const process = exec(
        runCommand,
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
  } catch (error) {
    throw error;
  }
};

const validateJavaTestCases = async (filePath, inputpath, expectedOutputPath) => {
  const localFilePath = await downloadCodeFromFirebase(filePath);
  const localExpectedOutputPath = await downloadJavaOutputFromFirebase(
    expectedOutputPath
  );
  const jobId = path.basename(localFilePath).split(".")[0];
  const sanitizedJobId = sanitizeJobId(jobId);
  const dirPath = path.dirname(localFilePath);
  const newJavaFile = path.join(dirPath, `${sanitizedJobId}.java`);
  const codeOutputPath = path.join(outputPath, `${jobId}_output.txt`);

  // console.log({
  //   jobId,
  //   sanitizedJobId,
  //   dirPath,
  //   newJavaFile,
  //   filePath,
  //   inputpath,
  //   expectedOutputPath,
  //   codeOutputPath,
  // });

  return new Promise((resolve, reject) => {
    // Read the original Java file contents
    fs.readFile(localFilePath, "utf8", (err, fileData) => {
      if (err) {
        return reject({ error: err });
      }

      // Replace the class name with the sanitized job ID
      const modifiedData = fileData.replace(
        /public class \w+/,
        `public class ${sanitizedJobId}`
      );

      // Write the modified data to a new Java file
      fs.writeFile(newJavaFile, modifiedData, "utf8", (err) => {
        if (err) {
          return reject({ error: err });
        }

        // Compile the Java file
        exec(
          `javac "${newJavaFile}"`,
          { shell: "cmd.exe" },
          (error, stdout, stderr) => {
            if (error) {
              reject({ error, stderr });
              return;
            }
            if (stderr) {
              reject(stderr);
              return;
            }

            // Execute the compiled Java file with input redirection
            const runCommand = `java "${newJavaFile}" < "${inputpath}" > "${codeOutputPath}"`;

            exec(
              runCommand,
              { shell: "cmd.exe" },
              async (error, stdout, stderr) => {
                if (error) {
                  return reject({ error, stderr });
                } else if (stderr) {
                  return reject(stderr);
                }

                try {
                  // Read generated and expected output files
                  const generatedOutput = await fs.promises.readFile(
                    codeOutputPath,
                    "utf8"
                  );
                  const expectedOutput = await fs.promises.readFile(
                    localExpectedOutputPath,
                    "utf8"
                  );

                  // Compare generated output with expected output
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
          }
        );
      });
    });
  });
};

module.exports = {
  executeJava,
  validateJavaTestCases,
};
