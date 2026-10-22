
const express = require("express");
const router = express.Router();

const {
  enrollInCourse,
  getMyEnrollments,
  leaveCourse,
} = require("../controllers/enrollmentController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Student course enrollment APIs
 */

/**
 * @swagger
 * /api/enrollments/me:
 *   get:
 *     summary: Get the current student's enrollments
 *     tags: [Enrollments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Student enrollments retrieved
 *       401:
 *         description: Authentication required
 */
router.get(
  "/me",
  authMiddleware.authenticate,
  authMiddleware.requireRoles("student"),
  getMyEnrollments
);

/**
 * @swagger
 * /api/enrollments/{courseId}:
 *   post:
 *     summary: Enroll in a published course
 *     tags: [Enrollments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully enrolled
 *       404:
 *         description: Published course not found
 *       409:
 *         description: Already enrolled
 */
router.post(
  "/:courseId",
  authMiddleware.authenticate,
  authMiddleware.requireRoles("student"),
  enrollInCourse
);

/**
 * @swagger
 * /api/enrollments/{courseId}:
 *   delete:
 *     summary: Leave an enrolled course
 *     tags: [Enrollments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully left the course
 *       404:
 *         description: Enrollment not found
 */
router.delete(
  "/:courseId",
  authMiddleware.authenticate,
  authMiddleware.requireRoles("student"),
  leaveCourse
);

module.exports = router;
