const router = require("express").Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");
const {
  getAllContests,
  createContest,
  deleteContest,
  getSingleContest,
  editContest,
  getRecentContests,
  registerContest,
  getContestLeaderboard,
  getAllContestsLeaderboard,
} = require("../controllers/contestController");

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin", "owner"), getAllContests)
  .post(
    authenticateUser,
    authorizePermissions("admin", "owner"),
    createContest
  );

router.get("/getRecentContests", getRecentContests);
router.get("/leaderboard", getAllContestsLeaderboard);
router.post("/:id/register", authenticateUser, registerContest);
router.get("/:id/leaderboard", authenticateUser, getContestLeaderboard);
router
  .route("/:id")
  .put(authenticateUser, authorizePermissions("admin", "owner"), editContest)
  .get(getSingleContest)
  .delete(
    authenticateUser,
    authorizePermissions("admin", "owner"),
    deleteContest
  );

module.exports = router;
