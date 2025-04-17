import mongoose from 'mongoose';

const dsaProblemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['LeetCode', 'HackerRank', 'CodeForces', 'Other'],
    default: 'Other'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  category: {
    type: String,
    enum: ['Array', 'String', 'Linked List', 'Tree', 'Graph', 'Dynamic Programming', 'Math', 'Greedy', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed', 'Revisit'],
    default: 'To Do'
  },
  notes: {
    type: String
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastAttempted: {
    type: Date
  },
  solution: {
    type: String
  },
  link: {
    type: String
  }
}, { timestamps: true });

const DsaProblem = mongoose.model('DsaProblem', dsaProblemSchema);

export default DsaProblem;