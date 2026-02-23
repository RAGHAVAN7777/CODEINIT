import User from "../models/User.js";

//
// 🟢 GET ALL STUDENTS (Faculty Only)
//
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
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
