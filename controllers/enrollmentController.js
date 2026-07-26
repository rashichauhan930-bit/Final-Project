const Enrollment = require('../models/EnrollmentModel');
const Course = require('../models/CourseModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/responseHandler');

/**
 * @desc    Enroll a student into a course
 * @route   POST /api/enrollments
 * @body    { courseId }  (studentId comes from the logged-in user)
 * @access  Private/Student
 */
exports.enrollStudent = catchAsync(async (req, res, next) => {
  const { courseId } = req.body;

  if (!courseId) {
    return next(new AppError('courseId is required.', 400));
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError('Course not found.', 404));
  }

  const existing = await Enrollment.findOne({
    studentId: req.user._id,
    courseId,
  });
  if (existing) {
    return next(new AppError('You are already enrolled in this course.', 400));
  }

  const enrollment = await Enrollment.create({
    studentId: req.user._id,
    courseId,
  });

  sendResponse(res, 201, 'Enrolled successfully', { enrollment });
});

/**
 * @desc    Get all enrollments for the logged-in student
 * @route   GET /api/enrollments/my
 * @access  Private/Student
 */
exports.getStudentEnrollments = catchAsync(async (req, res, next) => {
  const enrollments = await Enrollment.find({ studentId: req.user._id })
    .populate('studentId', 'fullName email')
    .populate({
      path: 'courseId',
      select: 'title price level category',
      populate: { path: 'category', select: 'categoryName' },
    });

  sendResponse(res, 200, 'Enrollments fetched successfully', { enrollments });
});

/**
 * @desc    Get all students enrolled in a specific course
 * @route   GET /api/enrollments/course/:courseId
 * @access  Private/Admin
 */
exports.getCourseStudents = catchAsync(async (req, res, next) => {
  const enrollments = await Enrollment.find({ courseId: req.params.courseId })
    .populate('studentId', 'fullName email')
    .populate({
      path: 'courseId',
      select: 'title category',
      populate: { path: 'category', select: 'categoryName' },
    });

  sendResponse(res, 200, 'Course students fetched successfully', { enrollments });
});

/**
 * @desc    Remove an enrollment
 * @route   DELETE /api/enrollments/:id
 * @access  Private
 */
exports.removeEnrollment = catchAsync(async (req, res, next) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return next(new AppError('Enrollment not found.', 404));
  }

  // A student may only remove their own enrollment; an Admin may remove any
  if (
    req.user.role !== 'Admin' &&
    enrollment.studentId.toString() !== req.user._id.toString()
  ) {
    return next(new AppError('You do not have permission to remove this enrollment.', 403));
  }

  await enrollment.deleteOne();

  sendResponse(res, 200, 'Enrollment removed successfully');
});
