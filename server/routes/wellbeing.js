import express from 'express';
import { check, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import Wellbeing from '../models/Wellbeing.js';
import mongoose from 'mongoose';

const router = express.Router();

// @route   GET api/wellbeing
// @desc    Get all wellbeing entries for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Wellbeing.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/wellbeing
// @desc    Create a new wellbeing entry
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('mood', 'Mood rating is required').isInt({ min: 1, max: 10 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { date, mood, energy, stress, sleep, activities, journal, gratitude, goals, insights } = req.body;

      const newEntry = new Wellbeing({
        user: req.user.id,
        date: date || Date.now(),
        mood,
        energy,
        stress,
        sleep,
        activities: activities || [],
        journal,
        gratitude: gratitude || [],
        goals: goals || [],
        insights
      });

      const entry = await newEntry.save();
      res.json(entry);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/wellbeing/:id
// @desc    Get a specific wellbeing entry
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await Wellbeing.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }

    // Make sure user owns the entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(entry);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/wellbeing/:id
// @desc    Update a wellbeing entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const entry = await Wellbeing.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }

    // Make sure user owns the entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { date, mood, energy, stress, sleep, activities, journal, gratitude, goals, insights } = req.body;

    // Build update object
    const updateFields = {};
    if (date) updateFields.date = date;
    if (mood) updateFields.mood = mood;
    if (energy !== undefined) updateFields.energy = energy;
    if (stress !== undefined) updateFields.stress = stress;
    if (sleep) updateFields.sleep = sleep;
    if (activities) updateFields.activities = activities;
    if (journal) updateFields.journal = journal;
    if (gratitude) updateFields.gratitude = gratitude;
    if (goals) updateFields.goals = goals;
    if (insights) updateFields.insights = insights;

    const updatedEntry = await Wellbeing.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(updatedEntry);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/wellbeing/:id
// @desc    Delete a wellbeing entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Wellbeing.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }

    // Make sure user owns the entry
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await entry.deleteOne();
    res.json({ msg: 'Entry removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/wellbeing/stats/trends
// @desc    Get wellbeing trends over time
// @access  Private
router.get('/stats/trends', auth, async (req, res) => {
  try {
    // Get mood trends over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const moodTrend = await Wellbeing.find({
      user: req.user.id,
      date: { $gte: thirtyDaysAgo }
    }).select('date mood energy stress').sort({ date: 1 });
    
    // Get average mood by activity
    const moodByActivity = await Wellbeing.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $unwind: '$activities' },
      { 
        $group: { 
          _id: '$activities', 
          averageMood: { $avg: '$mood' },
          count: { $sum: 1 } 
        } 
      },
      { $sort: { averageMood: -1 } }
    ]);
    
    // Get correlation between sleep and mood
    const sleepMoodCorrelation = await Wellbeing.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(req.user.id),
          'sleep.hours': { $exists: true }
        } 
      },
      { 
        $group: { 
          _id: '$sleep.hours',
          averageMood: { $avg: '$mood' },
          count: { $sum: 1 }
        } 
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      moodTrend,
      moodByActivity,
      sleepMoodCorrelation
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;