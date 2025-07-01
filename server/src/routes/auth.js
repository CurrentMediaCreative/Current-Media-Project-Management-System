const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

// Middleware
const auth = require("../middleware/auth");

// Mock user data (replace with database in production)
const users = [
  {
    id: 1,
    email: "admin@currentmedia.ca",
    password: "$2a$10$qvzJv9E73dUMOhu.Q5VDc.kgmqH6VIfa3l/7Wp2L7vL/b.FXrLGhu", // "password123"
    name: "Admin User",
  },
];

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = users.find((user) => user.email === email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1d" },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        }
      );
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify token & return user data
 * @access  Private
 */
router.get("/verify", auth, async (req, res) => {
  try {
    // Find user by ID
    const user = users.find((user) => user.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data without password
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Auth verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
