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
// 🟢 JOIN CLASS (Student Only)
//
export const joinClass = async (req, res) => {
  try {
    const { class_code } = req.body;

    if (!class_code) {
      return res.status(400).json({
        success: false,
        message: "Class code is required"
      });
    }

    const classData = await Class.findOne({ class_code: class_code.toUpperCase() });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Invalid class code"
      });
    }

    // Role check (redundant if route is protected but good for safety)
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can join classes"
      });
    }

    // Prevent duplicates
    const alreadyJoined = classData.students.some(id =>
      id.equals(req.user._id)
    );

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this class"
      });
    }

    if (classData.students.length >= 65) {
      return res.status(400).json({
        success: false,
        message: "Class is full"
      });
    }

    // Update both sides
    classData.students.push(req.user._id);
    const student = await User.findById(req.user._id);
    student.classes.push(classData._id);

    await classData.save();
    await student.save();

    res.json({
      success: true,
      message: `Successfully joined ${classData.class_name}`,
      data: classData
    });

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
//
// 🔴 DELETE CLASS (Faculty Only)
//
export const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    // Security check: Only the owning faculty can delete
    if (!classData.faculty_id.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You are not the owner of this class"
      });
    }

    // Step 1: Remove class ID from all students' classes array
    await User.updateMany(
      { _id: { $in: classData.students } },
      { $pull: { classes: classId } }
    );

    // Step 2: Delete the class document
    await Class.findByIdAndDelete(classId);

    res.json({
      success: true,
      message: "Class and all associations deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//
// 🟢 GRADE STUDENT & AUTO-RANK (Faculty Only)
//
export const gradeStudent = async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentId, score } = req.body;

    if (!studentId || score === undefined) {
      return res.status(400).json({
        success: false,
        message: "Student ID and score are required"
      });
    }

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    // Security check
    if (!classData.faculty_id.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only the faculty owner can grade students"
      });
    }

    // Find student in grades array
    let studentGrade = classData.grades.find(g => g.student_id.equals(studentId));

    if (!studentGrade) {
      // Create new entry if doesn't exist
      studentGrade = {
        student_id: studentId,
        scores: [score],
        average: score,
        rank: 0
      };
      classData.grades.push(studentGrade);
    } else {
      // Update existing entry
      studentGrade.scores.push(score);
      const sum = studentGrade.scores.reduce((a, b) => a + b, 0);
      studentGrade.average = sum / studentGrade.scores.length;
    }

    // --- AUTO-RANKING LOGIC ---
    // Sort students by average descending
    const sortedGrades = classData.grades
      .filter(g => g.scores.length > 0)
      .sort((a, b) => b.average - a.average);

    // Assign ranks
    sortedGrades.forEach((g, index) => {
      // Handle ties (same average = same rank)
      if (index > 0 && g.average === sortedGrades[index - 1].average) {
        g.rank = sortedGrades[index - 1].rank;
      } else {
        g.rank = index + 1;
      }
    });

    await classData.save();

    res.json({
      success: true,
      message: "Grade recorded and ranks updated",
      grades: classData.grades
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
