// // middleware/verifyToken.js
// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) {
//     return res.status(401).json({ message: 'Authentication error. Please log in.' });
//   }

//   try {
//     const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Token format: "Bearer <token>"
//     req.user = decoded; // Attach the decoded user info to the request object
//     next();
//   } catch (err) {
//     return res.status(400).json({ message: 'Invalid token.' });
//   }
// };

// module.exports = verifyToken;
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization'); // Get the Authorization header
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication error. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Ensure the token format is "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Authentication error. Invalid token format.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the JWT using your secret
    req.user = decoded; // Attach the decoded user to the request
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;
