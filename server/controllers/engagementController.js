const EngagementQuestion = require("../models/EngagementQuestion");

// GET /api/engagement/questions - Get all questions with optional filters
exports.getAllQuestions = async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 20 } = req.query;

    // Build query object
    const query = {};

    if (category) {
      query.category = category.toLowerCase();
    }

    if (difficulty) {
      query.difficulty = difficulty.toLowerCase();
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const questions = await EngagementQuestion.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await EngagementQuestion.countDocuments(query);

    res.json({
      questions,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalQuestions: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching questions",
      error: error.message,
    });
  }
};

// GET /api/engagement/questions/test - Get random questions for test
exports.getTestQuestions = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;

    const query = {};
    if (category) {
      query.category = category.toLowerCase();
    }

    const limitNum = parseInt(limit);

    // Get random questions
    const questions = await EngagementQuestion.aggregate([
      { $match: query },
      { $sample: { size: limitNum } },
    ]);

    res.json(questions);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching test questions",
      error: error.message,
    });
  }
};

// GET /api/engagement/questions/:id - Get single question
exports.getQuestionById = async (req, res) => {
  try {
    const question = await EngagementQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching question",
      error: error.message,
    });
  }
};

// POST /api/engagement/questions - Create new question (Admin only)
exports.createQuestion = async (req, res) => {
  try {
    const { questionText, category, options, correctOption, difficulty, explanation } = req.body;

    // Validation
    if (!questionText || !category || !options || !Array.isArray(options) || correctOption === undefined) {
      return res.status(400).json({
        message: "questionText, category, options, and correctOption are required",
      });
    }

    if (options.length < 2) {
      return res.status(400).json({
        message: "Question must have at least 2 options",
      });
    }

    if (correctOption < 0 || correctOption >= options.length) {
      return res.status(400).json({
        message: "correctOption must be a valid index in options array",
      });
    }

    if (!["aptitude", "reasoning", "coding"].includes(category.toLowerCase())) {
      return res.status(400).json({
        message: "Category must be aptitude, reasoning, or coding",
      });
    }

    const newQuestion = await EngagementQuestion.create({
      questionText,
      category: category.toLowerCase(),
      options,
      correctOption: parseInt(correctOption),
      difficulty: difficulty || "medium",
      explanation: explanation || "",
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({
      message: "Error creating question",
      error: error.message,
    });
  }
};

// PUT /api/engagement/questions/:id - Update question (Admin only)
exports.updateQuestion = async (req, res) => {
  try {
    const { questionText, category, options, correctOption, difficulty, explanation } = req.body;

    const question = await EngagementQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update fields if provided
    if (questionText) question.questionText = questionText;
    if (category && ["aptitude", "reasoning", "coding"].includes(category.toLowerCase())) {
      question.category = category.toLowerCase();
    }
    if (options && Array.isArray(options)) {
      if (options.length < 2) {
        return res.status(400).json({
          message: "Question must have at least 2 options",
        });
      }
      question.options = options;
    }
    if (correctOption !== undefined) {
      const newCorrectOption = parseInt(correctOption);
      const optionsArray = question.options;
      if (newCorrectOption < 0 || newCorrectOption >= optionsArray.length) {
        return res.status(400).json({
          message: "correctOption must be a valid index in options array",
        });
      }
      question.correctOption = newCorrectOption;
    }
    if (difficulty && ["easy", "medium", "hard"].includes(difficulty.toLowerCase())) {
      question.difficulty = difficulty.toLowerCase();
    }
    if (explanation !== undefined) question.explanation = explanation;

    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({
      message: "Error updating question",
      error: error.message,
    });
  }
};

// DELETE /api/engagement/questions/:id - Delete question (Admin only)
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await EngagementQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await question.deleteOne();

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting question",
      error: error.message,
    });
  }
};

