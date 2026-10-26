const mongoose = require("mongoose");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Progress = require("../models/Progress");

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
    })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: lessons.length,
      course: {
        _id: course._id,
        title: course.title,
        description: course.description,
        classLevel: course.classLevel,
        subject: course.subject,
        category: course.category,
      },
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
      select: "title classLevel subject category",
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

// Admin: GET /api/admin/courses/:courseId/lessons
const getAdminLessonsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId || req.params.id;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(courseId).lean();
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lessons = await Lesson.find({ course: courseId })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // Group lessons by module
    const moduleMap = {};
    for (const l of lessons) {
      const mod = l.module || "General";
      if (!moduleMap[mod]) moduleMap[mod] = [];
      moduleMap[mod].push(l);
    }

    const modules = Object.keys(moduleMap).map((name) => ({
      name,
      lessons: moduleMap[name],
    }));

    return res.status(200).json({
      success: true,
      count: lessons.length,
      course,
      lessons,
      modules,
    });
  } catch (error) {
    console.error("Admin get lessons error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch course lessons",
    });
  }
};

// Admin: GET /api/admin/lessons/:id
const getAdminLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    const lesson = await Lesson.findById(id).populate("course", "title").lean();
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error("Admin get lesson error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch lesson",
    });
  }
};

// Admin: POST /api/admin/lessons OR /api/admin/courses/:courseId/lessons
const createLesson = async (req, res) => {
  try {
    const courseId = req.params.courseId || req.body.course;
    const {
      title,
      module,
      description,
      content,
      videoUrl,
      documentUrl,
      resources,
      order,
      duration,
      published,
    } = req.body;

    if (!courseId || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "courseId, title, and content are required",
      });
    }

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const courseExists = await Course.exists({ _id: courseId });
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let lessonOrder = Number(order);
    if (!Number.isInteger(lessonOrder) || lessonOrder < 1) {
      // Auto-assign max order + 1
      const lastLesson = await Lesson.findOne({ course: courseId })
        .sort({ order: -1 })
        .select("order");
      lessonOrder = lastLesson ? lastLesson.order + 1 : 1;
    }

    const sanitizedResources = Array.isArray(resources)
      ? resources
          .filter((r) => r && r.title && r.url)
          .map((r) => ({
            title: String(r.title).trim(),
            url: String(r.url).trim(),
            type: ["document", "video", "link", "code", "other"].includes(r.type)
              ? r.type
              : "link",
          }))
      : [];

    const lesson = await Lesson.create({
      course: courseId,
      title: title.trim(),
      module: (module || "Module 1: Fundamentals").trim(),
      description: (description || "").trim(),
      content: content.trim(),
      videoUrl: (videoUrl || "").trim(),
      documentUrl: (documentUrl || "").trim(),
      resources: sanitizedResources,
      order: lessonOrder,
      duration: (duration || "15 min").trim(),
      published: Boolean(published),
    });

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error("Create lesson error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create lesson",
    });
  }
};

// Admin: PATCH /api/admin/lessons/:id
const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    const allowedFields = [
      "title",
      "module",
      "description",
      "content",
      "videoUrl",
      "documentUrl",
      "resources",
      "order",
      "duration",
      "published",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === "order") {
          const ord = Number(req.body.order);
          if (Number.isInteger(ord) && ord >= 1) {
            updates.order = ord;
          }
        } else if (field === "resources" && Array.isArray(req.body.resources)) {
          updates.resources = req.body.resources
            .filter((r) => r && r.title && r.url)
            .map((r) => ({
              title: String(r.title).trim(),
              url: String(r.url).trim(),
              type: ["document", "video", "link", "code", "other"].includes(r.type)
                ? r.type
                : "link",
            }));
        } else if (typeof req.body[field] === "string") {
          updates[field] = req.body[field].trim();
        } else {
          updates[field] = req.body[field];
        }
      }
    }

    const lesson = await Lesson.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson,
    });
  } catch (error) {
    console.error("Update lesson error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update lesson",
    });
  }
};

// Admin: PATCH /api/admin/lessons/:id/publish
const toggleLessonPublish = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    lesson.published =
      req.body && req.body.published !== undefined
        ? Boolean(req.body.published)
        : !lesson.published;
    await lesson.save();

    return res.status(200).json({
      success: true,
      message: `Lesson ${lesson.published ? "published" : "unpublished"} successfully`,
      published: lesson.published,
      lesson,
    });
  } catch (error) {
    console.error("Toggle lesson publish error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to toggle lesson publish status",
    });
  }
};

// Admin: DELETE /api/admin/lessons/:id
const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID",
      });
    }

    const lesson = await Lesson.findByIdAndDelete(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Clean up progress for this lesson
    await Progress.deleteMany({ lesson: id });

    return res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("Delete lesson error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete lesson",
    });
  }
};

// Admin: PUT /api/admin/courses/:courseId/lessons/reorder
const reorderLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { orders, lessonIds } = req.body;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const bulkOps = [];

    if (Array.isArray(orders)) {
      for (const item of orders) {
        if (mongoose.isValidObjectId(item.id)) {
          const update = { order: Number(item.order) || 1 };
          if (item.module) {
            update.module = String(item.module).trim();
          }
          bulkOps.push({
            updateOne: {
              filter: { _id: item.id, course: courseId },
              update: { $set: update },
            },
          });
        }
      }
    } else if (Array.isArray(lessonIds)) {
      lessonIds.forEach((id, index) => {
        if (mongoose.isValidObjectId(id)) {
          bulkOps.push({
            updateOne: {
              filter: { _id: id, course: courseId },
              update: { $set: { order: index + 1 } },
            },
          });
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "orders array or lessonIds array is required",
      });
    }

    if (bulkOps.length > 0) {
      await Lesson.bulkWrite(bulkOps);
    }

    const updatedLessons = await Lesson.find({ course: courseId })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Lessons reordered successfully",
      lessons: updatedLessons,
    });
  } catch (error) {
    console.error("Reorder lessons error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to reorder lessons",
    });
  }
};

module.exports = {
  getLessonsByCourse,
  getLessonById,
  getAdminLessonsByCourse,
  getAdminLessonById,
  createLesson,
  updateLesson,
  toggleLessonPublish,
  deleteLesson,
  reorderLessons,
};
