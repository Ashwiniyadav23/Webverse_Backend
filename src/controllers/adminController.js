
const User = require("../models/User");

// GET /api/admin/dashboard
async function getDashboardStats(req, res) {
  try {
    const [totalUsers, totalStudents, totalAdmins] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: { $in: ["super_admin", "school_admin"] } }),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
    });
  }
}

// GET /api/admin/students
async function getStudents(req, res) {
  try {
    const students = await User.find({ role: "student" })
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get students error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
}

module.exports = {
  getDashboardStats,
  getStudents,
};
