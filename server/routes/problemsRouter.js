const {
  getAllProblems,
  createProblem,
  getProblemById,
  editProblem,
  deleteProblem,
} = require("../controllers/problemsController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

const router = require("express").Router();

router
  .route("/")
  .get(getAllProblems)
  .post(
    authenticateUser,
    authorizePermissions("admin", "owner", "user"),
    createProblem
  );
router
  .route("/:id")
  .get(getProblemById)
  .put(authenticateUser, authorizePermissions("admin", "owner", "user"), editProblem)
  .delete(
    authenticateUser,
    authorizePermissions("admin", "owner", "user"),
    deleteProblem
  );

module.exports = router;
