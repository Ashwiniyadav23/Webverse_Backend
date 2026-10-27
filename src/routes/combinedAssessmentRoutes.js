const express = require("express");
const router = express.Router();
const { authenticate, requireRoles } = require("../middleware/authMiddleware");
const { getCombinedAssessmentStatus, evaluateCombinedAssessment, submitCombinedAssessment } = require("../controllers/combinedAssessmentController");

router.get("/portfolio/status", authenticate, requireRoles("student"), getCombinedAssessmentStatus);
router.post("/portfolio/evaluate", authenticate, requireRoles("student"), evaluateCombinedAssessment);
router.post("/portfolio/submit", authenticate, requireRoles("student"), submitCombinedAssessment);

module.exports = router;
