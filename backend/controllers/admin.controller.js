import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import crypto from "crypto"

import sendEmail from "../utils/sendEmail.js";

/**
 * @desc Register Admin (One time only)
 * @route POST /api/admin/register
 */
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};




/**
 * @desc Login Admin
 * @route POST /api/admin/login
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // CLICKABLE RESET LINK
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    //  Send Email
    await sendEmail({
      to: admin.email,
      subject: "Reset your VyomVision HRMS password",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
        <br/>
        <p>– VyomVision HRMS Team</p>
      `,
    });

    res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }

    // Hash token to match DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    //Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    // Clear reset fields
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
