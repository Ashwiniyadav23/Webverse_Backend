
const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const enrollInCourse = async (req, res) => {
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

    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
    });

    return res.status(201).json({
      success: true,
      message: "Successfully enrolled in the course",
      enrollment,
    });
  } catch (error) {
    // Handle simultaneous duplicate enrollment requests.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    console.error("Enroll in course error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to enroll in the course",
    });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    })
      .populate({
        path: "course",
        select: "title description classLevel subject thumbnail",
      })
      .sort({ enrolledAt: -1 });

    const validEnrollments = enrollments.filter((e) => e.course != null);

    return res.status(200).json({
      success: true,
      count: validEnrollments.length,
      enrollments: validEnrollments,
    });
  } catch (error) {
    console.error("Get enrollments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your enrollments",
    });
  }
};

const leaveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const enrollment = await Enrollment.findOneAndDelete({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    return res.status(200).json({
      success: true,
      message: "You have left the course successfully",
    });
  } catch (error) {
    console.error("Leave course error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to leave the course",
    });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  leaveCourse,
};
