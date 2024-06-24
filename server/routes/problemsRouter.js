const {
  getAllProblems,
  createProblem,
  getProblemById,
  editProblem,
  deleteProblem,
  getProblemBySlug,
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
    authorizePermissions("admin", "owner"),
    createProblem
  );

router.route("/:slug/description").get(getProblemBySlug);

router
  .route("/:id")
  .get(getProblemById)
  .put(authenticateUser, authorizePermissions("admin", "owner"), editProblem)
  .delete(
    authenticateUser,
    authorizePermissions("admin", "owner"),
    deleteProblem
  );

module.exports = router;
