const express = require("express");
const router = express.Router();
const { authenticate, requireRoles } = require("../middleware/authMiddleware");
const { updateUserRole } = require("../controllers/userController");

router.patch(
  "/:userId/role",
  authenticate,
  requireRoles("super_admin"),
  updateUserRole
);

module.exports = router;
