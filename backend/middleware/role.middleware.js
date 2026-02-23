export const isFaculty = (req, res, next) => {
  if (req.user.role !== "faculty") {
    return res.status(403).json({ success: false, message: "Faculty only" });
  }
  next();
};