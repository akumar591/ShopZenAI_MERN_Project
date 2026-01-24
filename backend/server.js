import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import aiRouter from "./routes/aiRoute.js";

const app = express();

/* ===============================
   Middleware
================================ */
app.use(cors());
app.use(express.json());

/* ===============================
   DB & Services (safe for Vercel)
================================ */
let isConnected = false;

const initServices = async () => {
  if (!isConnected) {
    await connectDB();
    connectCloudinary();
    isConnected = true;
  }
};

app.use(async (req, res, next) => {
  try {
    await initServices();
    next();
  } catch (error) {
    console.error("Init error:", error);
    res.status(500).json({ message: "Server initialization failed" });
  }
});

/* ===============================
   Routes
================================ */
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/ai", aiRouter);

/* ===============================
   Health Check
================================ */
app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

/* ===============================
   Export (NO app.listen)
================================ */
export default app;
