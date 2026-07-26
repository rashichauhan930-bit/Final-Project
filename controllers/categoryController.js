const Category = require('../models/CategoryModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/responseHandler');

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  sendResponse(res, 201, 'Category created successfully', { category });
});

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  sendResponse(res, 200, 'Categories fetched successfully', { categories });
});

/**
 * @desc    Get single category by id
 * @route   GET /api/categories/:id
 * @access  Public
 */
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError('Category not found.', 404));
  }
  sendResponse(res, 200, 'Category fetched successfully', { category });
});

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return next(new AppError('Category not found.', 404));
  }
  sendResponse(res, 200, 'Category updated successfully', { category });
});

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError('Category not found.', 404));
  }
  sendResponse(res, 200, 'Category deleted successfully');
});
