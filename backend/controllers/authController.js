const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  if (process.env.NODE_ENV !== "production") {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return null;
};

// Register
const register = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot password - generate OTP and email it
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: "If that email exists, an OTP was sent" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordOtpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const transporter = await createTransporter();
    let emailSent = false;
    let previewUrl = null;

    if (transporter) {
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_USER || "no-reply@example.com",
        to: user.email,
        subject: "Your password reset OTP",
        text: `Your password reset code is: ${otp}. It expires in 15 minutes.`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        emailSent = true;
        previewUrl = nodemailer.getTestMessageUrl(info) || null;
      } catch (err) {
        console.error("Failed to send OTP email:", err.message || err);
      }
    }

    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: "OTP sent to your email address",
        previewUrl,
        devMode: process.env.NODE_ENV !== "production",
        otp: process.env.NODE_ENV !== "production" ? otp : undefined,
      });
    }

    if (process.env.NODE_ENV !== "production") {
      return res.status(200).json({
        success: true,
        message: "OTP generated in development mode. Configure SMTP to send email.",
        otp,
        devMode: true,
      });
    }

    return res.status(500).json({ success: false, message: "Unable to send OTP email. Please configure SMTP settings or try again later." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset password using OTP
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ success: false, message: "Email, OTP and newPassword are required" });

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOtp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    if (user.resetPasswordOtpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.resetPasswordOtp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    // Hash new password and save
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getCurrentUser, forgotPassword, resetPassword };
