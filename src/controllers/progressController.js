
const mongoose = require("mongoose");
const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const { evaluatePortfolio } = require("../services/finalProjectEvaluator");

const FINAL_PROJECT_MODULE = "Final Project: Personal Portfolio Website";
const PROJECT_STAGES = ["plan", "document", "about", "projects", "education-media", "contact-review"];
const PROJECT_CHECKS = ["structure", "about", "navigation", "projects", "education", "multimedia", "contact", "readme-assets"];

async function getFinalProjectLesson() {
  const course = await Course.findOne({ title: "HTML Fundamentals", published: true });
  if (!course) return null;
  return Lesson.findOne({ course: course._id, module: FINAL_PROJECT_MODULE, published: true });
}

function serializeProject(progress) {
  if (!progress) return { stages: [], checklist: [], submission: null };
  const submission = progress.projectSubmission?.toObject?.() || progress.projectSubmission || null;
  if (submission) {
    submission.files = (submission.files || []).map(({ path, mimeType, size }) => ({ path, mimeType, size }));
  }
  return {
    stages: progress.projectProgress?.completedStages || [],
    checklist: progress.projectProgress?.checklist || [],
    submission,
  };
}

const getFinalProjectProgress = async (req, res) => {
  try {
    const lesson = await getFinalProjectLesson();
    if (!lesson) return res.status(404).json({ success: false, message: "Final project lesson is not available yet" });
    const progress = await Progress.findOne({ student: req.user._id, lesson: lesson._id });
    return res.status(200).json({ success: true, ...serializeProject(progress) });
  } catch (error) {
    console.error("Get final project progress error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to fetch final project progress" });
  }
};

const updateFinalProjectProgress = async (req, res) => {
  try {
    const stages = req.body?.stages;
    const checklist = req.body?.checklist;
    if (!Array.isArray(stages) || !Array.isArray(checklist) || stages.some((item) => !PROJECT_STAGES.includes(item)) || checklist.some((item) => !PROJECT_CHECKS.includes(item))) {
      return res.status(400).json({ success: false, message: "Provide valid stage and checklist arrays" });
    }
    const lesson = await getFinalProjectLesson();
    if (!lesson) return res.status(404).json({ success: false, message: "Final project lesson is not available yet" });
    const progress = await Progress.findOneAndUpdate(
      { student: req.user._id, lesson: lesson._id },
      { $set: { projectProgress: { completedStages: [...new Set(stages)], checklist: [...new Set(checklist)], updatedAt: new Date() } } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, ...serializeProject(progress) });
  } catch (error) {
    console.error("Update final project progress error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to save project progress" });
  }
};

const submitFinalProject = async (req, res) => {
  try {
    const files = req.body?.files;
    if (!Array.isArray(files) || files.length < 1 || files.length > 30) {
      return res.status(400).json({ success: false, message: "Upload between 1 and 30 project files" });
    }
    let totalBytes = 0;
    const normalized = [];
    const seen = new Set();
    const allowed = /\.(html?|md|png|jpe?g|gif|webp|svg|mp3|wav|ogg|mp4|webm|pdf)$/i;
    for (const file of files) {
      if (!file || typeof file.path !== "string" || file.path.length > 240 || file.path.startsWith("/") || file.path.includes("..") || file.path.includes("\\") || !allowed.test(file.path) || typeof file.content !== "string" || !["utf8", "base64"].includes(file.encoding)) {
        return res.status(400).json({ success: false, message: "A file has an invalid path, type, or encoding" });
      }
      const key = file.path.toLowerCase();
      if (seen.has(key)) return res.status(400).json({ success: false, message: `Duplicate file path: ${file.path}` });
      seen.add(key);
      const bytes = file.encoding === "base64" ? Buffer.from(file.content, "base64").length : Buffer.byteLength(file.content, "utf8");
      totalBytes += bytes;
      if (!bytes || bytes > 2_000_000) return res.status(413).json({ success: false, message: `${file.path} is empty or larger than 2 MB` });
      normalized.push({ path: file.path, content: file.content, encoding: file.encoding, mimeType: String(file.mimeType || "application/octet-stream").slice(0, 120), size: bytes });
    }
    if (totalBytes > 5_500_000) return res.status(413).json({ success: false, message: "Project files must total 5.5 MB or less" });
    if (!normalized.some((file) => /\.html?$/i.test(file.path))) return res.status(400).json({ success: false, message: "Include at least one HTML file" });
    const lesson = await getFinalProjectLesson();
    if (!lesson) return res.status(404).json({ success: false, message: "Final project lesson is not available yet" });
    const progress = await Progress.findOne({ student: req.user._id, lesson: lesson._id }) || new Progress({ student: req.user._id, lesson: lesson._id });
    const result = evaluatePortfolio(normalized);
    const submittedAt = new Date();
    const attempt = (progress.projectSubmission?.attempt || 0) + 1;
    const history = progress.projectSubmission?.history || [];
    history.push({ attempt, score: result.score, status: result.status, submittedAt, summary: `${result.completedRequirements.length} requirements passed; ${result.missingRequirements.length} need attention.` });
    progress.projectSubmission = { ...result, status: result.status, attempt, files: normalized, submittedAt, evaluatedAt: submittedAt, history: history.slice(-10) };
    progress.completed = result.status === "complete";
    progress.quizScore = result.score;
    progress.completedAt = progress.completed ? submittedAt : null;
    await progress.save();
    return res.status(200).json({ success: true, ...serializeProject(progress) });
  } catch (error) {
    console.error("Submit final project error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to evaluate this submission" });
  }
};

const updateLessonProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { completed, quizScore } = req.body;

    if (!mongoose.isValidObjectId(lessonId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    if (
      completed === undefined &&
      quizScore === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide completed or quizScore",
      });
    }

    if (
      completed !== undefined &&
      typeof completed !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "completed must be a boolean",
      });
    }

    if (
      quizScore !== undefined &&
      (!Number.isFinite(quizScore) ||
        quizScore < 0 ||
        quizScore > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "quizScore must be a number from 0 to 100",
      });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson || !lesson.published) {
      return res.status(404).json({
        success: false,
        message: "Published lesson not found",
      });
    }

    const course = await Course.findOne({
      _id: lesson.course,
      published: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Published course not found",
      });
    }

    const studentId = req.user._id;

    const updates = {};

    if (completed !== undefined) {
      updates.completed = completed;
      updates.completedAt = completed ? new Date() : null;
    }

    if (quizScore !== undefined) {
      updates.quizScore = quizScore;
    }

    const progress = await Progress.findOneAndUpdate(
      { student: studentId, lesson: lessonId },
      { $set: updates },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Learning progress saved",
      progress,
    });
  } catch (error) {
    console.error("Update progress error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save learning progress",
    });
  }
};

const getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({
      student: req.user._id,
    })
      .select("-projectSubmission.files -projectSubmission.history")
      .populate("lesson", "title order course")
      .sort({ updatedAt: -1 });

    const validProgress = progress.filter((p) => p.lesson != null);

    return res.status(200).json({
      success: true,
      count: validProgress.length,
      progress: validProgress,
    });
  } catch (error) {
    console.error("Get progress error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch learning progress",
    });
  }
};

module.exports = {
  updateLessonProgress,
  getMyProgress,
  getFinalProjectProgress,
  updateFinalProjectProgress,
  submitFinalProject,
};
