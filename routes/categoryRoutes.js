const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllCategories)
  .post(protect, restrictTo('Admin'), createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(protect, restrictTo('Admin'), updateCategory)
  .delete(protect, restrictTo('Admin'), deleteCategory);

module.exports = router;
