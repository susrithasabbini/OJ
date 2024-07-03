const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");
const {
  getAllUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  getSingleUser,
  getUsersAddedData,
  getUserRolesData,
} = require("../controllers/userController");

// express router
router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin", "owner"), getAllUsers);

router.get(
  "/getUsersAdded",
  authenticateUser,
  authorizePermissions("admin", "owner"),
  getUsersAddedData
);

router.get(
  "/getUserRoles",
  authenticateUser,
  authorizePermissions("admin", "owner"),
  getUserRolesData
);
router.route("/showMe").get(authenticateUser, showCurrentUser);

router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

router.get("/:username", getSingleUser);

module.exports = router;
