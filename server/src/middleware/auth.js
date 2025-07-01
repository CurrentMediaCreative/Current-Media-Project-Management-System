const jwt = require("jsonwebtoken");

/**
 * Authentication middleware
 * Verifies JWT token and adds user data to request
 */
module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header("Authorization");
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = req.header("x-auth-token");
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // Add user from payload to request
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
