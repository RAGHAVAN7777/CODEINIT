import Note from "../models/Note.js";
import Class from "../models/Class.js";

export const createNote = async (req, res) => {
  const { title, content, class_id } = req.body;

  if (class_id) {
    const classData = await Class.findById(class_id);
    if (!classData)
      return res.status(404).json({ success: false, message: "Class not found" });

    if (
      req.user.role === "student" &&
      !classData.students.includes(req.user._id)
    )
      return res.status(403).json({ success: false, message: "Not in class" });

    if (
      req.user.role === "faculty" &&
      !classData.faculty_id.equals(req.user._id)
    )
      return res.status(403).json({ success: false, message: "Not owner" });
  }

  const note = await Note.create({
    title,
    content,
    class_id,
    uploaded_by: req.user._id
  });

  res.json(note);
};

export const getNotes = async (req, res) => {
  const notes = await Note.find({
    $or: [
      { uploaded_by: req.user._id, class_id: null },
      { class_id: { $in: req.user.classes } }
    ]
  }).sort({ upload_date: -1 });

  res.json(notes);
};

export const getNote = async (req, res) => {
  const note = await Note.findById(req.params.noteId);
  if (!note)
    return res.status(404).json({ success: false, message: "Note not found" });

  if (!note.class_id && !note.uploaded_by.equals(req.user._id))
    return res.status(403).json({ success: false, message: "Forbidden" });

  res.json(note);
};

export const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.noteId);
  if (!note || !note.uploaded_by.equals(req.user._id))
    return res.status(403).json({ success: false, message: "Forbidden" });

  await note.deleteOne();
  res.json({ success: true, message: "Note deleted successfully" });
};