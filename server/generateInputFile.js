const { v4: uuid } = require("uuid");
const bucket = require("./firebase/bucket");

const generateInputFile = async (input) => {
  const jobID = uuid();
  const filename = `${jobID}.txt`;
  const file = bucket.file(`inputs/${filename}`);

  await file.save(input, {
    resumable: false,
    metadata: {
      contentType: "text/plain",
    },
  });

  return `https://storage.googleapis.com/${bucket.name}/inputs/${filename}`;
};

module.exports = {
  generateInputFile,
};
