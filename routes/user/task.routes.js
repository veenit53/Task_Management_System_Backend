const express = require("express");
const router = express.Router();
const Task = require("../../models/task.model");
const authMiddleware = require("../../middlewares/auth.middleware");

// Get all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single task
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      user: req.user._id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a task
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;