
const mongoose = require("mongoose");
const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const { evaluatePortfolio } = require("../services/finalProjectEvaluator");

const FINAL_PROJECT_MODULE = "Final Project: Student Profile & Course Portal";
const PROJECT_STAGES = ["plan", "document", "about", "projects", "education-media", "contact-review"];

async function getFinalProjectLesson() {
  const course = await Course.findOne({ title: "Phase 1 — Student Profile & Course Portal (HTML Only)", published: true });
  if (!course) return null;
  return Lesson.findOne({ course: course._id, module: FINAL_PROJECT_MODULE, published: true });
}

async function allPhaseSectionsPassed(studentId, courseId) {
  const sections = await Lesson.find({ course: courseId, published: true, "curriculum.assessment": { $exists: true } }).select("curriculum order").sort({ order: 1 }).limit(6).lean();
  if (sections.length !== 6) return false;
  const rows = await Progress.find({ student: studentId, lesson: { $in: sections.map(section => section._id) } }).select("lesson curriculumProgress").lean();
  const byLesson = new Map(rows.map(row => [String(row.lesson), row.curriculumProgress || {}]));
  return sections.every(section => {
    const progress = byLesson.get(String(section._id));
    const lastQuiz = progress?.quizAttempts?.slice(-1)[0];
    return (progress?.completedTopics || []).length >= (section.curriculum.topics || []).length
      && (progress?.completedTasks || []).length >= (section.curriculum.tasks || []).length
      && Boolean(lastQuiz && lastQuiz.score >= 67)
      && Boolean(progress?.assessment?.passed);
  });
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
    return res.status(200).json({ success: true, ready: await allPhaseSectionsPassed(req.user._id, lesson.course), ...serializeProject(progress) });
  } catch (error) {
    console.error("Get final project progress error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to fetch final project progress" });
  }
};

