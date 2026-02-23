import express from "express";
import { getMe, getAllStudents } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isFaculty } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/", protect, isFaculty, getAllStudents);

export default router;