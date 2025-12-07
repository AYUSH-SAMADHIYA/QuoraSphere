const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
} = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

// Public routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Admin only route
router.post("/", authMiddleware, isAdmin, createJob);

module.exports = router;
