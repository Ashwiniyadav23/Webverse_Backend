
const Course = require("../models/Course");

// GET /api/courses
const getCourses = async (req, res) => {
  try {
    const filter = {
      published: true,
    };

    if (req.query.classLevel) {
      const classLevel = Number(req.query.classLevel);

      if (
        !Number.isInteger(classLevel) ||
        classLevel < 6 ||
        classLevel > 12
      ) {
        return res.status(400).json({
          success: false,
          message: "classLevel must be a number from 6 to 12",
        });
      }

      filter.classLevel = classLevel;
    }

    if (req.query.subject) {
      filter.subject = {
        $regex: String(req.query.subject),
        $options: "i",
      };
    }

    const courses = await Course.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch courses",
    });
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      published: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Published course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    console.error("Get course error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch course",
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, classLevel, subject, thumbnail, published } =
      req.body;

    if (!title || !description || !classLevel || !subject) {
      return res.status(400).json({
        success: false,
        message: "Title, description, classLevel, and subject are required",
      });
    }

    const level = Number(classLevel);

    if (!Number.isInteger(level) || level < 6 || level > 12) {
      return res.status(400).json({
        success: false,
        message: "classLevel must be a number from 6 to 12",
      });
    }

    const course = await Course.create({
      title,
      description,
      classLevel: level,
      subject,
      thumbnail,
      published: published ?? false,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create course",
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "classLevel",
      "subject",
      "thumbnail",
      "published",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.classLevel !== undefined) {
      updates.classLevel = Number(updates.classLevel);

      if (
        !Number.isInteger(updates.classLevel) ||
        updates.classLevel < 6 ||
        updates.classLevel > 12
      ) {
        return res.status(400).json({
          success: false,
          message: "classLevel must be a number from 6 to 12",
        });
      }
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    console.error("Update course error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update course",
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    console.error("Delete course error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete course",
    });
  }
};

const getAllCoursesForAdmin = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Admin courses error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch courses",
    });
  }
};


module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCoursesForAdmin,
};