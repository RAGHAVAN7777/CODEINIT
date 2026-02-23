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
