import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

/* ================= TOKEN HELPERS ================= */
const createUserToken = (id) => {
  return jwt.sign(
    { id, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const createAdminToken = () => {
  return jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

/* ================= USER LOGIN ================= */
const loginUser = async (req, res) => {
  try {
    // 🔐 FRONTEND LOCK CHECK
    if (req.headers["x-admin-session"] === "true") {
      return res.status(403).json({
        success: false,
        message: "Admin is logged in. User login disabled.",
      });
    }

    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = createUserToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= USER REGISTER ================= */
const registerUser = async (req, res) => {
  try {
    if (req.headers["x-admin-session"] === "true") {
      return res.status(403).json({
        success: false,
        message: "Admin is logged in. Registration disabled.",
      });
    }

    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createUserToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADMIN LOGIN ================= */
const adminlogin = async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });
  }

  const token = createAdminToken();

  res.json({
    success: true,
    message: "Admin login successful",
    token,
  });
};

/* ================= ADMIN LOGOUT ================= */
const adminLogout = async (req, res) => {
  res.json({
    success: true,
    message: "Admin logged out successfully",
  });
};

/* ================= USER PROFILE ================= */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel
      .findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export {
  loginUser,
  registerUser,
  adminlogin,
  adminLogout,
  getUserProfile,
};
