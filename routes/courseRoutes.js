const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllCourses) // supports ?search=&category=&level=&status=&sort=&page=&limit=
  .post(protect, restrictTo('Admin'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, restrictTo('Admin'), updateCourse)
  .delete(protect, restrictTo('Admin'), deleteCourse);

module.exports = router;
