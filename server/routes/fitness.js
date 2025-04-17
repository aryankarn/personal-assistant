import express from 'express';
import { check, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import Workout from '../models/Workout.js';

const router = express.Router();

// @route   GET api/fitness
// @desc    Get all workouts for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/fitness
// @desc    Create a new workout
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('type', 'Type is required').isIn(['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Other']),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, date, type, status, duration, exercises, notes, rating } = req.body;

      const newWorkout = new Workout({
        user: req.user.id,
        name,
        date,
        type,
        status: status || 'Planned',
        duration: duration || 0,
        exercises: exercises || [],
        notes,
        rating
      });

      const workout = await newWorkout.save();
      res.json(workout);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/fitness/:id
// @desc    Get a specific workout
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ msg: 'Workout not found' });
    }

    // Make sure user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(workout);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Workout not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/fitness/:id
// @desc    Update a workout
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ msg: 'Workout not found' });
    }

    // Make sure user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { name, date, type, status, duration, exercises, notes, rating } = req.body;

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (date) updateFields.date = date;
    if (type) updateFields.type = type;
    if (status) updateFields.status = status;
    if (duration !== undefined) updateFields.duration = duration;
    if (exercises) updateFields.exercises = exercises;
    if (notes) updateFields.notes = notes;
    if (rating) updateFields.rating = rating;

    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(updatedWorkout);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Workout not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/fitness/:id
// @desc    Delete a workout
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ msg: 'Workout not found' });
    }

    // Make sure user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await workout.deleteOne();
    res.json({ msg: 'Workout removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Workout not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/fitness/:id/exercises
// @desc    Add an exercise to a workout
// @access  Private
router.post('/:id/exercises', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ msg: 'Workout not found' });
    }

    // Make sure user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { name, sets, notes } = req.body;

    const newExercise = {
      name,
      sets: sets || [],
      notes
    };

    workout.exercises.push(newExercise);
    await workout.save();

    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/fitness/:id/exercises/:exerciseId
// @desc    Delete an exercise from a workout
// @access  Private
router.delete('/:id/exercises/:exerciseId', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ msg: 'Workout not found' });
    }

    // Make sure user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Find exercise index
    const exerciseIndex = workout.exercises.findIndex(
      exercise => exercise._id.toString() === req.params.exerciseId
    );

    if (exerciseIndex === -1) {
      return res.status(404).json({ msg: 'Exercise not found' });
    }

    workout.exercises.splice(exerciseIndex, 1);
    await workout.save();

    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/fitness/stats/summary
// @desc    Get workout statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalWorkouts = await Workout.countDocuments({ user: req.user.id });
    const completedWorkouts = await Workout.countDocuments({ user: req.user.id, status: 'Completed' });
    
    const typeStats = await Workout.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    const durationByMonth = await Workout.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id), status: 'Completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          totalDuration: { $sum: '$duration' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    res.json({
      totalWorkouts,
      completedWorkouts,
      typeStats,
      durationByMonth
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;