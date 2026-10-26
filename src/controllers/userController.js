const mongoose = require("mongoose");
const User = require("../models/User");

const allowedRoles = ["super_admin", "school_admin", "teacher", "student"];

async function updateUserRole(req, res) {
  try {
    const { role } = req.body;

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (!mongoose.isValidObjectId(req.params.userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
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
  } catch (error) {
    console.error("Update user role error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update user role",
    });
  }
}

module.exports = { updateUserRole };
