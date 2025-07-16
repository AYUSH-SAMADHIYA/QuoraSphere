const express = require("express");
const router = express.Router();

const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

const authMiddleware = require("../middleware/authMiddleware");

// 🔓 Public
router.get("/:answerId", getComments);

// 🔒 Protected
router.post("/:answerId", authMiddleware, addComment);
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
