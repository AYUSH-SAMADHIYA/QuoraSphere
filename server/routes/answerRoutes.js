const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  postAnswer,
  getAnswersByQuestion,
  upvoteAnswer,
  downvoteAnswer,
  deleteAnswer,
} = require("../controllers/answerController");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📁 Create uploads/answers if not exists
const uploadPath = "uploads/answers";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// 📦 Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 🔁 Routes
router.post("/:id", authMiddleware, upload.single("image"), postAnswer);
router.get("/:questionId", getAnswersByQuestion);
router.put("/upvote/:id", authMiddleware, upvoteAnswer);
router.put("/downvote/:id", authMiddleware, downvoteAnswer);
router.delete("/:id", authMiddleware, deleteAnswer);

module.exports = router;
