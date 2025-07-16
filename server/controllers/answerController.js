// server/controllers/answerController.js

const Answer = require("../models/Answer");
const Question = require("../models/Question");




exports.postAnswer = async (req, res) => {
  try {
    const { text } = req.body;
    const question = req.params.id;
    const userId = req.user._id;
  const imageUrl = req.file
      ? `/uploads/answers/${req.file.filename}`
      : req.body.image || null;

    const newAnswer = new Answer({
      question: question,
      content: text,
       image: imageUrl,
      answeredBy: userId,
    });

    // ✅ If image was uploaded
    if (req.file) {
      newAnswer.imageUrl = `/uploads/answers/${req.file.filename}`;
    }
    else if (imageUrl && imageUrl.startsWith("http")) {
      newAnswer.imageUrl = imageUrl;
    }

    await newAnswer.save();

    // Also push answer ref to question if you store it that way
    res.status(201).json(newAnswer);
  } catch (err) {
    console.error("❌ Error posting answer:", err);
    res.status(500).json({ message: "Server error while posting answer" });
  }
};



exports.getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId }).populate("answeredBy", "name");
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching answers", error: err.message });
  }
};

exports.upvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const userId = req.user.id;

    // Remove downvote if exists
    answer.downvotes = answer.downvotes.filter(id => id.toString() !== userId);

    // Toggle upvote
    if (answer.upvotes.includes(userId)) {
      answer.upvotes = answer.upvotes.filter(id => id.toString() !== userId);
    } else {
      answer.upvotes.push(userId);
    }

    await answer.save();
    const updated = await Answer.findById(answer._id).populate("answeredBy", "name");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Upvote failed", error: err.message });
  }
};

exports.downvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const userId = req.user.id;

    // Remove upvote if exists
    answer.upvotes = answer.upvotes.filter(id => id.toString() !== userId);

    // Toggle downvote
    if (answer.downvotes.includes(userId)) {
      answer.downvotes = answer.downvotes.filter(id => id.toString() !== userId);
    } else {
      answer.downvotes.push(userId);
    }

    await answer.save();
    const updated = await Answer.findById(answer._id).populate("answeredBy", "name");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Downvote failed", error: err.message });
  }
};
exports.deleteAnswer = async (req, res) => {
  try {
    console.log("User:", req.user.id);
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    console.log("Answer owner:", answer.answeredBy.toString());
    if (answer.answeredBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await answer.deleteOne();

    res.json({ message: "Answer deleted successfully" });
  } catch (err) {
    console.error("Error deleting answer:", err);
    res.status(500).json({ message: "Failed to delete answer", error: err.message });
  }
};
