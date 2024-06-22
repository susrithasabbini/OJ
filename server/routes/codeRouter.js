const router = require("express").Router(); //Used to create the API's routes
const {
  runCode,
  submitCode,
  getStatus,
  getAllSubmissions,
  downloadSubmission,
} = require("../controllers/codeController");
const { authenticateUser } = require("../middlewares/authentication");

// Code Related Route
router.post("/run", runCode);

router.post("/submit", authenticateUser, submitCode);

router.get("/status/:id", getStatus);

// Get All Submission
router.get("/submission/:id", authenticateUser, getAllSubmissions);

// Download Submission
router.get("/download/:id", downloadSubmission);

module.exports = router;
