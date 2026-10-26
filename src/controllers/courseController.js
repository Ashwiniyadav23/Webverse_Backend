const mongoose = require("mongoose");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const Progress = require("../models/Progress");

// Public/Student: GET /api/courses
const getCourses = async (req, res) => {
  try {
    const filter = { published: true };

    if (req.query.classLevel) {
      const classLevel = Number(req.query.classLevel);
      if (!Number.isInteger(classLevel) || classLevel < 6 || classLevel > 12) {
        return res.status(400).json({
          success: false,
          message: "classLevel must be a number from 6 to 12",
        });
      }
      filter.classLevel = classLevel;
    }

    if (req.query.subject) {
      filter.subject = { $regex: String(req.query.subject), $options: "i" };
    }

    if (req.query.category) {
      filter.category = { $regex: String(req.query.category), $options: "i" };
    }

    if (req.query.q) {
      const q = String(req.query.q).trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { subject: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 }).lean();

    // Attach published lesson count for each course
    const courseIds = courses.map((c) => c._id);
    const lessonCounts = await Lesson.aggregate([
      { $match: { course: { $in: courseIds }, published: true } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
    ]);

    const countMap = new Map(
      lessonCounts.map((item) => [item._id.toString(), item.count])
    );

    const enrichedCourses = courses.map((course) => ({
      ...course,
      lessonCount: countMap.get(course._id.toString()) || 0,
    }));

    return res.status(200).json({
      success: true,
      count: enrichedCourses.length,
      courses: enrichedCourses,
    });
  } catch (error) {
    console.error("Get courses error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch courses",
    });
  }
};

// Public/Student: GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findOne({
      _id: req.params.id,
      published: true,
    }).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Published course not found",
      });
    }

    const lessonCount = await Lesson.countDocuments({
      course: course._id,
      published: true,
    });

    return res.status(200).json({
      success: true,
      course: {
        ...course,
        lessonCount,
      },
    });
  } catch (error) {
    console.error("Get course error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch course",
    });
  }
};

// Admin: POST /api/admin/courses
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      classLevel,
      subject,
      category,
      thumbnail,
      published,
    } = req.body;

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
      title: title.trim(),
      description: description.trim(),
      classLevel: level,
      subject: subject.trim(),
      category: (category || "Web Development").trim(),
      thumbnail: (thumbnail || "").trim(),
      published: Boolean(published),
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

// Admin: PATCH /api/admin/courses/:id
const updateCourse = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "classLevel",
      "subject",
      "category",
      "thumbnail",
      "published",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] === "string") {
          updates[field] = req.body[field].trim();
        } else {
          updates[field] = req.body[field];
        }
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

    const course = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

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
    console.error("Update course error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update course",
    });
  }
};

// Admin: PATCH /api/admin/courses/:id/publish
const toggleCoursePublish = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.published =
      req.body && req.body.published !== undefined
        ? Boolean(req.body.published)
        : !course.published;
    await course.save();

    return res.status(200).json({
      success: true,
      message: `Course ${course.published ? "published" : "unpublished"} successfully`,
      published: course.published,
      course,
    });
  } catch (error) {
    console.error("Toggle course publish error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to toggle course publish status",
    });
  }
};

// Admin: DELETE /api/admin/courses/:id
const deleteCourse = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await Promise.all([
      Lesson.deleteMany({ course: req.params.id }),
      Enrollment.deleteMany({ course: req.params.id }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Course and related lessons deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete course",
    });
  }
};

// Admin: GET /api/admin/courses
const getAllCoursesForAdmin = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = { $regex: String(req.query.category), $options: "i" };
    }

    if (req.query.published !== undefined) {
      filter.published = req.query.published === "true";
    }

    if (req.query.q) {
      const q = String(req.query.q).trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { subject: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 }).lean();

    const courseIds = courses.map((c) => c._id);

    // Fetch total and published lesson counts per course
    const [lessonStats, enrollmentStats, moduleStats] = await Promise.all([
      Lesson.aggregate([
        { $match: { course: { $in: courseIds } } },
        {
          $group: {
            _id: "$course",
            total: { $sum: 1 },
            published: {
              $sum: { $cond: [{ $eq: ["$published", true] }, 1, 0] },
            },
          },
        },
      ]),
      Enrollment.aggregate([
        { $match: { course: { $in: courseIds } } },
        { $group: { _id: "$course", count: { $sum: 1 } } },
      ]),
      Lesson.aggregate([
        { $match: { course: { $in: courseIds } } },
        { $group: { _id: "$course", modules: { $addToSet: "$module" } } },
      ]),
    ]);

    const lessonStatMap = new Map(
      lessonStats.map((item) => [item._id.toString(), item])
    );
    const enrollmentMap = new Map(
      enrollmentStats.map((item) => [item._id.toString(), item.count])
    );
    const moduleMap = new Map(
      moduleStats.map((item) => [item._id.toString(), item.modules || []])
    );

    const enrichedCourses = courses.map((course) => {
      const cid = course._id.toString();
      const lStat = lessonStatMap.get(cid) || { total: 0, published: 0 };
      return {
        ...course,
        totalLessons: lStat.total,
        publishedLessons: lStat.published,
        studentCount: enrollmentMap.get(cid) || 0,
        modules: moduleMap.get(cid) || [],
      };
    });

    // Categories list for filtering
    const categories = await Course.distinct("category");

    return res.status(200).json({
      success: true,
      count: enrichedCourses.length,
      categories,
      courses: enrichedCourses,
    });
  } catch (error) {
    console.error("Admin courses error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch courses",
    });
  }
};

