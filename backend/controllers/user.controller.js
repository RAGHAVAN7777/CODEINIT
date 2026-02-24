import User from "../models/User.js";
import Class from "../models/Class.js";

// Heartbeat: 2026-02-24T08:08:00Z

//
// 🟢 GET ALL STUDENTS (Faculty Only)
//
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password_hash");
    res.json(students);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//
// 🟢 GET CURRENT USER
//
export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//
// 🟢 GET STUDENT DOSSIER (Faculty Only)
//
export const getStudentDossier = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findById(id).select("-password_hash");

    if (!student || student.role !== "student") {
      return res.status(404).json({ success: false, message: "Student record not found" });
    }

    // Fetch all classes this student is enrolled in
    const enrolledClasses = await Class.find({ students: id })
      .select("class_name class_code grades")
      .populate("faculty_id", "name");

    // Extract student's specific stats from each class
    const academicFootprint = enrolledClasses.map(cls => {
      const gradeInfo = cls.grades.find(g => g.student_id && g.student_id.toString() === id);
      return {
        _id: cls._id,
        class_name: cls.class_name,
        class_code: cls.class_code,
        instructor: cls.faculty_id?.name || "Unknown Instructor",
        average: gradeInfo?.average || 0,
        rank: gradeInfo?.rank || 0
      };
    });

    res.json({
      student,
      academicFootprint
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//
// 🟢 REVOKE STUDENT (Faculty Only)
//
export const revokeStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findById(id);

    if (!student || student.role !== "student") {
      return res.status(404).json({ success: false, message: "Student record non-existent" });
    }

    // CLEANUP PROTOCOL: Remove student from all class registries and grades
    await Class.updateMany(
      { students: id },
      {
        $pull: {
          students: id,
          grades: { student_id: id }
        }
      }
    );

    // Final Revocation
    await User.findByIdAndDelete(id);

    res.json({ success: true, message: "Student access revoked and records purged" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//
// 🟢 SEARCH STUDENTS (For Peer-to-Peer sharing)
//
export const searchStudents = async (req, res) => {
  try {
    const { query } = req.query;

    let filter = { role: "student" };

    if (query && query.length >= 2) {
      // Escape regex special characters to prevent broken queries
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escapedQuery, $options: "i" } },
        { email: { $regex: escapedQuery, $options: "i" } }
      ];
    }

    const students = await User.find(filter)
      .select("name email role")
      .sort({ name: 1 })
      .limit(20);

    res.json(students);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
