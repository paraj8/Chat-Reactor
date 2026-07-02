const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  sendOtp,
  register,
  login,
  getMe,
} = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

module.exports = router;