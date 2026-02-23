import Class from "../models/Class.js";
import User from "../models/User.js";
import crypto from "crypto";

//
// 🟢 CREATE CLASS (Faculty Only)
//
export const createClass = async (req, res) => {
  try {
    const { class_name } = req.body;

    if (!class_name) {
      return res.status(400).json({
        success: false,
        message: "Class name is required"
      });
    }

    // Generate 6-character class code
    const class_code = crypto.randomBytes(3).toString("hex").toUpperCase();

    const newClass = await Class.create({
      class_name,
      faculty_id: req.user._id,
      class_code,
      students: []
    });

    res.status(201).json(newClass);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//
// 🟢 ADD STUDENT TO CLASS (Faculty Only)
//
export const addStudent = async (req, res) => {
  try {
    const { student_email } = req.body;
    const { classId } = req.params;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    // Only class creator can add students
    if (!classData.faculty_id.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Not allowed"
      });
    }

    if (classData.students.length >= 65) {
      return res.status(400).json({
        success: false,
        message: "Class full (max 65 students)"
      });
    }

    const student = await User.findOne({
      email: student_email,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Prevent duplicates
    const alreadyAdded = classData.students.some(id =>
      id.equals(student._id)
    );

    if (alreadyAdded) {
      return res.status(400).json({
        success: false,
        message: "Student already added"
      });
    }

    // Update both sides
    classData.students.push(student._id);
    student.classes.push(classData._id);

    await classData.save();
    await student.save();

    res.json({
      success: true,
      message: "Student added successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//
// 🟢 GET SINGLE CLASS
//
export const getClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.classId)
      .populate("faculty_id", "name email")
      .populate("students", "name email");

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    res.json(classData);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//
// 🟢 GET MY CLASSES
//
export const getMyClasses = async (req, res) => {
  try {
    let classes;

    if (req.user.role === "faculty") {
      classes = await Class.find({
        faculty_id: req.user._id
      }).sort({ createdAt: -1 });
    } else {
      classes = await Class.find({
        _id: { $in: req.user.classes }
      }).sort({ createdAt: -1 });
    }

    res.json(classes);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
