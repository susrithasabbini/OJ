const path = require("path");
const bucket = require("./bucket");

const downloadTestInputsFromFirebase = async (firebaseUrl) => {
  const filename = path.basename(firebaseUrl);
  const tempFilePath = path.join(__dirname, "../testinputs/", filename);

  const file = bucket.file(`testinputs/${filename}`);
  await file.download({ destination: tempFilePath });

  return tempFilePath;
};

const downloadCppOutputFromFirebase = async (firebaseUrl) => {
  const filename = path.basename(firebaseUrl);
  const tempFilePath = path.join(__dirname, "../cppoutputs/", filename);

  const file = bucket.file(`cppoutputs/${filename}`);
  await file.download({ destination: tempFilePath });

  return tempFilePath;
};

const downloadJavaOutputFromFirebase = async (firebaseUrl) => {
  const filename = path.basename(firebaseUrl);
  const tempFilePath = path.join(__dirname, "../javaoutputs/", filename);

  const file = bucket.file(`javaoutputs/${filename}`);
  await file.download({ destination: tempFilePath });

  return tempFilePath;
};

const downloadPythonOutputFromFirebase = async (firebaseUrl) => {
  const filename = path.basename(firebaseUrl);
  const tempFilePath = path.join(__dirname, "../pythonoutputs/", filename);

  const file = bucket.file(`pythonoutputs/${filename}`);
  await file.download({ destination: tempFilePath });

  return tempFilePath;
};

module.exports = {
  downloadJavaOutputFromFirebase,
  downloadPythonOutputFromFirebase,
  downloadCppOutputFromFirebase,
  downloadTestInputsFromFirebase,
};
