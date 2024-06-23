const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const sanitizeJobId = (jobId) => {
  // Replace non-alphanumeric characters with underscores and prepend with "Class" to ensure a valid class name
  return `Class_${jobId.replace(/[^a-zA-Z0-9]/g, "_")}`;
};

const executeJava = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const sanitizedJobId = sanitizeJobId(jobId);
  const dirPath = path.dirname(filepath);
  const newJavaFile = path.join(dirPath, `${sanitizedJobId}.java`);

  return new Promise((resolve, reject) => {
    // Read the original Java file contents
    fs.readFile(filepath, "utf8", (err, fileData) => {
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
          `javac ${newJavaFile}`,
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

            // Read the input file contents
            fs.readFile(inputPath, "utf8", (err, inputData) => {
              if (err) {
                return reject({ error: err });
              }

              // Execute the compiled Java file
              const runCommand = `java -cp ${dirPath} ${sanitizedJobId}`;

              exec(
                runCommand,
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
                  resolve(stdout);
                }
              ).stdin.end(inputData); // Pass the input data to the process stdin
            });
          }
        );
      });
    });
  });
};

module.exports = {
  executeJava,
};
