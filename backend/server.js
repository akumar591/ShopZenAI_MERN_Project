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

// ===============================
// Middlewares
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// Init services ONCE (safe)
// ===============================
try {
  await connectDB();
  connectCloudinary();
  console.log("Services initialized");
} catch (err) {
  console.error("Startup error:", err.message);
}

// ===============================
// Routes
// ===============================
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/ai", aiRouter);

// ===============================
// Health check
// ===============================
app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

// ===============================
// Export for Vercel
// ===============================
export default app;
