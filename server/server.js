import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import webpush from 'web-push';
import cron from 'node-cron';

// Route imports
import authRoutes from './routes/auth.js';
import dsaRoutes from './routes/dsa.js';
import fitnessRoutes from './routes/fitness.js';
import wellbeingRoutes from './routes/wellbeing.js';
import tasksRoutes from './routes/tasks.js';
import notificationRoutes from './routes/notifications.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Configure web-push
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:personal-assistant@example.com', // Replace with your email
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
})
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/wellbeing', wellbeingRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Schedule daily analysis and notifications
cron.schedule('0 20 * * *', async () => {
  console.log('Running daily analysis...');
  // Logic to analyze user progress and send notifications will go here
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;