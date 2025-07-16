const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin"); // OR use adminMiddleware

const {
  getAllUsers,
  getAllQuestions,
  deleteUser,
  deleteQuestion,
  getQuestionAnswers,
  getQuestionComments,
  deleteAnswer,
    deleteComment,

} = require("../controllers/adminController");

// Admin-only routes
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.get("/questions", authMiddleware, isAdmin, getAllQuestions);

router.delete("/user/:id", authMiddleware, isAdmin, deleteUser);
router.delete("/question/:id", authMiddleware, isAdmin, deleteQuestion);
router.delete("/answer/:id", authMiddleware, isAdmin, deleteAnswer);
router.delete("/comment/:id", authMiddleware, isAdmin, deleteComment);

router.get("/question/:id/answers", authMiddleware, isAdmin, getQuestionAnswers);
router.get("/question/:id/comments", authMiddleware, isAdmin, getQuestionComments);

module.exports = router;
