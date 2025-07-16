const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  const { text } = req.body;
  const { answerId } = req.params;

  if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

  try {
    const comment = await Comment.create({
      answerId,
      commentedBy: req.user.id,
      text,
    });

    const populated = await comment.populate("commentedBy", "name");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment", error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ answerId: req.params.answerId })
      .populate("commentedBy", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
};
// In controllers/commentController.js


exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Ensure only the original commenter can delete
    if (comment.commentedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await comment.deleteOne(); // safer and recommended in recent Mongoose
    res.json({ message: "Comment deleted successfully" });

  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Failed to delete comment", error: err.message });
  }
};

