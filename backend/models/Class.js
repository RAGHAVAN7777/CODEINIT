import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    class_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    faculty_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    class_code: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

//
// 🔥 INDEXES (IMPORTANT)
//

// Fast lookup by class code
// classSchema.index({ class_code: 1 }, { unique: true }); // Redundant since unique: true is in schema

// Faculty dashboard: get all classes created by faculty
classSchema.index({ faculty_id: 1 });

// Fast membership checks (when verifying student belongs to class)
classSchema.index({ students: 1 });

// Optional: sort by newest
classSchema.index({ createdAt: -1 });

export default mongoose.model("Class", classSchema);
