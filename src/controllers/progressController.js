
const mongoose = require("mongoose");
const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

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
      .populate("lesson", "title order course")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: progress.length,
      progress,
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
};
