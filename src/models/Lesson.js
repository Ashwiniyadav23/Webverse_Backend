const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["document", "video", "link", "code", "other"],
      default: "link",
    },
  },
  { _id: true }
);

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    module: {
      type: String,
      trim: true,
      default: "Module 1: Fundamentals",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      required: true,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    documentUrl: {
      type: String,
      default: "",
      trim: true,
    },
    resources: {
      type: [resourceSchema],
      default: [],
    },
    order: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    duration: {
      type: String,
      default: "15 min",
      trim: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model("Lesson", lessonSchema);