const updateFinalProjectProgress = async (req, res) => {
  try {
    const stages = req.body?.stages;
    const checklist = req.body?.checklist;
    if (!Array.isArray(stages) || !Array.isArray(checklist) || stages.some((item) => !PROJECT_STAGES.includes(item)) || checklist.length > 100 || checklist.some((item) => typeof item !== "string" || !/^[a-z0-9_-]{1,120}$/i.test(item))) {
      return res.status(400).json({ success: false, message: "Provide valid stage and checklist arrays" });
    }
    const lesson = await getFinalProjectLesson();
    if (!lesson) return res.status(404).json({ success: false, message: "Final project lesson is not available yet" });
    if (!await allPhaseSectionsPassed(req.user._id, lesson.course)) return res.status(409).json({ success: false, message: "Complete all six Phase 1 sections before starting the final project" });
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
    if (!await allPhaseSectionsPassed(req.user._id, lesson.course)) return res.status(409).json({ success: false, message: "Complete all six Phase 1 sections before submitting the final project" });
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
    const { completed, quizScore, checklist, completedTopics, completedTasks } = req.body;

    if (!mongoose.isValidObjectId(lessonId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    if (
      completed === undefined &&
      quizScore === undefined &&
      checklist === undefined && completedTopics === undefined && completedTasks === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide lesson completion, quiz score, or curriculum progress",
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

    if (checklist !== undefined && (!Array.isArray(checklist) || checklist.some((item) => typeof item !== "string" || item.length > 120))) {
      return res.status(400).json({ success: false, message: "checklist must be an array of short strings" });
    }
    for (const [field, value] of [["completedTopics", completedTopics], ["completedTasks", completedTasks]]) {
      if (value !== undefined && (!Array.isArray(value) || value.length > 100 || value.some((item) => typeof item !== "string" || item.length > 160))) {
        return res.status(400).json({ success: false, message: `${field} must be an array of short strings` });
      }
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson || !lesson.published) {
      return res.status(404).json({
        success: false,
        message: "Published lesson not found",
      });
    }

    if (lesson.curriculum && (quizScore !== undefined || completedTasks !== undefined)) {
      return res.status(400).json({ success: false, message: "Submit editor tasks and section quizzes through their lesson endpoints" });
    }
    if (lesson.curriculum && completedTopics?.some((key) => !/^topic-\d+$/.test(key) || Number(key.slice(6)) >= lesson.curriculum.topics.length)) {
      return res.status(400).json({ success: false, message: "completedTopics contains an unknown topic" });
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
    if (checklist !== undefined) {
      updates["projectProgress.checklist"] = [...new Set(checklist)];
      updates["projectProgress.updatedAt"] = new Date();
    }

    if (completedTopics !== undefined) updates["curriculumProgress.completedTopics"] = [...new Set(completedTopics)];
    if (completedTasks !== undefined) updates["curriculumProgress.completedTasks"] = [...new Set(completedTasks)];
    if (completedTopics !== undefined || completedTasks !== undefined || quizScore !== undefined) {
      updates["curriculumProgress.updatedAt"] = new Date();
    }

    const update = { $set: updates };
    if (quizScore !== undefined) update.$push = { "curriculumProgress.quizAttempts": { score: quizScore, submittedAt: new Date() } };

    const progress = await Progress.findOneAndUpdate(
      { student: studentId, lesson: lessonId },
      update,
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

function validateHtmlCode(code, validation = {}) {
  const forbidden = /<\s*(script|style)\b|<\s*link\b[^>]*stylesheet|\sstyle\s*=|\son[a-z]+\s*=|javascript\s*:/i;
  const feedback = [];
  if (forbidden.test(code)) feedback.push("Remove CSS and JavaScript. Use HTML elements and attributes only.");
  const requiredTags = Array.isArray(validation.requiredTags) ? validation.requiredTags : [];
  const requiredText = Array.isArray(validation.requiredText) ? validation.requiredText : [];
  const knownTags = new Set(["a", "address", "article", "body", "button", "caption", "dd", "div", "dl", "dt", "em", "fieldset", "footer", "form", "h1", "h2", "h3", "head", "header", "html", "img", "input", "label", "li", "main", "nav", "ol", "option", "p", "section", "select", "strong", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "title", "tr", "ul"]);
  const missing = [];
  for (const required of requiredTags) {
    const value = String(required).trim();
    const tag = value.match(/^([a-z][a-z0-9-]*)$/i)?.[1];
    const found = tag && knownTags.has(tag.toLowerCase()) ? new RegExp(`<\\s*${tag}\\b`, "i").test(code) : code.toLowerCase().includes(value.toLowerCase());
    if (!found) missing.push(`Add or correct: ${value}`);
  }
  for (const phrase of requiredText) {
    if (!code.toLowerCase().includes(String(phrase).toLowerCase())) missing.push(`Include the required content: ${phrase}`);
  }
  feedback.push(...missing);
  const total = requiredTags.length + requiredText.length;
  const passedCount = total - missing.length;
  const score = forbidden.test(code) ? 0 : total ? Math.round((passedCount / total) * 100) : 0;
  if (!feedback.length) feedback.push("All automatic checks passed. Review the assessment criteria and test your page in a browser.");
  return { score, passed: score >= 70 && !forbidden.test(code), feedback };
}

function validateCssCode(code, validation = {}) {
  const feedback = [];
  if (/<\/?[a-z][^>]*>/i.test(code)) feedback.push("Write CSS rules only here. The page HTML is already provided in the preview.");
  if (/<\s*script\b|javascript\s*:|expression\s*\(/i.test(code)) feedback.push("Remove JavaScript. This editor is for CSS styling only.");
  const opens = (code.match(/{/g) || []).length;
  const closes = (code.match(/}/g) || []).length;
  if (opens !== closes) feedback.push("Check your braces: every { needs a matching }.");
  if (!feedback.some(item => item.startsWith("Write CSS"))) {
    const stripped = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@media\s*[^{}]+\{/g, "");
    const declarations = stripped.match(/\{([^{}]*)\}/g) || [];
    if (declarations.some(rule => rule.slice(1, -1).split(";").some(part => part.trim() && !part.includes(":")))) {
      feedback.push("A CSS declaration needs a colon between its property and value, such as color: navy;");
    }
  }
  const missing = (validation.requiredText || []).filter(value => !code.toLowerCase().includes(String(value).toLowerCase()));
  feedback.push(...missing.map(value => `Hint: add or check “${value}” in your stylesheet.`));
  const total = (validation.requiredText || []).length;
  const present = total - missing.length;
  const score = feedback.some(item => item.startsWith("Write CSS") || item.startsWith("Remove JavaScript") || item.startsWith("Check your braces") || item.startsWith("A CSS declaration"))
    ? 0 : total ? Math.round(present / total * 100) : 100;
  if (!feedback.length) feedback.push("CSS checks passed. Inspect the preview at desktop, tablet, and mobile widths and compare it with the task brief.");
  return { score, passed: score >= 70, feedback };
}

function validateLessonCode(code, curriculum, validation) {
  return curriculum?.language === "css" ? validateCssCode(code, validation) : validateHtmlCode(code, validation);
}

const submitSectionAssessment = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const code = req.body?.code;
    if (!mongoose.isValidObjectId(lessonId)) return res.status(400).json({ success: false, message: "Invalid lesson ID" });
    if (typeof code !== "string" || !code.trim() || code.length > 100000) return res.status(400).json({ success: false, message: "Provide HTML code up to 100 KB" });
    const lesson = await Lesson.findOne({ _id: lessonId, published: true }).select("curriculum").populate({ path: "course", match: { published: true }, select: "_id" });
    if (!lesson?.course || !lesson.curriculum?.assessment) return res.status(404).json({ success: false, message: "Section assessment not found" });
    const prior = await Progress.findOne({ student: req.user._id, lesson: lessonId }).select("curriculumProgress");
    const priorProgress = prior?.curriculumProgress;
    const lastQuiz = priorProgress?.quizAttempts?.slice(-1)[0];
    if ((priorProgress?.completedTopics || []).length < lesson.curriculum.topics.length || (priorProgress?.completedTasks || []).length < lesson.curriculum.tasks.length || !lastQuiz || lastQuiz.score < 67) {
      return res.status(409).json({ success: false, message: "Complete every learning topic and editor task, then pass the section quiz before the assessment" });
    }
    const result = validateLessonCode(code, lesson.curriculum, lesson.curriculum.assessment.validation);
    const attempt = { score: result.score, submittedAt: new Date() };
    const progress = await Progress.findOneAndUpdate(
      { student: req.user._id, lesson: lessonId },
      { $set: { "curriculumProgress.assessment": { score: result.score, passed: result.passed, feedback: result.feedback, submittedAt: attempt.submittedAt }, "curriculumProgress.updatedAt": attempt.submittedAt }, $push: { "curriculumProgress.assessmentAttempts": attempt } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, result, curriculumProgress: progress.curriculumProgress });
  } catch (error) {
    console.error("Section assessment error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to evaluate the section assessment" });
  }
};

const submitLessonTask = async (req, res) => {
  try {
    const { lessonId, taskIndex: rawIndex } = req.params;
    const taskIndex = Number(rawIndex);
    const code = req.body?.code;
    if (!mongoose.isValidObjectId(lessonId) || !Number.isInteger(taskIndex) || taskIndex < 0) return res.status(400).json({ success: false, message: "Invalid lesson or task" });
    if (typeof code !== "string" || !code.trim() || code.length > 100000) return res.status(400).json({ success: false, message: "Provide HTML code up to 100 KB" });
    const lesson = await Lesson.findOne({ _id: lessonId, published: true }).select("curriculum").populate({ path: "course", match: { published: true }, select: "_id" });
    const task = lesson?.curriculum?.tasks?.[taskIndex];
    if (!lesson?.course || !task) return res.status(404).json({ success: false, message: "Practice task not found" });
    const prior = await Progress.findOne({ student: req.user._id, lesson: lessonId }).select("curriculumProgress");
    if ((prior?.curriculumProgress?.completedTopics || []).length < (lesson.curriculum.topics || []).length) {
      return res.status(409).json({ success: false, message: "Complete the lesson topics before submitting a practice task" });
    }
    const result = validateLessonCode(code, lesson.curriculum, task.validation);
    const progress = prior || new Progress({ student: req.user._id, lesson: lessonId });
    const completed = new Set(progress.curriculumProgress?.completedTasks || []);
    if (result.passed) completed.add(`task-${taskIndex}`); else completed.delete(`task-${taskIndex}`);
    progress.curriculumProgress = { ...(progress.curriculumProgress?.toObject?.() || progress.curriculumProgress || {}), completedTasks: [...completed], updatedAt: new Date() };
    await progress.save();
    return res.status(200).json({ success: true, result, completedTasks: [...completed] });
  } catch (error) {
    console.error("Practice task validation error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to validate the practice task" });
  }
};

const submitSectionQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const answers = req.body?.answers;
    if (!mongoose.isValidObjectId(lessonId) || !Array.isArray(answers)) return res.status(400).json({ success: false, message: "Provide a valid lesson and answer list" });
    const lesson = await Lesson.findOne({ _id: lessonId, published: true }).select("curriculum").populate({ path: "course", match: { published: true }, select: "_id" });
    const questions = lesson?.curriculum?.quiz;
    if (!lesson?.course || !Array.isArray(questions) || questions.length === 0 || answers.length !== questions.length || answers.some(answer => !Number.isInteger(answer) || answer < 0)) return res.status(400).json({ success: false, message: "Answer every quiz question" });
    const prior = await Progress.findOne({ student: req.user._id, lesson: lessonId }).select("curriculumProgress");
    const priorProgress = prior?.curriculumProgress;
    if ((priorProgress?.completedTopics || []).length < lesson.curriculum.topics.length || (priorProgress?.completedTasks || []).length < lesson.curriculum.tasks.length) {
      return res.status(409).json({ success: false, message: "Mark all topics learned and pass every editor task before taking the quiz" });
    }
    const correct = questions.reduce((count, question, index) => count + (answers[index] === question.answerIndex ? 1 : 0), 0);
    const score = Math.round(correct / questions.length * 100);
    const submittedAt = new Date();
    const progress = await Progress.findOneAndUpdate(
      { student: req.user._id, lesson: lessonId },
      { $set: { quizScore: score, "curriculumProgress.updatedAt": submittedAt }, $push: { "curriculumProgress.quizAttempts": { score, submittedAt } } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, score, passed: score >= 67, correct, explanations: questions.map(question => question.explanation), curriculumProgress: progress.curriculumProgress });
  } catch (error) {
    console.error("Section quiz submission error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to save the section quiz" });
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
  submitSectionAssessment,
  submitLessonTask,
  submitSectionQuiz,
  getMyProgress,
  getFinalProjectProgress,
  updateFinalProjectProgress,
  submitFinalProject,
};
