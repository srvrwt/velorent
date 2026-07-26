const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==========================
// Register Controller
// ==========================
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message:
          "An account with this email already exists. Please sign in or use a different email.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Your account has been created successfully.",
      token,
      user,
    });
  } catch (error) {
    console.error("Register Error:");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
}

// ==========================
// Login Controller
// ==========================
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password. Please try again.",
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid email or password. Please try again.",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Welcome back! You've signed in successfully.",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
}

// ==========================
// Google Login
// ==========================
async function googleLogin(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required.",
      });
    }

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Get Google User
    const payload = ticket.getPayload();

    const { sub, email, name, picture } = payload;

    // Find user
    let user = await User.findOne({ email });

    // Create user if not found
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "",
        provider: "google",
        googleId: sub,
        avatar: picture,
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Return same response as normal login
    return res.status(200).json({
      message: "Google login successful.",
      token,
      user,
    });

  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

// ==========================
// Forgot Password
// ==========================
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    // Check if email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "We couldn't find your account.",
      });
    }

    // Generate Reset Token
    const resetToken = generateToken(user._id);

    // Reset Link
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    // Send Email
    await sendEmail(
      email,
      "Reset Your Password",
      `
      <h2>Password Reset</h2>

      <p>Hello ${user.name},</p>

      <p>Click the button below to reset your password.</p>

      <a href="${resetLink}" style="
        background:#000;
        color:#fff;
        padding:12px 20px;
        text-decoration:none;
        border-radius:5px;
        display:inline-block;
      ">
        Reset Password
      </a>

      <p>This link will expire according to your JWT settings.</p>

      <p>If you didn't request this, simply ignore this email.</p>
      `
    );

    res.status(200).json({
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
}

// ==========================
// Reset Password
// ==========================
async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    // Verify Reset Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find User
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "We couldn't find your account.",
      });
    }

    // Hash New Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update Password
    user.password = hashedPassword;

    await user.save();

    // Generate New Login Token
    const authToken = generateToken(user._id);

    res.status(200).json({
      message: "Password reset successful.",
      token: authToken,
      user,
    });
  } catch (error) {
    console.error("Reset Password Error:");
    console.error(error);

    res.status(400).json({
      message: "Invalid or expired token.",
    });
  }
}


module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
    googleLogin,
};