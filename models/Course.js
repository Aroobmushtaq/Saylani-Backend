// const mongoose = require('mongoose');

// const CourseSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   image: { type: String }, // Path to the uploaded image
//   teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to teacher
//   applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array to store student IDs

// }, { timestamps: true });

// module.exports = mongoose.model('Course', CourseSchema);
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model for teachers
    required: true,
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model for students
    },
  ],
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
