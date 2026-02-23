import Note from "../models/Note.js";
import Class from "../models/Class.js";

export const createNoteService = async (user, { title, content, class_id }) => {
  if (!title || !content)
    throw new Error("Title and content are required");

  if (class_id) {
    const classData = await Class.findById(class_id);
    if (!classData) throw new Error("Class not found");

    if (user.role === "student") {
      const inClass = classData.students.some(id =>
        id.equals(user._id)
      );

      if (!inClass) throw new Error("Not enrolled in class");
    }

    if (user.role === "faculty") {
      if (!classData.faculty_id.equals(user._id))
        throw new Error("Not authorized");
    }
  }

  const note = await Note.create({
    title,
    content,
    class_id: class_id || null,
    uploaded_by: user._id
  });

  return note;
};

export const getAccessibleNotesService = async (user) => {
  return await Note.find({
    $or: [
      { uploaded_by: user._id, class_id: null },
      { class_id: { $in: user.classes } }
    ]
  }).sort({ createdAt: -1 });
};

export const getNoteByIdService = async (user, noteId) => {
  const note = await Note.findById(noteId);
  if (!note) throw new Error("Note not found");

  const isOwner = note.uploaded_by.equals(user._id);

  if (!note.class_id) {
    if (!isOwner) throw new Error("Forbidden");
  } else {
    const inClass = user.classes.some(
      id => id.toString() === note.class_id.toString()
    );

    if (!isOwner && !inClass)
      throw new Error("Forbidden");
  }

  return note;
};

export const deleteNoteService = async (userId, noteId) => {
  const note = await Note.findById(noteId);
  if (!note) throw new Error("Note not found");

  if (!note.uploaded_by.equals(userId))
    throw new Error("Forbidden");

  await note.deleteOne();

  return { message: "Note deleted successfully" };
};
