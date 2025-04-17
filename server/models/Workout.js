import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: [{
    weight: Number,
    reps: Number,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  notes: String
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed', 'Skipped'],
    default: 'Planned'
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  exercises: [exerciseSchema],
  notes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;