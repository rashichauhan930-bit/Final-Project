const express = require('express');
const router = express.Router();
const {
  enrollStudent,
  getStudentEnrollments,
  getCourseStudents,
  removeEnrollment,
} = require('../controllers/enrollmentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, restrictTo('Student'), enrollStudent);
router.get('/my', protect, restrictTo('Student'), getStudentEnrollments);
router.get('/course/:courseId', protect, restrictTo('Admin'), getCourseStudents);
router.delete('/:id', protect, removeEnrollment);

module.exports = router;
