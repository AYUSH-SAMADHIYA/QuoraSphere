const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Optional: Only if you want to fetch user from DB

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Fetch full user (remove below line if not needed)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "User no longer exists" });

    req.user = user; // Attach full user object
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = authMiddleware;
