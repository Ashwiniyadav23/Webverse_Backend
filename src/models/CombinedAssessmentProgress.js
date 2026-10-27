const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  attempt: { type: Number, required: true },
  score: { type: Number, min: 0, max: 100, required: true },
  status: { type: String, enum: ["needs_revision", "complete"], required: true },
  submittedAt: { type: Date, required: true },
}, { _id: false });

const combinedAssessmentProgressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  htmlCode: { type: String, default: "", maxlength: 100000 },
  cssCode: { type: String, default: "", maxlength: 100000 },
  status: { type: String, enum: ["needs_revision", "complete"], default: "needs_revision" },
  attempt: { type: Number, default: 0 },
  score: { type: Number, min: 0, max: 100, default: null },
  htmlScore: { type: Number, min: 0, max: 35, default: null },
  cssScore: { type: Number, min: 0, max: 45, default: null },
  qualityScore: { type: Number, min: 0, max: 20, default: null },
  result: { type: mongoose.Schema.Types.Mixed, default: undefined },
  submittedAt: { type: Date, default: null },
  history: { type: [attemptSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("CombinedAssessmentProgress", combinedAssessmentProgressSchema);
