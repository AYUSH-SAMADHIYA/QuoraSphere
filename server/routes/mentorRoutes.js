const express = require("express");
const router = express.Router();
const {
  getAllMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
  selectMentor,
} = require("../controllers/mentorController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

// Public routes
router.get("/", getAllMentors);
router.get("/:id", getMentorById);

// Student route - Select mentor
router.post("/:id/select", authMiddleware, selectMentor);

// Admin only routes
router.post("/", authMiddleware, isAdmin, createMentor);
router.put("/:id", authMiddleware, isAdmin, updateMentor);
router.delete("/:id", authMiddleware, isAdmin, deleteMentor);

module.exports = router;

