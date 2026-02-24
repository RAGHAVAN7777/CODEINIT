import express from "express";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  shareNote
} from "../controllers/note.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createNote);
router.get("/", protect, getNotes);
router.get("/:noteId", protect, getNote);
router.put("/:noteId", protect, updateNote);
router.post("/:noteId/share", protect, shareNote);
router.delete("/:noteId", protect, deleteNote);

export default router;