const express = require("express");
const router = express.Router();

const {
  authenticate,
  requireRoles,
} = require("../middleware/authMiddleware");

const {
  createCourse,
  updateCourse,
  toggleCoursePublish,
  deleteCourse,
  getAllCoursesForAdmin,
  getAdminCourseById,
  getCourseStudents,
  enrollStudentInCourse,
  removeStudentFromCourse,
} = require("../controllers/courseController");

const {
  getAdminLessonsByCourse,
  createLesson,
  reorderLessons,
} = require("../controllers/lessonController");

// Require authentication and admin privileges for all admin course routes
router.use(authenticate, requireRoles("super_admin", "school_admin"));

// Courses
router.get("/", getAllCoursesForAdmin);
router.post("/", createCourse);
router.get("/:id", getAdminCourseById);
router.patch("/:id", updateCourse);
router.patch("/:id/publish", toggleCoursePublish);
router.delete("/:id", deleteCourse);

// Lessons for a course
router.get("/:courseId/lessons", getAdminLessonsByCourse);
router.post("/:courseId/lessons", createLesson);
router.put("/:courseId/lessons/reorder", reorderLessons);

// Student access for a course
router.get("/:courseId/students", getCourseStudents);
router.post("/:courseId/students", enrollStudentInCourse);
router.delete("/:courseId/students/:studentId", removeStudentFromCourse);

module.exports = router;
