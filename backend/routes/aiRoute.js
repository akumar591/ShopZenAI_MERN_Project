import express from "express";
import multer from "multer";
import { scanImage } from "../controllers/aiController.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post(
  "/scan-image",
  upload.single("image"),
  scanImage
);

export default router;