// Admin: GET /api/admin/courses/:id
const getAdminCourseById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id).lean();
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const [lessons, studentCount] = await Promise.all([
      Lesson.find({ course: course._id }).sort({ order: 1, createdAt: 1 }).lean(),
      Enrollment.countDocuments({ course: course._id }),
    ]);

    // Group lessons by module
    const moduleMap = {};
    for (const lesson of lessons) {
      const modName = lesson.module || "General";
      if (!moduleMap[modName]) {
        moduleMap[modName] = [];
      }
      moduleMap[modName].push(lesson);
    }

    return res.status(200).json({
      success: true,
      course,
      studentCount,
      totalLessons: lessons.length,
      publishedLessons: lessons.filter((l) => l.published).length,
      lessons,
      modules: Object.keys(moduleMap).map((name) => ({
        name,
        lessons: moduleMap[name],
      })),
    });
  } catch (error) {
    console.error("Admin get course error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch course details",
    });
  }
};

// Admin: GET /api/admin/courses/:courseId/students
const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student", "name email role createdAt")
      .sort({ enrolledAt: -1 })
      .lean();

    const enrolled = enrollments
      .filter((e) => e.student != null)
      .map((e) => ({
        enrollmentId: e._id,
        enrolledAt: e.enrolledAt,
        student: e.student,
      }));
    const [lessons, progressRows] = await Promise.all([
      Lesson.find({ course: courseId }).select("_id title order module curriculum").sort({ order: 1 }).lean(),
      Progress.find({ student: { $in: enrolled.map((item) => item.student._id) } })
        .select("student lesson completed quizScore projectProgress.checklist curriculumProgress projectSubmission.status projectSubmission.score projectSubmission.missingRequirements")
        .populate("lesson", "title order course")
        .lean(),
    ]);
    const lessonById = new Map(lessons.map((lesson) => [String(lesson._id), lesson]));
    const lessonIds = new Set(lessons.map((lesson) => String(lesson._id)));
    const studentProgress = new Map();
    for (const progress of progressRows) {
      if (!progress.lesson || !lessonIds.has(String(progress.lesson._id))) continue;
      const lesson = lessonById.get(String(progress.lesson._id));
      const curriculumProgress = progress.curriculumProgress || {};
      const sectionComplete = lesson && lesson.order <= 6
        && (curriculumProgress.completedTopics || []).length >= (lesson.curriculum?.topics || []).length
        && (curriculumProgress.completedTasks || []).length >= (lesson.curriculum?.tasks || []).length
        && (curriculumProgress.quizAttempts || []).slice(-1)[0]?.score >= 67
        && Boolean(curriculumProgress.assessment?.passed);
      const key = String(progress.student);
      if (!studentProgress.has(key)) studentProgress.set(key, []);
      studentProgress.get(key).push({
        lessonId: progress.lesson._id,
        lessonTitle: progress.lesson.title,
        order: lesson?.order || progress.lesson.order,
        isProject: /^Final Project:/i.test(lesson?.module || "") || /^Final Project:/i.test(lesson?.title || ""),
        completed: lesson?.order === 7 ? progress.projectSubmission?.status === "complete" : Boolean(sectionComplete),
        quizScore: progress.quizScore,
        completedTopics: progress.curriculumProgress?.completedTopics || [],
        completedTasks: progress.curriculumProgress?.completedTasks || progress.projectProgress?.checklist || [],
        quizScore: progress.quizScore,
        assessmentPassed: progress.curriculumProgress?.assessment?.passed || false,
        assessmentFeedback: progress.curriculumProgress?.assessment?.feedback || [],
        projectStatus: progress.projectSubmission?.status || null,
        projectScore: progress.projectSubmission?.score ?? null,
        projectFeedback: progress.projectSubmission?.missingRequirements || [],
      });
    }
    const students = enrolled.map((item) => ({
      ...item,
      progress: studentProgress.get(String(item.student._id)) || [],
    }));

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get course students error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch enrolled students",
    });
  }
};

// Admin: POST /api/admin/courses/:courseId/students
const enrollStudentInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId, email } = req.body;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let targetStudentId = studentId;

    if (!targetStudentId && email) {
      const user = await User.findOne({
        email: email.trim().toLowerCase(),
        role: "student",
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No student found with that email address",
        });
      }
      targetStudentId = user._id;
    }

    if (!targetStudentId || !mongoose.isValidObjectId(targetStudentId)) {
      return res.status(400).json({
        success: false,
        message: "A valid studentId or student email is required",
      });
    }

    const student = await User.findById(targetStudentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({
        success: false,
        message: "Valid student account not found",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      course: courseId,
      student: targetStudentId,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      course: courseId,
      student: targetStudentId,
    });

    return res.status(201).json({
      success: true,
      message: `Enrolled ${student.name} successfully`,
      enrollment: {
        enrollmentId: enrollment._id,
        enrolledAt: enrollment.enrolledAt,
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }
    console.error("Admin enroll student error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to enroll student",
    });
  }
};

// Admin: DELETE /api/admin/courses/:courseId/students/:studentId
const removeStudentFromCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    if (
      !mongoose.isValidObjectId(courseId) ||
      !mongoose.isValidObjectId(studentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course or student ID",
      });
    }

    const enrollment = await Enrollment.findOneAndDelete({
      course: courseId,
      student: studentId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student access revoked successfully",
    });
  } catch (error) {
    console.error("Remove student error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to remove student from course",
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  toggleCoursePublish,
  deleteCourse,
  getAllCoursesForAdmin,
  getAdminCourseById,
  getCourseStudents,
  enrollStudentInCourse,
  removeStudentFromCourse,
};
