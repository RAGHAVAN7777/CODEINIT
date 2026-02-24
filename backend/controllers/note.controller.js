import Note from "../models/Note.js";
import Class from "../models/Class.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

//
// 🟢 CREATE NOTE (Personal or Class)
//
export const createNote = async (req, res) => {
  try {
    const { title, content, class_id, visibility, collaboration_mode } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required"
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

    const note = await Note.create({
      title,
      content,
      class_id: class_id || null,
      uploaded_by: req.user._id,
      visibility: finalVisibility,
      collaboration_mode: collaboration_mode || "readonly"
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
      const facultyClasses = await Class.find({ faculty_id: req.user._id }).select("_id");
      const classIds = facultyClasses.map(c => c._id);

      query = {
        $and: [
          { hidden_for: { $ne: req.user._id } },
          {
            $or: [
              { uploaded_by: req.user._id },
              { class_id: { $in: classIds }, visibility: "public" },
              { shared_with: req.user._id }
            ]
          }
        ]
      };
    } else {
      query = {
        $and: [
          { hidden_for: { $ne: req.user._id } },
          {
            $or: [
              { uploaded_by: req.user._id, class_id: null },
              { class_id: { $in: req.user.classes } },
              { shared_with: req.user._id }
            ]
          }
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

      if (!isOwner && !inClass && !isClassFaculty && !note.shared_with.some(id => id.equals(req.user._id))) {
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
      if (visibility || collaboration_mode || title) {
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
    const { type } = req.query; // "me" or "all"
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    const isOwner = note.uploaded_by.equals(req.user._id);

    if (type === "me") {
      // "Delete for Me" is always allowed if you can see the note
      // (Visibility check could be added here too, but getNotes already filters)
      if (!note.hidden_for.some(id => id.equals(req.user._id))) {
        note.hidden_for.push(req.user._id);
        await note.save();
      }
      return res.json({ success: true, message: "Note hidden locally" });
    }

    // "Delete for Everyone"
    const canDeleteAll = isOwner || note.collaboration_mode === "editable";

    if (!canDeleteAll) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to delete this note for everyone"
      });
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: "Note deleted for everyone"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//
// 🟢 SHARE NOTE (Peer-to-Peer)
//
export const shareNote = async (req, res) => {
  try {
    const { userIds, email } = req.body;
    const { noteId } = req.params;
    console.log(`[SHARE_PROTOCOL] Attempting share for note: ${noteId} with email: ${email} and ids: ${userIds}`);

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    // Only owner can share
    if (!note.uploaded_by.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: "Only the owner can share this fragment" });
    }

    let targetUserIds = [...(userIds || [])];

    // If an email is provided manually, resolve it to an ID
    if (email) {
      const userByEmail = await User.findOne({ email: email.toLowerCase().trim() });
      if (!userByEmail) {
        return res.status(404).json({
          success: false,
          message: `Colleague with email "${email}" not located in the academic registry`
        });
      }
      if (!targetUserIds.includes(userByEmail._id.toString())) {
        targetUserIds.push(userByEmail._id.toString());
      }
    }

    if (targetUserIds.length === 0) {
      return res.status(400).json({ success: false, message: "No recipients specified" });
    }

    // Add unique users to shared_with
    let count = 0;
    for (const userId of targetUserIds) {
      if (!note.shared_with.some(existingId => existingId.toString() === userId)) {
        note.shared_with.push(userId);
        count++;
      }
    }

    if (count > 0) {
      await note.save();

      // Notifications
      const notifications = targetUserIds.map(userId => ({
        recipient: userId,
        sender: req.user._id,
        title: "Peer Protocol: Fragment Received",
        message: `${req.user.name} shared an academic fragment with you: ${note.title}`,
        type: "note_shared",
        link: `/notes`
      }));

      await Notification.insertMany(notifications);
    }

    res.json({ success: true, message: `Note shared with ${count} new recipients` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
