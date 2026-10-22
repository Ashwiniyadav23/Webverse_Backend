
const express = require("express");
const router = express.Router();

const {
  getStudentDashboard,
} = require("../controllers/studentController");

const {
  authenticate,
} = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Student dashboard APIs
 */

/**
 * @swagger
 * /api/student/dashboard:
 *   get:
 *     summary: Get the student dashboard
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Student dashboard loaded successfully
 *       401:
 *         description: Missing or invalid JWT token
 *       403:
 *         description: Student access required
 *       404:
 *         description: Student not found
 */
router.get("/dashboard", authenticate, getStudentDashboard);

module.exports = router;
