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
const upload = require("../multer/upload");

const router = require("express").Router();

router
  .route("/")
  .get(getAllProblems)
  .post(
    authenticateUser,
    authorizePermissions("admin", "owner"),
    upload.fields([
      { name: "input", maxCount: 1 },
      { name: "cppoutput", maxCount: 1 },
      { name: "pythonoutput", maxCount: 1 },
      { name: "javaoutput", maxCount: 1 },
    ]),
    createProblem
  );

router.route("/:slug/description").get(getProblemBySlug);

router
  .route("/:id")
  .get(getProblemById)
  .put(
    authenticateUser,
    authorizePermissions("admin", "owner"),
    upload.fields([
      { name: "input", maxCount: 1 },
      { name: "cppoutput", maxCount: 1 },
      { name: "pythonoutput", maxCount: 1 },
      { name: "javaoutput", maxCount: 1 },
    ]),
    editProblem
  )
  .delete(
    authenticateUser,
    authorizePermissions("admin", "owner"),
    deleteProblem
  );

module.exports = router;
