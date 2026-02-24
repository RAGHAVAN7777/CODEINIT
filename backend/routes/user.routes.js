import express from "express";
import { getMe, getAllStudents, getStudentDossier, revokeStudent } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isFaculty } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/", protect, isFaculty, getAllStudents);
router.get("/:id/dossier", protect, isFaculty, getStudentDossier);
router.delete("/:id", protect, isFaculty, revokeStudent);

export default router;