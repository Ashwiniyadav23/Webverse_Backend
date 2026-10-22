const User = require("../models/User");

const allowedRoles = ["super_admin", "school_admin", "teacher", "student"];

async function updateUserRole(req, res) {
  const { role } = req.body;

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  if (req.user._id.toString() === req.params.userId) {
    return res.status(403).json({
      success: false,
      message: "You cannot change your own role",
    });
  }

  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { role },
    { new: true, runValidators: true }
  ).select("name email role schoolId");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    message: "User role updated successfully",
    user,
  });
}

module.exports = { updateUserRole };
