import express from "express";
import authUser from "../middleware/auth.js";
import {
  loginUser,
  registerUser,
  adminlogin,
  getUserProfile
} from "../controllers/userControllers.js";

const userRouter = express.Router(); // ✅ MISSING LINE

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminlogin);

// 👤 PROFILE
userRouter.get("/profile", authUser, getUserProfile);

export default userRouter;
