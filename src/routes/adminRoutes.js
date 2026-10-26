
const express = require("express");
const router = express.Router();

const {
  authenticate,
  requireRoles,
} = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getStudents,
} = require("../controllers/adminController");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only APIs
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard
 *     description: Returns the admin dashboard welcome message, stats, and authenticated user.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data retrieved successfully
 *       401:
 *         description: Authentication token missing or invalid
 *       403:
 *         description: Access denied; admin role required
 */
router.get(
  "/dashboard",
  authenticate,
  requireRoles("super_admin", "school_admin"),
  getDashboardStats
);

/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     summary: Get list of registered students
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Students list retrieved successfully
 *       401:
 *         description: Authentication token missing or invalid
 *       403:
 *         description: Access denied; admin role required
 */
router.get(
  "/students",
  authenticate,
  requireRoles("super_admin", "school_admin"),
  getStudents
);

module.exports = router;
