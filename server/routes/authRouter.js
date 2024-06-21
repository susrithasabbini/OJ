const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/authentication");
const {
  login,
  register,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// express router
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", authenticateUser, logout);
router.post("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

module.exports = router;
