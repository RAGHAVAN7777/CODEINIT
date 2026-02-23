import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", default: null },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  upload_date: { type: Date, default: Date.now }
});

export default mongoose.model("Note", noteSchema);