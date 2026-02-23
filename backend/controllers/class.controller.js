import Class from "../models/Class.js";
import User from "../models/User.js";
import crypto from "crypto";

export const createClass = async (req, res) => {
  const class_code = crypto.randomBytes(3).toString("hex").toUpperCase();

  const newClass = await Class.create({
    class_name: req.body.class_name,
    faculty_id: req.user._id,
    class_code
  });

  res.json(newClass);
};

export const addStudent = async (req, res) => {
  const { student_email } = req.body;
  const classData = await Class.findById(req.params.classId);

  if (!classData)
    return res.status(404).json({ success: false, message: "Class not found" });

  if (!classData.faculty_id.equals(req.user._id))
    return res.status(403).json({ success: false, message: "Not allowed" });

  if (classData.students.length >= 65)
    return res.status(400).json({ success: false, message: "Class full" });

  const student = await User.findOne({ email: student_email, role: "student" });
  if (!student)
    return res.status(404).json({ success: false, message: "Student not found" });

  if (classData.students.includes(student._id))
    return res.status(400).json({ success: false, message: "Already added" });

  classData.students.push(student._id);
  student.classes.push(classData._id);

  await classData.save();
  await student.save();

  res.json({ success: true, message: "Student added successfully" });
};

export const getClass = async (req, res) => {
  const classData = await Class.findById(req.params.classId);
  res.json(classData);
};

export const getMyClasses = async (req, res) => {
  const classes = req.user.role === "faculty"
    ? await Class.find({ faculty_id: req.user._id })
    : await Class.find({ _id: { $in: req.user.classes } });

  res.json(classes);
};