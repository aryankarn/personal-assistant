import express from 'express';
import { check, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import Task from '../models/Task.js';
import mongoose from 'mongoose';

const router = express.Router();

// @route   GET api/tasks
// @desc    Get all tasks for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tasks
// @desc    Create a new task
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { 
        title, 
        description, 
        category, 
        priority, 
        status,
        dueDate, 
        reminderTime, 
        subtasks, 
        tags,
        recurring
      } = req.body;

      const newTask = new Task({
        user: req.user.id,
        title,
        description,
        category: category || 'Other',
        priority: priority || 'Medium',
        status: status || 'To Do',
        dueDate,
        reminderTime,
        subtasks: subtasks || [],
        tags: tags || [],
        recurring: recurring || { isRecurring: false }
      });

      const task = await newTask.save();
      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { 
      title, 
      description, 
      category, 
      priority, 
      status,
      dueDate, 
      reminderTime, 
      subtasks, 
      tags,
      recurring
    } = req.body;

    // Build update object
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (category) updateFields.category = category;
    if (priority) updateFields.priority = priority;
    if (status) {
      updateFields.status = status;
      if (status === 'Completed' && task.status !== 'Completed') {
        updateFields.completedAt = Date.now();
      } else if (status !== 'Completed') {
        updateFields.completedAt = undefined;
      }
    }
    if (dueDate !== undefined) updateFields.dueDate = dueDate;
    if (reminderTime !== undefined) updateFields.reminderTime = reminderTime;
    if (subtasks) updateFields.subtasks = subtasks;
    if (tags) updateFields.tags = tags;
    if (recurring) updateFields.recurring = recurring;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tasks/:id/subtasks
// @desc    Update subtasks for a task
// @access  Private
router.put('/:id/subtasks', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { subtasks } = req.body;
    if (!subtasks) {
      return res.status(400).json({ msg: 'Subtasks are required' });
    }

    task.subtasks = subtasks;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tasks/due/today
// @desc    Get tasks due today
// @access  Private
router.get('/due/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tasks = await Task.find({
      user: req.user.id,
      dueDate: { $gte: today, $lt: tomorrow },
      status: { $ne: 'Completed' }
    }).sort({ priority: -1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tasks/category/:category
// @desc    Get tasks by category
// @access  Private
router.get('/category/:category', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      category: req.params.category
    }).sort({ dueDate: 1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tasks/stats/summary
// @desc    Get task statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ user: req.user.id });
    const completedTasks = await Task.countDocuments({ 
      user: req.user.id,
      status: 'Completed' 
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueTodayCount = await Task.countDocuments({
      user: req.user.id,
      dueDate: { $gte: today, $lt: tomorrow },
      status: { $ne: 'Completed' }
    });
    
    const overdueTasks = await Task.countDocuments({
      user: req.user.id,
      dueDate: { $lt: today },
      status: { $ne: 'Completed' }
    });
    
    const categoryStats = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalTasks,
      completedTasks,
      dueTodayCount,
      overdueTasks,
      categoryStats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;