const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model
const { verifyToken, verifyTeacherRole } = require('../middlewares/auth');
const router = express.Router();
// Update password logic with new token generation
router.patch('/settings', verifyToken, verifyTeacherRole, async (req, res) => {
  try {
      const { password, newPassword } = req.body;

      const teacher = await User.findById(req.user.id);
      if (!teacher) {
          return res.status(404).json({ message: 'Teacher not found' });
      }

      const isPasswordCorrect = await bcrypt.compare(password, teacher.password);
      if (!isPasswordCorrect) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      if (newPassword) {
          teacher.password = await bcrypt.hash(newPassword, 10); // Hash new password
      }

      await teacher.save();

      // Generate a new JWT token
      const newToken = jwt.sign(
          { id: teacher._id, userType: teacher.userType },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
      );

      res.status(200).json({ message: 'Profile updated successfully!', token: newToken });
  } catch (err) {
      console.error('Error updating profile:', err);
      res.status(500).json({ message: 'Error updating profile' });
  }
});


module.exports = router;
