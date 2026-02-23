import Class from "../models/Class.js";
import User from "../models/User.js";
import crypto from "crypto";

export const createClassService = async (facultyId, class_name) => {
  const class_code = crypto.randomBytes(3).toString("hex").toUpperCase();

  const newClass = await Class.create({
    class_name,
    faculty_id: facultyId,
    class_code,
    students: []
  });

  return newClass;
};

export const addStudentService = async (facultyId, classId, student_email) => {
  const classData = await Class.findById(classId);
  if (!classData) throw new Error("Class not found");

  if (!classData.faculty_id.equals(facultyId))
    throw new Error("Not allowed");

  if (classData.students.length >= 65)
    throw new Error("Class full");

  const student = await User.findOne({
    email: student_email,
    role: "student"
  });

  if (!student) throw new Error("Student not found");

  const alreadyAdded = classData.students.some(id =>
    id.equals(student._id)
  );

  if (alreadyAdded)
    throw new Error("Student already added");

  classData.students.push(student._id);
  student.classes.push(classData._id);

  await classData.save();
  await student.save();

  return { message: "Student added successfully" };
};

export const getUserClassesService = async (user) => {
  if (user.role === "faculty") {
    return await Class.find({ faculty_id: user._id })
      .sort({ createdAt: -1 });
  }

  return await Class.find({
    _id: { $in: user.classes }
  }).sort({ createdAt: -1 });
};

export const getClassByIdService = async (classId) => {
  const classData = await Class.findById(classId)
    .populate("faculty_id", "name email")
    .populate("students", "name email");

  if (!classData) throw new Error("Class not found");

  return classData;
};
