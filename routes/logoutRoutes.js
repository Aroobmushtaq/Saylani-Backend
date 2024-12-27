// routes/teacherSettings.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');  // Assuming verifyToken is already created

// Logout route - Clears the token on the client-side (token invalidation should be handled on the client side)
router.post('/logout', verifyToken, (req, res) => {
  // This route doesn't need to perform any server-side action for JWT
  // but simply sends a success message and asks the client to remove the token

  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
