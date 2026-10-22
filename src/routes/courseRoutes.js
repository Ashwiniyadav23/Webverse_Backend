
const express = require("express");
const router = express.Router();

const {
  getCourses,
  getCourseById,
} = require("../controllers/courseController");

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Published course APIs
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get published courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: classLevel
 *         schema:
 *           type: integer
 *           minimum: 6
 *           maximum: 12
 *         description: Filter by school class
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Filter by subject
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *       400:
 *         description: Invalid class level
 */
router.get("/", getCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a published course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB course ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *       400:
 *         description: Invalid course ID
 *       404:
 *         description: Course not found
 */
router.get("/:id", getCourseById);

module.exports = router;
