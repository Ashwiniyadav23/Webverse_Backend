
const mongoose = require("mongoose");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

// Admin: create a lesson
const createLesson = async (req, res) => {
  try {
    const { course, title, description, content, videoUrl, order, published } =
      req.body;

    if (!course || !title || !content || order === undefined) {
      return res.status(400).json({
        success: false,
        message: "course, title, content, and order are required",
      });
    }

    if (!mongoose.isValidObjectId(course)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const courseExists = await Course.exists({ _id: course });

    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lessonOrder = Number(order);

    if (!Number.isInteger(lessonOrder) || lessonOrder < 1) {
      return res.status(400).json({
        success: false,
        message: "order must be a positive integer",
      });
    }

    const lesson = await Lesson.create({
      course,
      title,
      description,
      content,
      videoUrl,
      order: lessonOrder,
      published: published ?? false,
    });

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A lesson with this order already exists in this course",
      });
    }

    console.error("Create lesson error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create lesson",
    });
  }
};

// Student: list published lessons for a published course
const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      published: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Published course not found",
      });
    }

    const lessons = await Lesson.find({
      course: courseId,
      published: true,
    }).sort({ order: 1 });

    return res.status(200).json({
      success: true,
      count: lessons.length,
      lessons,
    });
  } catch (error) {
    console.error("Get lessons error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch lessons",
    });
  }
};

// Student: get one published lesson
const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!mongoose.isValidObjectId(lessonId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    const lesson = await Lesson.findOne({
      _id: lessonId,
      published: true,
    }).populate({
      path: "course",
      match: { published: true },
      select: "title classLevel subject",
    });

    if (!lesson || !lesson.course) {
      return res.status(404).json({
        success: false,
        message: "Published lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error("Get lesson error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch lesson",
    });
  }
};

module.exports = {
  createLesson,
  getLessonsByCourse,
  getLessonById,
};
