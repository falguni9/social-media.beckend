const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/config'); // Store your secret key securely

function authenticateUser(req, res, next) {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId; // Store the user ID in the request object
    next(); // Continue with the next middleware
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authenticateUser;
