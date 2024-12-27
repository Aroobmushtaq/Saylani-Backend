const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Ensure correct path to userRoutes
const teacherRoutes = require("./routes/teacherRoutes")
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const teacherProfileRoutes = require("./routes/teacherProfileRoutes")
const studentRoutes = require('./routes/studentRoutes');
const app = express();
// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors({
    origin: 'http://localhost:3000', // Your React app's origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Register routes
app.use('/api/users', userRoutes); // Prefix all routes with /api/users
app.use('/api/teacher', teacherRoutes); // Prefix all routes with /api/users
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/teacher', teacherProfileRoutes);
app.use('/api/student', studentRoutes);

module.exports = app; // Export the app instance for use in server.js
