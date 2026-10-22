
const express = require("express");
const router = express.Router();

const {
  authenticate,
  requireRoles,
} = require("../middleware/authMiddleware");

const {
  updateLessonProgress,
  getMyProgress,
} = require("../controllers/progressController");

/**
 * @swagger
 * tags:
 *   name: Learning Progress
 *   description: Student learning progress APIs
 */

/**
 * @swagger
 * /api/progress/me:
 *   get:
 *     summary: Get my learning progress
 *     tags: [Learning Progress]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Progress retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get("/me", authenticate, requireRoles("student"), getMyProgress);

/**
 * @swagger
 * /api/progress/lessons/{lessonId}:
 *   patch:
 *     summary: Update completion or quiz score for a lesson
 *     tags: [Learning Progress]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 example: true
 *               quizScore:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 85
 *     responses:
 *       200:
 *         description: Progress saved
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Published lesson not found
 */
router.patch(
  "/lessons/:lessonId",
  authenticate,
  requireRoles("student"),
  updateLessonProgress
);

module.exports = router;
