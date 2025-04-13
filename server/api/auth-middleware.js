import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT tokens for protected routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const auth = (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    // Verify token
    try {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedData.id;
      req.role = decodedData.role;
      req.username = decodedData.username;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Authentication failed. Token expired.' });
      }
      return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error during authentication' });
  }
};

export default auth; 