const Question = require("../models/Question");

exports.askQuestion = async (req, res) => {
  try {
    const { title, description, tags, photoUrl } = req.body; // ✅ Include photoUrl

    const newQuestion = await Question.create({
      title,
      description,
      tags,
      photoUrl, // ✅ Save it
      askedBy: req.user.id,
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error asking question", error: error.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("askedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(questions); // ✅ photoUrl is already included by default in MongoDB result
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error: error.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("askedBy", "name email");

    if (!question) return res.status(404).json({ message: "Question not found" });

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Error fetching question", error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      console.log("❌ Question not found:", req.params.id);
      return res.status(404).json({ message: "Question not found" });
    }

    console.log("🔐 Logged-in user:", req.user.id);
    console.log("📝 Question askedBy:", question.askedBy);

    if (question.askedBy.toString() !== req.user.id) {
      console.log("🚫 Unauthorized delete attempt");
      return res.status(403).json({ message: "Unauthorized" });
    }

    await question.deleteOne();

    console.log("✅ Question deleted:", question._id);
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("💥 Delete error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ askedBy: req.user.id });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user questions", error: err.message });
  }
};

exports.editQuestion = async (req, res) => {
  try {
    const { title, description, tags, photoUrl } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.askedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    question.title = title;
    question.description = description;
    question.tags = tags;
    question.photoUrl = photoUrl; // ✅ allow editing image too
    await question.save();

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Failed to update", error: err.message });
  }
};

exports.searchQuestions = async (req, res) => {
  const { query } = req.query;

  try {
    const results = await Question.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    }).populate("askedBy", "name");

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};
