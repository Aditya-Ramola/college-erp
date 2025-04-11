import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Authentication middleware to verify JWT tokens
 * Protects routes by validating the token in the request header
 * Sets userId in the request object if token is valid
 */
const auth = async (req, res, next) => {
  try {
    // Check if authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authentication failed. No token provided." });
    }

    // Extract token from authorization header
    const token = req.headers.authorization.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication failed. Invalid token format." });
    }

    // Verify the token using JWT_SECRET from environment variables
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set userId in request object for later use in route handlers
    req.userId = decodedData?.id;
    
    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Authentication failed. Token expired." });
    }
    
    return res.status(401).json({ message: "Authentication failed. Invalid token." });
  }
};

export default auth;
