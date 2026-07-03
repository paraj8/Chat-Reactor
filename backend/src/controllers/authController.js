const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");

const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

// ================= SEND OTP =================
const sendOtp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or username already exists",
      });
    }

    // Delete old OTP
    await Otp.deleteMany({ email });

    // Generate new OTP
    const otp = generateOtp();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP
    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    // Send OTP Email
    try {
      await sendEmail(email, otp);

      return res.status(200).json({
        message: "OTP sent successfully",
      });
    } catch (err) {
      console.error("❌ EMAIL ERROR");
      console.error(err);

      return res.status(500).json({
        message: "Failed to send OTP email",
        error: err.message,
      });
    }
  } catch (error) {
    console.error("❌ SEND OTP ERROR");
    console.error(error);

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

    // Double check user doesn't already exist
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    // Delete OTP after successful registration
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
    console.error(error);

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

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

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
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET CURRENT USER =================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    res.status(200).json(user);
  } catch (error) {
    console.error(error);

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