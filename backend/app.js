import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

export default app;
