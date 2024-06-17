const express = require("express");
const {
  register,
  verifyEmail,
  login,
  logout,
  resetPassword,
  forgotPassword,
} = require("../controllers/authController");
const { authenticateUser } = require("../middlewares/authentication");
const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.delete("/logout", authenticateUser, logout);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

module.exports = router;
