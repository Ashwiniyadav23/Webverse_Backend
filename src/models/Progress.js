
const mongoose = require("mongoose");

const projectFileSchema = new mongoose.Schema({
  path: { type: String, required: true, maxlength: 240 },
  content: { type: String, required: true },
  encoding: { type: String, enum: ["utf8", "base64"], required: true },
  mimeType: { type: String, default: "application/octet-stream", maxlength: 120 },
  size: { type: Number, min: 0, max: 5500000, required: true },
}, { _id: false });

const projectCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  marks: { type: Number, min: 0, max: 100, required: true },
  maxMarks: { type: Number, min: 0, max: 100, required: true },
  completedRequirements: { type: [String], default: [] },
  missingRequirements: { type: [String], default: [] },
  errors: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },
}, { _id: false });

const projectAttemptSchema = new mongoose.Schema({
  attempt: { type: Number, required: true },
  score: { type: Number, min: 0, max: 100, required: true },
  status: { type: String, enum: ["needs_revision", "complete"], required: true },
  submittedAt: { type: Date, required: true },
  summary: { type: String, default: "" },
}, { _id: false });

const projectSubmissionSchema = new mongoose.Schema({
  status: { type: String, enum: ["submitted", "needs_revision", "complete"], default: "submitted" },
  attempt: { type: Number, default: 0 },
  score: { type: Number, min: 0, max: 100, default: null },
  files: { type: [projectFileSchema], default: [] },
  categories: { type: [projectCategorySchema], default: [] },
  completedRequirements: { type: [String], default: [] },
  missingRequirements: { type: [String], default: [] },
  errors: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },
  submittedAt: { type: Date, default: null },
  evaluatedAt: { type: Date, default: null },
  history: { type: [projectAttemptSchema], default: [] },
}, { _id: false });

const projectProgressSchema = new mongoose.Schema({
  completedStages: { type: [String], default: [] },
  checklist: { type: [String], default: [] },
  updatedAt: { type: Date, default: Date.now },
}, { _id: false });

const curriculumAttemptSchema = new mongoose.Schema({
  score: { type: Number, min: 0, max: 100, required: true },
  submittedAt: { type: Date, default: Date.now },
}, { _id: false });
const curriculumAssessmentSchema = new mongoose.Schema({
  score: { type: Number, min: 0, max: 100, default: 0 },
  passed: { type: Boolean, default: false },
  feedback: { type: [String], default: [] },
  submittedAt: { type: Date, default: Date.now },
}, { _id: false });
const curriculumProgressSchema = new mongoose.Schema({
  completedTopics: { type: [String], default: [] },
  completedTasks: { type: [String], default: [] },
  quizAttempts: { type: [curriculumAttemptSchema], default: [] },
  assessmentAttempts: { type: [curriculumAttemptSchema], default: [] },
  assessment: { type: curriculumAssessmentSchema, default: undefined },
  updatedAt: { type: Date, default: Date.now },
}, { _id: false });

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    quizScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    projectProgress: {
      type: projectProgressSchema,
      default: undefined,
    },
    curriculumProgress: {
      type: curriculumProgressSchema,
      default: undefined,
    },
    projectSubmission: {
      type: projectSubmissionSchema,
      default: undefined,
    },
  },
  { timestamps: true }
);

// One progress record per student per lesson
progressSchema.index(
  { student: 1, lesson: 1 },
  { unique: true }
);

module.exports = mongoose.model("Progress", progressSchema);
