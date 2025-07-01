const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const documentRoutes = require("./routes/documents");

// Create Express app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logging
app.use(cors()); // CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/documents", documentRoutes);

// Health check endpoint for deployment
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// ClickUp API Proxy
// This will proxy requests to the ClickUp API to avoid CORS issues
if (process.env.CLICKUP_API_URL) {
  app.use(
    "/api/clickup",
    createProxyMiddleware({
      target: process.env.CLICKUP_API_URL,
      changeOrigin: true,
      pathRewrite: {
        "^/api/clickup": "", // Remove the /api/clickup prefix
      },
      headers: {
        Authorization: process.env.CLICKUP_API_KEY,
      },
    })
  );
}

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "../../client/dist")));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back the index.html file.
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
