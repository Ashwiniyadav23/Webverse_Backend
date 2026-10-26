const express = require("express");
const router = express.Router();

const {
  authenticate,
  requireRoles,
} = require("../middleware/authMiddleware");

const {
  createLesson,
  updateLesson,
  toggleLessonPublish,
  deleteLesson,
  getLessonsByCourse,
  getLessonById,
  getAdminLessonById,
} = require("../controllers/lessonController");

// Admin: create lesson
router.post(
  "/",
  authenticate,
  requireRoles("super_admin", "school_admin", "teacher"),
  createLesson
);

// Admin: update lesson
router.patch(
  "/:id",
  authenticate,
  requireRoles("super_admin", "school_admin", "teacher"),
  updateLesson
);

// Admin: toggle publish
router.patch(
  "/:id/publish",
  authenticate,
  requireRoles("super_admin", "school_admin", "teacher"),
  toggleLessonPublish
);

// Admin: delete lesson
router.delete(
  "/:id",
  authenticate,
  requireRoles("super_admin", "school_admin", "teacher"),
  deleteLesson
);

// Public / Student: List published lessons in a course
router.get("/courses/:courseId/lessons", getLessonsByCourse);

// Admin or Public: get lesson by ID
router.get("/:lessonId", async (req, res, next) => {
  // If request contains admin token, let admin fetch full lesson regardless of published state
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const jwt = require("jsonwebtoken");
      const User = require("../models/User");
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user && ["super_admin", "school_admin", "teacher"].includes(user.role)) {
        req.params.id = req.params.lessonId;
        return getAdminLessonById(req, res);
      }
    } catch {
      // Token invalid or expired, continue to student/public getLessonById
    }
  }

  return getLessonById(req, res);
});

module.exports = router;
