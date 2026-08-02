const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  googleLogin,
    getMe,
} = require("../controllers/authController");
const {
  protect,
} = require("../middleware/authMiddleware");


router.get(
  "/me",
  protect,
  getMe
);

// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/google", googleLogin);

module.exports = router;