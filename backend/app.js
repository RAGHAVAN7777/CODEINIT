import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import classRoutes from "./routes/class.routes.js";
import noteRoutes from "./routes/note.routes.js";
import userRoutes from "./routes/user.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";
import notificationRoutes from "./routes/notification.routes.js";


const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/announcements", announcementRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Campus Notes API Running 🚀");
});

app.use((err, req, res, next) => {
  if (!err) return next();

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.code === "LIMIT_FILE_SIZE" ? "File exceeds 10MB limit" : err.message
    });
  }

  if (err.message === "Unsupported file type") {
    return res.status(400).json({
      success: false,
      message: "Unsupported file type"
    });
  }

  return next(err);
});

export default app;
