import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import classRoutes from "./routes/class.routes.js";
import noteRoutes from "./routes/note.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

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

// Health check
app.get("/", (req, res) => {
  res.send("Campus Notes API Running 🚀");
});

export default app;
