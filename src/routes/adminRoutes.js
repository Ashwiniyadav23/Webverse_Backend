
const express = require("express");
const router = express.Router();

const {
  authenticate,
  requireRoles,
} = require("../middleware/authMiddleware");

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
 *     description: Returns the admin dashboard welcome message and authenticated user.
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
  (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the WebVerse admin dashboard",
    user: req.user,
  });
  }
);

module.exports = router;
