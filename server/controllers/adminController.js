const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const Comment = require("../models/Comment");

// ✅ Get all users (excluding password)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ✅ Delete any user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// ✅ Get all questions with user populated
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("user", "name email");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching questions" });
  }
};

// ✅ Delete question by ID
const deleteQuestion = async (req, res) => {
  const questionId = req.params.id;
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    await Question.findByIdAndDelete(questionId);
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting question", error: err.message });
  }
};

// ✅ Fetch all answers for a given question

const getQuestionAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.id }).populate("answeredBy", "name");
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching answers", error: err.message });
  }
};

const getQuestionComments = async (req, res) => {
  try {
    const questionId = req.params.id;

    // ✅ Fix: Use 'question' not 'questionId'
    const answers = await Answer.find({ question: questionId }).select("_id");

    const answerIds = answers.map((a) => a._id);

    const comments = await Comment.find({ answerId: { $in: answerIds } })
      .populate("commentedBy", "name email")
      .populate("answerId", "content");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    res.json({ message: "Answer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting answer", error: err.message });
  }
};
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment", error: err.message });
  }
};


module.exports = {
  getAllUsers,
  deleteUser,
  getAllQuestions,
  deleteQuestion,
  getQuestionAnswers,
  getQuestionComments,
  deleteAnswer,
  deleteComment,
};
