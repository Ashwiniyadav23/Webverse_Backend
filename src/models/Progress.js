
const mongoose = require("mongoose");

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
  },
  { timestamps: true }
);

// One progress record per student per lesson
progressSchema.index(
  { student: 1, lesson: 1 },
  { unique: true }
);

module.exports = mongoose.model("Progress", progressSchema);
