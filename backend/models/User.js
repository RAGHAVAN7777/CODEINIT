import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password_hash: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["student", "faculty"],
      required: true
    },

    classes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Class",
      default: []
    }
  },
  {
    timestamps: true
  }
);

//
// 🔥 INDEXES
//

// Fast login lookup
// userSchema.index({ email: 1 }, { unique: true }); // Redundant since unique: true is in schema

// Optional: speed up class membership queries
userSchema.index({ classes: 1 });

//
// 🔥 Hide sensitive fields automatically
//

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password_hash;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("User", userSchema);
