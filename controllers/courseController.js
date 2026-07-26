const Course = require('../models/CourseModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/responseHandler');

/**
 * @desc    Add a new course
 * @route   POST /api/courses
 * @access  Private/Admin
 */
exports.createCourse = catchAsync(async (req, res, next) => {
  const course = await Course.create({
    ...req.body,
    createdBy: req.user._id,
  });
  sendResponse(res, 201, 'Course created successfully', { course });
});

/**
 * @desc    Get all courses with search, filtering, sorting & pagination
 * @route   GET /api/courses
 * @query   search, category, level, status, sort, page, limit
 * @access  Public
 *
 * Examples:
 *   /api/courses?search=node&level=Beginner&sort=price&page=2&limit=10
 *   /api/courses?category=<categoryId>&sort=latest
 */
exports.getAllCourses = catchAsync(async (req, res, next) => {
  const { search, category, level, status, sort } = req.query;

  const filter = {};

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }
  if (level) {
    filter.level = level;
  }
  if (status) {
    filter.status = status;
  }

  // Sorting
  let sortBy = '-createdAt'; // default: latest first
  if (sort === 'latest') sortBy = '-createdAt';
  if (sort === 'price') sortBy = 'price';
  if (sort === '-price') sortBy = '-price';

  // Pagination
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  const [courses, totalCourses] = await Promise.all([
    Course.find(filter)
      .populate('category', 'categoryName slug')
      .populate('createdBy', 'fullName email')
      .sort(sortBy)
      .skip(skip)
      .limit(limit),
    Course.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCourses / limit) || 1;

  sendResponse(res, 200, 'Courses fetched successfully', { courses }, {
    totalCourses,
    totalPages,
    currentPage: page,
    pageSize: limit,
  });
});

/**
 * @desc    Get a single course by id
 * @route   GET /api/courses/:id
 * @access  Public
 */
exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate('category', 'categoryName slug')
    .populate('createdBy', 'fullName email');

  if (!course) {
    return next(new AppError('Course not found.', 404));
  }
  sendResponse(res, 200, 'Course fetched successfully', { course });
});

/**
 * @desc    Update a course
 * @route   PUT /api/courses/:id
 * @access  Private/Admin
 */
exports.updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(new AppError('Course not found.', 404));
  }
  sendResponse(res, 200, 'Course updated successfully', { course });
});

/**
 * @desc    Delete a course
 * @route   DELETE /api/courses/:id
 * @access  Private/Admin
 */
exports.deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return next(new AppError('Course not found.', 404));
  }
  sendResponse(res, 200, 'Course deleted successfully');
});
