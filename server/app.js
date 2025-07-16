const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// ✅ Load environment variables
dotenv.config();

// ✅ Route imports
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ✅ New admin route

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);               // 🔐 Login/Register
app.use("/api/questions", questionRoutes);      // ❓ Questions CRUD
app.use("/api/answers", answerRoutes);          // 💬 Answers & Votes
app.use("/api/users", userRoutes);              // 👤 Profile & Personal Questions
app.use("/api/comments", commentRoutes);        // 💭 Comments
app.use("/api/admin", adminRoutes);             // 🛡️ Admin Panel Routes
app.use("/uploads", express.static("uploads"));

// ✅ Base route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)

.then(() => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});
