const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Progress = require("../models/Progress");
const CombinedAssessmentProgress = require("../models/CombinedAssessmentProgress");
const { evaluateCombinedPortfolio } = require("../services/combinedPortfolioEvaluator");

const HTML_COURSE = "Phase 1 — Student Profile & Course Portal (HTML Only)";
const CSS_COURSE = "Phase 2: Dressing Up Your Websites with CSS";
const FINAL_HTML_MODULE = "Final Project: Student Profile & Course Portal";

function sectionPassed(lesson, progress) {
  const curriculum = lesson?.curriculum;
  const record = progress?.curriculumProgress;
  if (!curriculum?.assessment || !record) return false;
  const lastQuiz = record.quizAttempts?.slice(-1)[0];
  return (record.completedTopics || []).length >= (curriculum.topics || []).length
    && (record.completedTasks || []).length >= (curriculum.tasks || []).length
    && lastQuiz?.score >= 67
    && Boolean(record.assessment?.passed);
}

function allLessonsPassed(lessons, progressRows, expectedCount) {
  if (lessons.length !== expectedCount) return false;
  const byLesson = new Map(progressRows.map(item => [String(item.lesson), item]));
  return lessons.every(lesson => sectionPassed(lesson, byLesson.get(String(lesson._id))));
}

function htmlProjectComplete(finalLesson, progressRows) {
  return Boolean(finalLesson && progressRows.some(item => String(item.lesson) === String(finalLesson._id) && item.projectSubmission?.status === "complete"));
}

async function courseCompletion(studentId) {
  const [htmlCourse, cssCourse] = await Promise.all([
    Course.findOne({ title: HTML_COURSE, published: true }).select("_id"),
    Course.findOne({ title: CSS_COURSE, published: true }).select("_id"),
  ]);
  let htmlComplete = false;
  let cssComplete = false;

  if (htmlCourse) {
    const [sections, finalLesson] = await Promise.all([
      Lesson.find({ course: htmlCourse._id, published: true, "curriculum.assessment": { $exists: true } }).sort({ order: 1 }).limit(6).lean(),
      Lesson.findOne({ course: htmlCourse._id, module: FINAL_HTML_MODULE, published: true }).select("_id").lean(),
    ]);
    const progressRows = await Progress.find({ student: studentId, lesson: { $in: [...sections.map(item => item._id), ...(finalLesson ? [finalLesson._id] : [])] } }).lean();
    htmlComplete = allLessonsPassed(sections, progressRows, 6) && htmlProjectComplete(finalLesson, progressRows);
  }

  if (cssCourse) {
    const sections = await Lesson.find({ course: cssCourse._id, published: true }).sort({ order: 1 }).limit(10).lean();
    const progressRows = await Progress.find({ student: studentId, lesson: { $in: sections.map(item => item._id) } }).lean();
    cssComplete = allLessonsPassed(sections, progressRows, 10);
  }

  const missingCourses = [];
  if (!htmlComplete) missingCourses.push({ name: "Phase 1 — Student Profile & Course Portal (HTML Only)", path: "/courses/html-fundamentals", reason: "Complete all six section assessments and submit a passing HTML final project." });
  if (!cssComplete) missingCourses.push({ name: CSS_COURSE, path: "/courses/css-phase-two", reason: "Complete all nine CSS sections and the final six-page website challenge." });
  return { eligible: htmlComplete && cssComplete, htmlComplete, cssComplete, missingCourses };
}

function serialize(record) {
  if (!record) return null;
  return {
    htmlCode: record.htmlCode,
    cssCode: record.cssCode,
    status: record.status,
    attempt: record.attempt,
    score: record.score,
    htmlScore: record.htmlScore,
    cssScore: record.cssScore,
    qualityScore: record.qualityScore,
    result: record.result,
    submittedAt: record.submittedAt,
    history: record.history,
  };
}

async function getCombinedAssessmentStatus(req, res) {
  try {
    const [eligibility, record] = await Promise.all([
      courseCompletion(req.user._id),
      CombinedAssessmentProgress.findOne({ student: req.user._id }).lean(),
    ]);
    return res.status(200).json({ success: true, ...eligibility, submission: serialize(record) });
  } catch (error) {
    console.error("Combined assessment status error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to check combined assessment access" });
  }
}

async function submitCombinedAssessment(req, res) {
  try {
    const htmlCode = req.body?.htmlCode;
    const cssCode = req.body?.cssCode;
    if (typeof htmlCode !== "string" || !htmlCode.trim() || htmlCode.length > 100000) {
      return res.status(400).json({ success: false, message: "Write your HTML document first. HTML must be 100 KB or less." });
    }
    if (typeof cssCode !== "string" || !cssCode.trim() || cssCode.length > 100000) {
      return res.status(400).json({ success: false, message: "Write your CSS stylesheet first. CSS must be 100 KB or less." });
    }
    const eligibility = await courseCompletion(req.user._id);
    if (!eligibility.eligible) return res.status(409).json({ success: false, message: "Complete both courses and their required assessments before submitting this portfolio.", ...eligibility });

    const result = evaluateCombinedPortfolio(htmlCode, cssCode);
    const submittedAt = new Date();
    const prior = await CombinedAssessmentProgress.findOne({ student: req.user._id });
    const attempt = (prior?.attempt || 0) + 1;
    const history = [...(prior?.history || []), { attempt, score: result.score, status: result.status, submittedAt }].slice(-10);
    const record = await CombinedAssessmentProgress.findOneAndUpdate(
      { student: req.user._id },
      { $set: { htmlCode, cssCode, status: result.status, attempt, score: result.score, htmlScore: result.htmlScore, cssScore: result.cssScore, qualityScore: result.qualityScore, result, submittedAt, history } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return res.status(200).json({ success: true, result, submission: serialize(record) });
  } catch (error) {
    console.error("Combined assessment submission error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to evaluate this portfolio submission" });
  }
}

async function evaluateCombinedAssessment(req, res) {
  try {
    const htmlCode = req.body?.htmlCode;
    const cssCode = req.body?.cssCode;
    if (typeof htmlCode !== "string" || !htmlCode.trim() || htmlCode.length > 100000 || typeof cssCode !== "string" || !cssCode.trim() || cssCode.length > 100000) {
      return res.status(400).json({ success: false, message: "Write both HTML and CSS code first. Each file must be 100 KB or less." });
    }
    const eligibility = await courseCompletion(req.user._id);
    if (!eligibility.eligible) return res.status(409).json({ success: false, message: "Complete both courses and their required assessments before evaluating this portfolio.", ...eligibility });
    return res.status(200).json({ success: true, result: evaluateCombinedPortfolio(htmlCode, cssCode) });
  } catch (error) {
    console.error("Combined assessment evaluation error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to evaluate this portfolio" });
  }
}

module.exports = { getCombinedAssessmentStatus, submitCombinedAssessment, evaluateCombinedAssessment, allLessonsPassed, htmlProjectComplete };
