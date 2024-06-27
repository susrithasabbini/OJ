const { v4: uuid } = require("uuid");
const bucket = require("./bucket");

const saveFileToFirebase = async (folder, format, filePath) => {
  try {
    const jobID = uuid();
    const filename = `${jobID}.${format}`;
    const file = bucket.file(`${folder}/${filename}`);

    await file.save(filePath, {
      resumable: false,
      metadata: {
        contentType: "text/plain",
      },
    });

    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${folder}/${filename}`;
    return fileUrl;
  } catch (error) {
    throw new Error(`Failed to save file to Firebase: ${error.message}`);
  }
};

module.exports = {
  saveFileToFirebase,
};
