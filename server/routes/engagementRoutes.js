const express = require("express");
const router = express.Router();
const {
  getAllQuestions,
  getTestQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/engagementController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

// Public routes
router.get("/questions", getAllQuestions);
router.get("/questions/test", getTestQuestions);
router.get("/questions/:id", getQuestionById);

// Admin only routes
router.post("/questions", authMiddleware, isAdmin, createQuestion);
router.put("/questions/:id", authMiddleware, isAdmin, updateQuestion);
router.delete("/questions/:id", authMiddleware, isAdmin, deleteQuestion);

module.exports = router;

