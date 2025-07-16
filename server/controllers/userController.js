const Question = require('../models/Question');

exports.getMyQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your questions" });
  }
};
