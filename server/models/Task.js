import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['Work', 'Personal', 'DSA', 'Fitness', 'Wellbeing', 'Learning', 'Other'],
    default: 'Other'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed', 'Cancelled'],
    default: 'To Do'
  },
  dueDate: {
    type: Date
  },
  reminderTime: {
    type: Date
  },
  subtasks: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  tags: [String],
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Custom'],
      default: 'Daily'
    },
    customPattern: String // For custom CRON patterns
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

// Index for finding tasks with upcoming reminders
taskSchema.index({ reminderTime: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;