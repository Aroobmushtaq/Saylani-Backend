// // // routes/studentRoutes.js
// // const express = require('express');
// // const Course = require('../models/Course'); // Your Course model
// // const router = express.Router();

// // // Get all courses for students
// // router.get('/courses', async (req, res) => {
// //   try {
// //     const courses = await Course.find(); // Fetch all courses from the database
// //     res.json(courses);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: 'Error fetching courses' });
// //   }
// // });

// // module.exports = router;
// const express = require('express');
// const Course = require('../models/Course'); // Your Course model
// const router = express.Router();
// const { verifyToken } = require('../middlewares/verifyToken');

// // Get all courses for students
// router.get('/courses', async (req, res) => {
//   try {
//     const courses = await Course.find(); // Fetch all courses from the database
//     res.json(courses);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching courses' });
//   }
// });

// // Apply for a course
// router.post('/courses/:courseId/apply', async (req, res) => {
//   try {
//     const { courseId } = req.params;

//     // Fetch the course by ID
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     // Logic to apply for the course (e.g., add the student's ID to the course's applicants)
//     // Assume `req.user.id` contains the ID of the logged-in student
//     const studentId = req.user.id; // Replace with actual student authentication logic

//     if (!course.applicants) {
//       course.applicants = [];
//     }

//     if (course.applicants.includes(studentId)) {
//       return res.status(400).json({ message: 'You have already applied for this course' });
//     }

//     course.applicants.push(studentId);
//     await course.save();

//     res.json({ message: 'Successfully applied for the course' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error applying for the course' });
//   }
// });

// module.exports = router;
const express = require('express');
const Course = require('../models/Course');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// Get all courses for students
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses from the database
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Apply for a course
router.post('/courses/:courseId/apply', verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id; // Ensure this is populated by verifyToken

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.applicants) course.applicants = [];
    if (course.applicants.includes(studentId)) {
      return res.status(400).json({ message: 'You have already applied for this course' });
    }

    course.applicants.push(studentId);
    await course.save();

    res.json({ message: 'Successfully applied for the course' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error applying for the course' });
  }
});

module.exports = router;
