const { execSync } = require("child_process"); //Provides the ability to spawn new processes, execute shell commands, and communicate with them
const path = require("path");

const executePy = (filepath, userInput) => {
  const child = execSync(`python3 ${filepath}`, { input: userInput });

  return child.toString();
};

module.exports = {
  executePy,
};
