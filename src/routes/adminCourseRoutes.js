
const express = require("express");
const router = express.Router();

const {
  authenticate,
  requireRoles,
} = require("../middleware/authMiddleware");

const {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCoursesForAdmin,
} = require("../controllers/courseController");

router.use(authenticate);
router.get("/", requireRoles("super_admin", "school_admin"), getAllCoursesForAdmin);

/**
 * @swagger
 * tags:
 *   name: Admin Courses
 *   description: Admin-only course management
 */

/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     summary: List all courses, including unpublished courses
 *     tags: [Admin Courses]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 */


/**
 * @swagger
 * /api/admin/courses:
 *   post:
 *     summary: Create a course
 *     tags: [Admin Courses]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - classLevel
 *               - subject
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to JavaScript
 *               description:
 *                 type: string
 *                 example: Learn JavaScript fundamentals
 *               classLevel:
 *                 type: integer
 *                 minimum: 6
 *                 maximum: 12
 *                 example: 8
 *               subject:
 *                 type: string
 *                 example: Computer Science
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/course.jpg
 *               published:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Invalid course data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.post("/", requireRoles("super_admin", "school_admin"), createCourse);

/**
 * @swagger
 * /api/admin/courses/{id}:
 *   patch:
 *     summary: Update a course
 *     tags: [Admin Courses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               classLevel:
 *                 type: integer
 *                 minimum: 6
 *                 maximum: 12
 *               subject:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Invalid course ID or data
 *       404:
 *         description: Course not found
 */
router.patch("/:id", requireRoles("super_admin", "school_admin"), updateCourse);

/**
 * @swagger
 * /api/admin/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Admin Courses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Course not found
 */
router.delete("/:id", requireRoles("super_admin", "school_admin"), deleteCourse);

module.exports = router;
