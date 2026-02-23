import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  class_name: { type: String, required: true },
  faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  class_code: { type: String, unique: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export default mongoose.model("Class", classSchema);