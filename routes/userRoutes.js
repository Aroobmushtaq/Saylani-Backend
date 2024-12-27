const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const auth=require("../middlewares/auth")

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, userType } = req.body;

        // Validate user type
        if (!['student', 'teacher'].includes(userType)) {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create user and hash password
        const user = new User({ name, email, password, userType });
        await user.save();

        // Generate token
        const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

// Login User
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Check if user exists
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         // Validate password
//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//         // Generate token
//         const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1d' });

//         res.status(200).json({ message: 'Login successful', token });
//     } catch (err) {
//         res.status(500).json({ message: 'Error logging in', error: err.message });
//     }
// };
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate token
        const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Send user information along with token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                email: user.email,
                userType: user.userType,  // Include userType here
                name: user.name,          // Include name if needed
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

// Update Password
const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Get user ID from the decoded token
        const userId = req.user.id;

        // Fetch user from the database
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Save the new password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating password', error: err.message });
    }
};

// Router setup
router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/update-password', updatePassword);

module.exports = router;
