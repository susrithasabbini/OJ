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

module.exports = {
  executePython,
};
