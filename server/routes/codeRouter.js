const router = require("express").Router();
const {
  runCode,
  submitCode,
  // getStatus,
  // getAllSubmissions,
  // downloadSubmission,
} = require("../controllers/codeController");
const { authenticateUser } = require("../middlewares/authentication");

router.post("/run", authenticateUser, runCode);
router.post("/submit", authenticateUser, submitCode);

// router.get("/status/:id", getStatus);
// router.get("/submission/:id", authenticateUser, getAllSubmissions);
// router.get("/download/:id", downloadSubmission);

module.exports = router;
