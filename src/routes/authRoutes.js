
const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ashwini
 *               email:
 *                 type: string
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ExamplePass123
 *     responses:
 *       201:
 *         description: Student registered successfully
 *       400:
 *         description: Invalid input or email already exists
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in to WebVerse
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ExamplePass123
 *     responses:
 *       200:
 *         description: Login successful; returns authentication token
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", login);

module.exports = router;
