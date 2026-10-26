const User = require("../models/User");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

// GET /api/admin/dashboard
async function getDashboardStats(req, res) {
  try {
    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalCourses,
      publishedCourses,
      totalLessons,
      publishedLessons,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: { $in: ["super_admin", "school_admin"] } }),
      Course.countDocuments(),
      Course.countDocuments({ published: true }),
      Lesson.countDocuments(),
      Lesson.countDocuments({ published: true }),
    ]);

    res.status(200).json({
      success: true,
      message: "Welcome to the WebVerse admin dashboard",
      user: req.user,
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        totalCourses,
        publishedCourses,
        totalLessons,
        publishedLessons,
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
    const filter = { role: "student" };

    if (req.query.q) {
      const q = String(req.query.q).trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const students = await User.find(filter)
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
