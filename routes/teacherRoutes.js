const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Course = require('../models/Course');
const { verifyToken, verifyTeacherRole } = require('../middlewares/auth');
const router = express.Router();

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Uploads directory created');
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Directory for storing uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix); // File name format
  }
});

const upload = multer({ storage });

// 1. **Create a course with image**
router.post(
  '/courses',
  verifyToken,
  verifyTeacherRole,
  upload.single('image'),
  async (req, res) => {
    console.log('Request body:', req.body);  // Check if name and description are coming through
    console.log('Uploaded file:', req.file);  // Check if file is uploaded correctly
    console.log('User:', req.user);
    const { name, description } = req.body;

    try {
      const course = new Course({
        name,
        description,
        image: req.file ? `/uploads/${req.file.filename}` : null,
        teacherId: req.user.id,
      });
      await course.save();
      res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
      res.status(500).json({ message: 'Error creating course', error: error.message });
    }
  }
);

// 2. **Get all courses for a teacher**
router.get('/courses', verifyToken, verifyTeacherRole, async (req, res) => {
  try {
    const courses = await Course.find({ teacherId: req.user.id });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// 3. **Update a course (using PATCH)**
router.patch(
  '/courses/:courseId',
  verifyToken,
  verifyTeacherRole,
  upload.single('image'),
  async (req, res) => {
    const { courseId } = req.params;
    const { name, description } = req.body;

    try {
      const course = await Course.findOne({ _id: courseId, teacherId: req.user.id });

      if (!course) {
        return res.status(404).json({ message: 'Course not found or unauthorized' });
      }

      // Update the fields that are provided in the request body
      course.name = name || course.name;
      course.description = description || course.description;

      // If a new image is uploaded, replace the old one
      if (req.file) {
        // Delete the old image if a new one is uploaded
        if (course.image) {
          fs.unlinkSync(path.join(__dirname, '..', course.image));
        }
        course.image = `/uploads/${req.file.filename}`;
      }

      await course.save();
      res.status(200).json({ message: 'Course updated successfully', course });
    } catch (error) {
      res.status(500).json({ message: 'Error updating course', error: error.message });
    }
  }
);

// 4. **Delete a course**
router.delete('/courses/:courseId', verifyToken, verifyTeacherRole, async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findOneAndDelete({ _id: courseId, teacherId: req.user.id });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }

    // Delete the image associated with the course
    if (course.image) {
      fs.unlinkSync(path.join(__dirname, '..', course.image));
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

module.exports = router;
