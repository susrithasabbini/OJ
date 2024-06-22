const { execSync } = require("child_process"); //'execSync' is used to run shell commands synchronously
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, userInput) => {
  const jobId = path.basename(filepath).split(".")[0]; //provide the name of file which we want to execute (i.e. 6d13b37e-c678-4368-b36e-61d05b5d0bd3.cpp -> 6d13b37e-c678-4368-b36e-61d05b5d0bd3)
  const outPath = path.join(outputPath, `${jobId}.out`);

  const child = execSync(
    `g++ ${filepath} -o ${outPath} && cd ${outputPath} && .\\${jobId}.exe`,
    { input: userInput }
  );

  // console.log(child.toString());
  return child.toString();
};

module.exports = {
  executeCpp,
};
