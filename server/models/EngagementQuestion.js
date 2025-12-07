const mongoose = require("mongoose");

const engagementQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["aptitude", "reasoning", "coding"],
      lowercase: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length >= 2; // At least 2 options
        },
        message: "Question must have at least 2 options",
      },
    },
    correctOption: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 0 && v < this.options.length;
        },
        message: "correctOption must be a valid index in options array",
      },
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    explanation: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EngagementQuestion", engagementQuestionSchema);

