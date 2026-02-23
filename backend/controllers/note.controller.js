import Note from "../models/Note.js";
import Class from "../models/Class.js";

//
// 🟢 CREATE NOTE (Personal or Class)
//
export const createNote = async (req, res) => {
  try {
    const { title, content, class_id } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required"
      });
    }

    // If it's a class note
    if (class_id) {
      const classData = await Class.findById(class_id);

      if (!classData) {
        return res.status(404).json({
          success: false,
          message: "Class not found"
        });
      }

      // Student must belong to class
      if (req.user.role === "student") {
        const inClass = classData.students.some(id =>
          id.equals(req.user._id)
        );

        if (!inClass) {
          return res.status(403).json({
            success: false,
            message: "Not enrolled in class"
          });
        }
      }

      // Faculty must own class
      if (req.user.role === "faculty") {
        if (!classData.faculty_id.equals(req.user._id)) {
          return res.status(403).json({
            success: false,
            message: "Not authorized"
          });
        }
      }
    }

    const note = await Note.create({
      title,
      content,
      class_id: class_id || null,
      uploaded_by: req.user._id
    });

    res.status(201).json(note);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//
// 🟢 GET ALL ACCESSIBLE NOTES
//
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      $or: [
        { uploaded_by: req.user._id, class_id: null },
        { class_id: { $in: req.user.classes } }
      ]
    }).sort({ createdAt: -1 });

    res.json(notes);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//
// 🟢 GET SINGLE NOTE
//
export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    const isOwner = note.uploaded_by.equals(req.user._id);

    if (!note.class_id) {
      // Personal note
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "Forbidden"
        });
      }
    } else {
      // Class note
      const inClass = req.user.classes.some(
        id => id.toString() === note.class_id.toString()
      );

      if (!isOwner && !inClass) {
        return res.status(403).json({
          success: false,
          message: "Forbidden"
        });
      }
    }

    res.json(note);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//
// 🟢 DELETE NOTE
//
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    if (!note.uploaded_by.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: "Note deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
