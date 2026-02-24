import Note from "../models/Note.js";
import Class from "../models/Class.js";
import Notification from "../models/Notification.js";
import { uploadFileToBackblaze, deleteFileFromBackblaze } from "../services/backblaze.service.js";

const removeAttachmentFile = async (attachmentKey) => {
  if (!attachmentKey) return;
  await deleteFileFromBackblaze(attachmentKey);
};

//
// 🟢 CREATE NOTE (Personal or Class)
//
export const createNote = async (req, res) => {
  try {
    const { title, content, visibility, collaboration_mode } = req.body;
    const class_id = req.body.class_id && req.body.class_id !== "null" ? req.body.class_id : null;

    if (!title || (!content && !req.file)) {
      return res.status(400).json({
        success: false,
        message: "Title and either content or attachment are required"
      });
    }

    let finalVisibility = visibility || (class_id ? "public" : "personal");

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
            message: "Not authorized to post in this class"
          });
        }
        // Faculty cannot create student-only notes
        if (finalVisibility === "student-only") {
          finalVisibility = "public";
        }
      }
    } else {
      // If no class_id, it must be personal
      finalVisibility = "personal";
    }

    let attachment = null;
    if (req.file) {
      attachment = await uploadFileToBackblaze(req.file);
    }

    const note = await Note.create({
      title,
      content: content || "",
      class_id: class_id || null,
      uploaded_by: req.user._id,
      visibility: finalVisibility,
      collaboration_mode: collaboration_mode || "readonly",
      attachment_url: attachment ? attachment.url : null,
      attachment_key: attachment ? attachment.key : null,
      attachment_name: req.file ? req.file.originalname : null,
      attachment_mime: req.file ? req.file.mimetype : null,
      attachment_size: req.file ? req.file.size : null
    });

    // Create notifications for class notes
    if (class_id && finalVisibility !== "personal") {
      const classData = await Class.findById(class_id);
      if (classData) {
        let recipients = [];
        if (finalVisibility === "student-only") {
          recipients = classData.students.filter(id => !id.equals(req.user._id));
        } else {
          // Public: all students + faculty (if not author)
          recipients = classData.students.filter(id => !id.equals(req.user._id));
          if (!classData.faculty_id.equals(req.user._id)) {
            recipients.push(classData.faculty_id);
          }
        }

        const notifications = recipients.map(userId => ({
          recipient: userId,
          sender: req.user._id,
          title: "New Academic Fragment",
          message: `${req.user.name} shared a note: ${title}`,
          type: "note_shared",
          link: `/notes`
        }));

        if (notifications.length > 0) {
          await Notification.insertMany(notifications);
        }
      }
    }

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
    let query;

    if (req.user.role === "faculty") {
      // Faculty behavior:
      // 1. Any note they uploaded (Personal OR Class)
      // 2. Any note in a class they manage EXCEPT student-only ones
      const facultyClasses = await Class.find({ faculty_id: req.user._id }).select("_id");
      const classIds = facultyClasses.map(c => c._id);

      query = {
        $or: [
          { uploaded_by: req.user._id }, // Their own notes
          { class_id: { $in: classIds }, visibility: "public" } // Public notes in their classes
        ]
      };
    } else {
      // Student behavior:
      // 1. Personal notes (class_id: null)
      // 2. Class notes in enrolled classes (both public and student-only)
      query = {
        $or: [
          { uploaded_by: req.user._id, class_id: null },
          { class_id: { $in: req.user.classes } }
        ]
      };
    }

    const notes = await Note.find(query)
      .populate("uploaded_by", "name email")
      .sort({ createdAt: -1 });

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
    const note = await Note.findById(req.params.noteId).populate("uploaded_by", "name email role");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    const isOwner = note.uploaded_by._id.equals(req.user._id);

    if (note.visibility === "personal") {
      // Personal note: only owner
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Only uploader can access personal notes"
        });
      }
    } else if (note.visibility === "student-only") {
      // Student-only: members in class EXCEPT faculty
      if (req.user.role === "faculty") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Faculty cannot access student-only notes"
        });
      }

      const inClass = req.user.classes.some(
        id => id.toString() === note.class_id.toString()
      );

      if (!isOwner && !inClass) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not a member of this class"
        });
      }
    } else {
      // Public Class note: members or class faculty
      const inClass = req.user.classes.some(
        id => id.toString() === note.class_id.toString()
      );

      let isClassFaculty = false;
      if (req.user.role === "faculty") {
        const classData = await Class.findById(note.class_id);
        if (classData && classData.faculty_id.equals(req.user._id)) {
          isClassFaculty = true;
        }
      }

      if (!isOwner && !inClass && !isClassFaculty) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Access denied"
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
// 🟢 UPDATE NOTE
//
export const updateNote = async (req, res) => {
  try {
    const { title, content, visibility, collaboration_mode } = req.body;
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    const isOwner = note.uploaded_by.equals(req.user._id);

    // Visibility Check (Copy of getNote logic for simplicity)
    const canAccess = async () => {
      if (note.visibility === "personal") return isOwner;
      if (note.visibility === "student-only") {
        if (req.user.role === "faculty") return false;
        return req.user.classes.some(id => id.toString() === note.class_id.toString());
      }
      // Public
      const inClass = req.user.classes.some(id => id.toString() === note.class_id.toString());
      let isClassFaculty = false;
      if (req.user.role === "faculty") {
        const classData = await Class.findById(note.class_id);
        if (classData && classData.faculty_id.equals(req.user._id)) {
          isClassFaculty = true;
        }
      }
      return inClass || isClassFaculty || isOwner;
    };

    if (!(await canAccess())) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied"
      });
    }

    // Edit permission check:
    // Only owner can update visibility or collaboration_mode.
    // Collaboration must be 'editable' for others to update content.
    if (!isOwner) {
      if (note.collaboration_mode !== "editable") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: This note is read-only"
        });
      }
      // Non-owners can only update content
      if (visibility || collaboration_mode || title || req.file) {
        return res.status(403).json({
          success: false,
          message: "Only the owner can update settings"
        });
      }
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (visibility && isOwner) note.visibility = visibility;
    if (collaboration_mode && isOwner) note.collaboration_mode = collaboration_mode;

    if (req.file && isOwner) {
      const uploadedAttachment = await uploadFileToBackblaze(req.file);
      await removeAttachmentFile(note.attachment_key);

      note.attachment_url = uploadedAttachment.url;
      note.attachment_key = uploadedAttachment.key;
      note.attachment_name = req.file.originalname;
      note.attachment_mime = req.file.mimetype;
      note.attachment_size = req.file.size;
    }

    await note.save();

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

    await removeAttachmentFile(note.attachment_key);
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
