import express from 'express';
import { check, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import DsaProblem from '../models/DsaProblem.js';

const router = express.Router();

// @route   GET api/dsa
// @desc    Get all DSA problems for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const problems = await DsaProblem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/dsa
// @desc    Create a new DSA problem
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('platform', 'Platform is required').isIn(['LeetCode', 'HackerRank', 'CodeForces', 'Other']),
      check('difficulty', 'Difficulty is required').isIn(['Easy', 'Medium', 'Hard']),
      check('category', 'Category is required').isIn(['Array', 'String', 'Linked List', 'Tree', 'Graph', 'Dynamic Programming', 'Math', 'Greedy', 'Other']),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, platform, difficulty, category, status, notes, timeSpent, solution, link } = req.body;

      const newProblem = new DsaProblem({
        user: req.user.id,
        title,
        platform,
        difficulty,
        category,
        status: status || 'To Do',
        notes,
        timeSpent: timeSpent || 0,
        solution,
        link
      });

      const problem = await newProblem.save();
      res.json(problem);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/dsa/:id
// @desc    Get a specific DSA problem
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const problem = await DsaProblem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ msg: 'Problem not found' });
    }

    // Make sure user owns the problem
    if (problem.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(problem);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Problem not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/dsa/:id
// @desc    Update a DSA problem
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const problem = await DsaProblem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ msg: 'Problem not found' });
    }

    // Make sure user owns the problem
    if (problem.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { title, platform, difficulty, category, status, notes, timeSpent, attempts, solution, link } = req.body;

    // Build update object with only provided fields
    const updateFields = {};
    if (title) updateFields.title = title;
    if (platform) updateFields.platform = platform;
    if (difficulty) updateFields.difficulty = difficulty;
    if (category) updateFields.category = category;
    if (status) {
      updateFields.status = status;
      if (status === 'Completed' || status === 'In Progress') {
        updateFields.lastAttempted = Date.now();
        if (status === 'Completed' && problem.status !== 'Completed') {
          updateFields.attempts = (problem.attempts || 0) + 1;
        }
      }
    }
    if (notes) updateFields.notes = notes;
    if (timeSpent !== undefined) updateFields.timeSpent = timeSpent;
    if (attempts !== undefined) updateFields.attempts = attempts;
    if (solution) updateFields.solution = solution;
    if (link) updateFields.link = link;

    const updatedProblem = await DsaProblem.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(updatedProblem);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Problem not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/dsa/:id
// @desc    Delete a DSA problem
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const problem = await DsaProblem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ msg: 'Problem not found' });
    }

    // Make sure user owns the problem
    if (problem.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await problem.deleteOne();
    res.json({ msg: 'Problem removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Problem not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/dsa/stats/summary
// @desc    Get DSA problem statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalProblems = await DsaProblem.countDocuments({ user: req.user.id });
    const completedProblems = await DsaProblem.countDocuments({ user: req.user.id, status: 'Completed' });
    const inProgressProblems = await DsaProblem.countDocuments({ user: req.user.id, status: 'In Progress' });
    
    const categoryStats = await DsaProblem.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const difficultyStats = await DsaProblem.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalProblems,
      completedProblems,
      inProgressProblems,
      categoryStats,
      difficultyStats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;