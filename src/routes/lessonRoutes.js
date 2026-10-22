
const express = require("express");
const router = express.Router();

const {
  authenticate,
  requireRoles,
} = require("../middleware/authMiddleware");

const {
  createLesson,
  getLessonsByCourse,
  getLessonById,
} = require("../controllers/lessonController");

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Course lesson APIs
 */

/**
 * @swagger
 * /api/admin/lessons:
 *   post:
 *     summary: Create a lesson (admin only)
 *     tags: [Lessons]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [course, title, content, order]
 *             properties:
 *               course:
 *                 type: string
 *                 description: MongoDB course ID
 *               title:
 *                 type: string
 *                 example: Introduction to Variables
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               order:
 *                 type: integer
 *                 minimum: 1
 *               published:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Lesson created
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Admin role required
 */
router.post(
  "/",
  authenticate,
  requireRoles("super_admin", "school_admin", "teacher"),
  createLesson
);

/**
 * @swagger
 * /api/courses/{courseId}/lessons:
 *   get:
 *     summary: List published lessons in a course
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Published lessons retrieved
 *       404:
 *         description: Published course not found
 */
router.get(
  "/courses/:courseId/lessons",
  getLessonsByCourse
);

/**
 * @swagger
 * /api/lessons/{lessonId}:
 *   get:
 *     summary: Get a published lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson retrieved
 *       404:
 *         description: Published lesson not found
 */
router.get("/:lessonId", getLessonById);

module.exports = router;
