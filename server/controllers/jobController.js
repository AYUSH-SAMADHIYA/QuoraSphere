const Job = require("../models/Job");

// GET /api/jobs - Get all jobs with filters, search, and pagination
exports.getAllJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      remote,
      ctc,
      tags,
      year,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query object
    const query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Remote filter
    if (remote !== undefined && remote !== "") {
      query.isRemote = remote === "true" || remote === true;
    }

    // CTC filter (assuming format like "5-10 LPA" or "10+ LPA")
    if (ctc) {
      // Simple regex matching for CTC
      query.ctc = { $regex: ctc, $options: "i" };
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(",");
      query.tags = { $in: tagArray.map((tag) => new RegExp(tag.trim(), "i")) };
    }

    // Year eligibility filter
    if (year) {
      const yearArray = Array.isArray(year) ? year : year.split(",");
      query["eligibility.year"] = { $in: yearArray };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalJobs: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching jobs",
      error: error.message,
    });
  }
};

// GET /api/jobs/:id - Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching job",
      error: error.message,
    });
  }
};

// POST /api/jobs - Create new job (Admin only)
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      isRemote,
      ctc,
      tags,
      eligibility,
    } = req.body;

    // Validation
    if (!title || !description || !location || !ctc) {
      return res.status(400).json({
        message: "Title, description, location, and CTC are required",
      });
    }

    // Parse tags if string
    const tagsArray = Array.isArray(tags)
      ? tags
      : tags
      ? tags.split(",").map((tag) => tag.trim())
      : [];

    // Parse eligibility
    const eligibilityObj = {
      year: Array.isArray(eligibility?.year)
        ? eligibility.year
        : eligibility?.year
        ? eligibility.year.split(",").map((y) => y.trim())
        : [],
      branch: Array.isArray(eligibility?.branch)
        ? eligibility.branch
        : eligibility?.branch
        ? eligibility.branch.split(",").map((b) => b.trim())
        : [],
    };

    const newJob = await Job.create({
      title,
      company: company || "",
      description,
      location,
      isRemote: isRemote === true || isRemote === "true",
      ctc,
      tags: tagsArray,
      eligibility: eligibilityObj,
      postedBy: req.user._id,
    });

    const populatedJob = await Job.findById(newJob._id).populate(
      "postedBy",
      "name email"
    );

    res.status(201).json(populatedJob);
  } catch (error) {
    res.status(500).json({
      message: "Error creating job",
      error: error.message,
    });
  }
};
