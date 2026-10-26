
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Progress = require("../models/Progress");

// GET /api/student/dashboard
const getStudentDashboard = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select(
      "name email role createdAt"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Students only.",
      });
    }

    const [coursesEnrolled, lessonsCompleted] = await Promise.all([
      Enrollment.countDocuments({ student: student._id }),
      Progress.countDocuments({ student: student._id, completed: true }),
    ]);

    const learningProgress =
      coursesEnrolled > 0
        ? Math.min(100, Math.round((lessonsCompleted / (coursesEnrolled * 5)) * 100))
        : 0;

    return res.status(200).json({
      success: true,
      message: "Welcome to your WebVerse dashboard!",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        joinedAt: student.createdAt,
      },
      stats: {
        coursesEnrolled,
        lessonsCompleted,
        learningProgress,
      },
    });
  } catch (error) {
    console.error("Student dashboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load student dashboard",
    });
  }
};

module.exports = {
  getStudentDashboard,
};
