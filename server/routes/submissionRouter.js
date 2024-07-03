const router = require("express").Router();
const {
  getAllSubmissions,
  createSubmission,
  getUserSubmissions,
  editSubmission,
  deleteSubmission,
  getSingleSubmission,
  getSubmissionsData,
} = require("../controllers/submissionController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

router
  .route("/getSubmissionsData")
  .get(
    authenticateUser,
    authorizePermissions("admin", "owner"),
    getSubmissionsData
  );

router
  .route("/")
  .get(
    authenticateUser,
    authorizePermissions("admin", "owner"),
    getAllSubmissions
  )
  .post(
    authenticateUser,
    authorizePermissions("admin", "owner"),
    createSubmission
  );

router.get("/user/:userId", getUserSubmissions);

router
  .route("/:id")
  .get(authenticateUser, getSingleSubmission)
  .put(authenticateUser, authorizePermissions("admin", "owner"), editSubmission)
  .delete(
    authenticateUser,
    authorizePermissions("admin", "owner"),
    deleteSubmission
  );

module.exports = router;
