const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 👈 THIS is required for populate to work
    // required: true,
  },
  photoUrl:  String , // ✅ Add this

  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }], // ✅ Add this
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);
