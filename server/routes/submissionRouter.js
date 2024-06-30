const {
  getAllSubmissions,
  createSubmission,
  getUserSubmissions,
  editSubmission,
  deleteSubmission,
  getSingleSubmission,
} = require("../controllers/submissionController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

const router = require("express").Router();

router
  .route("/")
  .get(authenticateUser, authorizePermissions, getAllSubmissions)
  .post(authenticateUser, authorizePermissions, createSubmission);
router.get("/user/:userId", getUserSubmissions);
router
  .route("/:id")
  .get(authenticateUser, getSingleSubmission)
  .put(authenticateUser, authorizePermissions, editSubmission)
  .delete(authenticateUser, authorizePermissions, deleteSubmission);

module.exports = router;
