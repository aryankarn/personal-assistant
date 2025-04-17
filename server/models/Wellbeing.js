import mongoose from 'mongoose';

const wellbeingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mood: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  energy: {
    type: Number,
    min: 1,
    max: 10
  },
  stress: {
    type: Number,
    min: 1,
    max: 10
  },
  sleep: {
    hours: Number,
    quality: {
      type: Number,
      min: 1,
      max: 10
    }
  },
  activities: [{
    type: String,
    enum: ['Meditation', 'Reading', 'Walking', 'Nature', 'Social', 'Creative', 'Learning', 'Rest', 'Other']
  }],
  journal: {
    type: String
  },
  gratitude: [String],
  goals: [String],
  insights: String
}, { timestamps: true });

const Wellbeing = mongoose.model('Wellbeing', wellbeingSchema);

export default Wellbeing;