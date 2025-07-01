const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Middleware
const auth = require("../middleware/auth");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept common document types
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "image/gif",
    "text/plain",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only documents and images are allowed."),
      false
    );
  }
};

// Configure upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Local storage for documents
let documents = [];
let nextDocId = 1000;

// Helper function to get file type from mimetype
const getFileType = (mimetype) => {
  if (mimetype.includes("pdf")) return "pdf";
  if (mimetype.includes("word")) return "doc";
  if (mimetype.includes("excel") || mimetype.includes("spreadsheet"))
    return "excel";
  if (mimetype.includes("powerpoint") || mimetype.includes("presentation"))
    return "powerpoint";
  if (mimetype.includes("image")) return "image";
  return "other";
};

/**
 * @route   GET /api/documents/project/:projectId
 * @desc    Get all documents for a project
 * @access  Private
 */
router.get("/project/:projectId", auth, async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Filter documents by project ID
    const projectDocuments = documents.filter(
      (doc) => doc.projectId === projectId
    );

    res.json(projectDocuments);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/documents/:id
 * @desc    Get document by ID
 * @access  Private
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const documentId = req.params.id;

    // Find document by ID
    const document = documents.find((doc) => doc.id.toString() === documentId);

    // If document not found
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(document);
  } catch (err) {
    console.error("Error fetching document:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/documents
 * @desc    Create a new document
 * @access  Private
 */
router.post(
  "/",
  [
    auth,
    upload.single("file"),
    [
      check("name", "Name is required").not().isEmpty(),
      check("projectId", "Project ID is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, projectId } = req.body;

      // Create document object
      const newDocument = {
        id: nextDocId++,
        name,
        description: description || "",
        projectId,
        createdAt: new Date().toISOString(),
        uploadedBy: req.user.id, // User ID from auth middleware
      };

      // If file was uploaded
      if (req.file) {
        newDocument.filename = req.file.filename;
        newDocument.originalName = req.file.originalname;
        newDocument.path = req.file.path;
        newDocument.size = req.file.size;
        newDocument.mimetype = req.file.mimetype;
        newDocument.fileType = getFileType(req.file.mimetype);
      }

      // Add to documents array
      documents.push(newDocument);

      res.status(201).json(newDocument);
    } catch (err) {
      console.error("Error creating document:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   PUT /api/documents/:id
 * @desc    Update a document
 * @access  Private
 */
router.put(
  "/:id",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const documentId = req.params.id;

      // Find document index
      const documentIndex = documents.findIndex(
        (doc) => doc.id.toString() === documentId
      );

      // If document not found
      if (documentIndex === -1) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Update document (only certain fields)
      const updatedDocument = {
        ...documents[documentIndex],
        name: req.body.name,
        description:
          req.body.description || documents[documentIndex].description,
      };

      documents[documentIndex] = updatedDocument;

      res.json(updatedDocument);
    } catch (err) {
      console.error("Error updating document:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete a document
 * @access  Private
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const documentId = req.params.id;

    // Find document index
    const documentIndex = documents.findIndex(
      (doc) => doc.id.toString() === documentId
    );

    // If document not found
    if (documentIndex === -1) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Get document to delete its file
    const documentToDelete = documents[documentIndex];

    // Delete file if it exists
    if (documentToDelete.path && fs.existsSync(documentToDelete.path)) {
      fs.unlinkSync(documentToDelete.path);
    }

    // Remove document from array
    documents.splice(documentIndex, 1);

    res.json({ message: "Document removed" });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/documents/:id/attachments
 * @desc    Upload an attachment to a document
 * @access  Private
 */
router.post(
  "/:id/attachments",
  [auth, upload.single("file")],
  async (req, res) => {
    try {
      const documentId = req.params.id;

      // Find document
      const document = documents.find(
        (doc) => doc.id.toString() === documentId
      );

      // If document not found
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Create attachment object
      const attachment = {
        id: Date.now().toString(),
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        fileType: getFileType(req.file.mimetype),
        uploadedAt: new Date().toISOString(),
        uploadedBy: req.user.id,
      };

      // Initialize attachments array if it doesn't exist
      if (!document.attachments) {
        document.attachments = [];
      }

      // Add attachment to document
      document.attachments.push(attachment);

      res.status(201).json(attachment);
    } catch (err) {
      console.error("Error uploading attachment:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
