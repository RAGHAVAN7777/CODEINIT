import express from "express";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote
} from "../controllers/note.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadNoteAttachment } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", protect, uploadNoteAttachment.single("attachment"), createNote);
router.get("/", protect, getNotes);
router.get("/:noteId", protect, getNote);
router.put("/:noteId", protect, uploadNoteAttachment.single("attachment"), updateNote);
router.delete("/:noteId", protect, deleteNote);

export default router;