const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const generateOtp = require("../utils/generateOtp");

// ================= SEND OTP =================
const sendOtp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or username already exists",
      });
    }

    // Delete old OTP if exists
    await Otp.deleteMany({ email });

    const otp = generateOtp();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    // Development only
    res.status(200).json({
      message: "OTP generated successfully",
      otp,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;

    if (!username || !email || !password || !otp) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const otpData = await Otp.findOne({ email });

    if (!otpData) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (otpData.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpData._id });

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await Otp.deleteOne({ _id: otpData._id });

    res.status(201).json({
      message: "Registration Successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET CURRENT USER =================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendOtp,
  register,
  login,
  getMe,
};