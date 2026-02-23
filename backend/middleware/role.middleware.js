export const isFaculty = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  if (req.user.role !== "faculty") {
    return res.status(403).json({
      success: false,
      message: "Faculty only"
    });
  }

  next();
};


export const isStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Student only"
    });
  }

  next();
};
