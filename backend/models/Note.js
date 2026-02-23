import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    content: {
      type: String,
      default: ""
    },

    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      default: null
    },

    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    visibility: {
      type: String,
      enum: ["personal", "public", "student-only"],
      default: "personal"
    },

    collaboration_mode: {
      type: String,
      enum: ["readonly", "editable"],
      default: "readonly"
    },

    attachment_url: {
      type: String,
      default: null
    },

    attachment_name: {
      type: String,
      default: null
    },

    attachment_mime: {
      type: String,
      default: null
    },

    attachment_size: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt automatically
  }
);

//
// 🔥 INDEXES (VERY IMPORTANT)
//

// For your main $or query
noteSchema.index({ uploaded_by: 1 });
noteSchema.index({ class_id: 1 });

// For sorting newest first
noteSchema.index({ createdAt: -1 });

export default mongoose.model("Note", noteSchema);
