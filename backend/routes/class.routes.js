import express from "express";
import {
  createClass,
  addStudent,
  getClass,
  getMyClasses,
  joinClass,
  deleteClass,
  gradeStudent
} from "../controllers/class.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isFaculty } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, isFaculty, createClass);
router.post("/:classId/add-student", protect, isFaculty, addStudent);
router.get("/:classId", protect, getClass);
router.post("/join", protect, joinClass);
router.get("/", protect, getMyClasses);
router.delete("/:classId", protect, isFaculty, deleteClass);
router.post("/:classId/grade", protect, isFaculty, gradeStudent);

export default router;