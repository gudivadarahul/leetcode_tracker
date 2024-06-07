// routes/problems.js
const express = require("express");
const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Create a new problem
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, difficulty, tags, timeTaken, activeRecall } =
      req.body;
    const problem = new Problem({
      title,
      description,
      difficulty,
      tags,
      timeTaken,
      activeRecall,
      userId: req.user.id,
    });
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    console.error("From ROUTES: Error creating problem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all problems for the authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const problems = await Problem.find({ userId: req.user.id });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a specific problem by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem || problem.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a problem by ID
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, difficulty, tags } = req.body;
    const problem = await Problem.findById(req.params.id);
    if (!problem || problem.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Problem not found" });
    }
    problem.title = title;
    problem.description = description;
    problem.difficulty = difficulty;
    problem.tags = tags;
    problem.timeTaken = timeTaken;
    problem.activeRecall = activeRecall;
    problem.updatedAt = Date.now();
    await problem.save();
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a problem by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }
    const problem = await Problem.findById(id);
    if (!problem || problem.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Problem not found" });
    }
    await Problem.deleteOne({ _id: id });
    res.json({ message: "Problem deleted" });
  } catch (error) {
    console.error("Error deleting problem:", error); // Log the error
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
