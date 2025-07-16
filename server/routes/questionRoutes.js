const express = require("express");
const router = express.Router();
const {
  askQuestion,
  getAllQuestions,
  getQuestionById,
  getUserQuestions,
  deleteQuestion,
  editQuestion,
  searchQuestions,
} = require("../controllers/questionController");

const authMiddleware = require("../middleware/authMiddleware");

// 🟢 Public Routes
router.get("/", getAllQuestions);
router.get("/search/query", searchQuestions);
router.get("/:id", getQuestionById);

// 🔒 Protected Routes
router.post("/", authMiddleware, askQuestion);
router.get("/user/profile", authMiddleware, getUserQuestions);
router.delete("/:id", authMiddleware, deleteQuestion);
router.put("/:id", authMiddleware, editQuestion);

module.exports = router;
