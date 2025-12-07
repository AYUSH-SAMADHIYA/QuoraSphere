const Mentor = require("../models/Mentor");

// GET /api/mentors - Get all mentors with optional filters
exports.getAllMentors = async (req, res) => {
  try {
    const { roleNumber, domain, careerGoal, experience, mentoringStyle } =
      req.query;

    // Build query object
    const query = {};

    if (roleNumber) {
      query.roleNumber = { $regex: roleNumber, $options: "i" };
    }

    if (domain) {
      query.domain = { $regex: domain, $options: "i" };
    }

    if (careerGoal) {
      query.careerGoal = { $regex: careerGoal, $options: "i" };
    }

    if (experience) {
      query.experience = { $regex: experience, $options: "i" };
    }

    if (mentoringStyle) {
      query.mentoringStyle = { $regex: mentoringStyle, $options: "i" };
    }

    const mentors = await Mentor.find(query).sort({ createdAt: -1 });

    res.json(mentors);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching mentors",
      error: error.message,
    });
  }
};

// GET /api/mentors/:id - Get single mentor by ID
exports.getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.json(mentor);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching mentor",
      error: error.message,
    });
  }
};

// POST /api/mentors - Create new mentor (Admin only)
exports.createMentor = async (req, res) => {
  try {
    const {
      name,
      roleNumber,
      domain,
      careerGoal,
      experience,
      mentoringStyle,
      email,
      linkedIn,
      phone,
    } = req.body;

    // Validation
    if (
      !name ||
      !roleNumber ||
      !domain ||
      !careerGoal ||
      !experience ||
      !mentoringStyle ||
      !email ||
      !phone
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const newMentor = await Mentor.create({
      name,
      roleNumber,
      domain,
      careerGoal,
      experience,
      mentoringStyle,
      email,
      linkedIn: linkedIn || "",
      phone,
    });

    res.status(201).json(newMentor);
  } catch (error) {
    res.status(500).json({
      message: "Error creating mentor",
      error: error.message,
    });
  }
};

// PUT /api/mentors/:id - Update mentor (Admin only)
exports.updateMentor = async (req, res) => {
  try {
    const {
      name,
      roleNumber,
      domain,
      careerGoal,
      experience,
      mentoringStyle,
      email,
      linkedIn,
      phone,
    } = req.body;

    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Update fields
    if (name) mentor.name = name;
    if (roleNumber) mentor.roleNumber = roleNumber;
    if (domain) mentor.domain = domain;
    if (careerGoal) mentor.careerGoal = careerGoal;
    if (experience) mentor.experience = experience;
    if (mentoringStyle) mentor.mentoringStyle = mentoringStyle;
    if (email) mentor.email = email;
    if (linkedIn !== undefined) mentor.linkedIn = linkedIn;
    if (phone) mentor.phone = phone;

    await mentor.save();

    res.json(mentor);
  } catch (error) {
    res.status(500).json({
      message: "Error updating mentor",
      error: error.message,
    });
  }
};

// DELETE /api/mentors/:id - Delete mentor (Admin only)
exports.deleteMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    await mentor.deleteOne();

    res.json({ message: "Mentor deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting mentor",
      error: error.message,
    });
  }
};

// POST /api/mentors/:id/select - Select mentor (Student only)
exports.selectMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Check if mentor is already selected
    if (mentor.selectedBy) {
      return res.status(400).json({
        message: "This mentor has already been selected by another student",
      });
    }

    // Check if user has already selected a mentor
    const existingSelection = await Mentor.findOne({
      selectedBy: req.user._id,
    });

    if (existingSelection) {
      return res.status(400).json({
        message: "You have already selected a mentor",
      });
    }

    mentor.selectedBy = req.user._id;
    await mentor.save();

    res.json({ message: "Mentor selected successfully", mentor });
  } catch (error) {
    res.status(500).json({
      message: "Error selecting mentor",
      error: error.message,
    });
  }
};

