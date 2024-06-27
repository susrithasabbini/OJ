const { v4: uuid } = require("uuid");
const bucket = require("./firebase/bucket");

const generateFile = async (format, content) => {
  const jobID = uuid();
  const filename = `${jobID}.${format}`;
  const file = bucket.file(`codes/${filename}`);

  await file.save(content, {
    resumable: false,
    metadata: {
      contentType: "text/plain",
    },
  });

  return `https://storage.googleapis.com/${bucket.name}/codes/${filename}`;
};

module.exports = {
  generateFile,
};
