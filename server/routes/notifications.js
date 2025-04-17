import express from 'express';
import { check, validationResult } from 'express-validator';
import webpush from 'web-push';
import auth from '../middleware/auth.js';
import NotificationSubscription from '../models/NotificationSubscription.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

const router = express.Router();

// @route   POST api/notifications/subscribe
// @desc    Subscribe to push notifications
// @access  Private
router.post(
  '/subscribe',
  auth,
  [
    check('subscription', 'Subscription object is required').isObject(),
    check('subscription.endpoint', 'Endpoint is required').not().isEmpty(),
    check('subscription.keys', 'Keys are required').isObject(),
    check('subscription.keys.p256dh', 'P256dh key is required').not().isEmpty(),
    check('subscription.keys.auth', 'Auth key is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { subscription, deviceInfo } = req.body;

      // Check if subscription already exists
      let notificationSubscription = await NotificationSubscription.findOne({
        user: req.user.id,
        'subscription.endpoint': subscription.endpoint
      });

      if (notificationSubscription) {
        // Update existing subscription
        notificationSubscription.subscription = subscription;
        notificationSubscription.deviceInfo = deviceInfo;
        notificationSubscription.active = true;
        notificationSubscription.lastUsed = Date.now();
        await notificationSubscription.save();
      } else {
        // Create new subscription
        notificationSubscription = new NotificationSubscription({
          user: req.user.id,
          subscription,
          deviceInfo,
          active: true
        });
        await notificationSubscription.save();
      }

      // Update user subscription info for backward compatibility
      await User.findByIdAndUpdate(req.user.id, {
        $set: { subscription: subscription }
      });

      res.json({ message: 'Subscription saved' });
    } catch (err) {
      console.error('Error saving subscription:', err);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/notifications/unsubscribe
// @desc    Unsubscribe from push notifications
// @access  Private
router.delete('/unsubscribe', auth, async (req, res) => {
  try {
    const { endpoint } = req.body;
    
    if (!endpoint) {
      return res.status(400).json({ msg: 'Endpoint is required' });
    }

    // Find and deactivate subscription
    await NotificationSubscription.findOneAndUpdate(
      {
        user: req.user.id,
        'subscription.endpoint': endpoint
      },
      {
        $set: { active: false }
      }
    );

    res.json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error('Error unsubscribing:', err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/notifications/settings
// @desc    Get notification settings
// @access  Private
router.get('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notificationSettings -_id');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.notificationSettings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/notifications/settings
// @desc    Update notification settings
// @access  Private
router.put('/settings', auth, async (req, res) => {
  try {
    const { 
      dailySummary, 
      taskReminders, 
      dsaReminders,
      workoutReminders,
      wellbeingCheckins
    } = req.body;

    // Build settings object
    const settingsFields = {};
    if (dailySummary !== undefined) settingsFields['notificationSettings.dailySummary'] = dailySummary;
    if (taskReminders !== undefined) settingsFields['notificationSettings.taskReminders'] = taskReminders;
    if (dsaReminders !== undefined) settingsFields['notificationSettings.dsaReminders'] = dsaReminders;
    if (workoutReminders !== undefined) settingsFields['notificationSettings.workoutReminders'] = workoutReminders;
    if (wellbeingCheckins !== undefined) settingsFields['notificationSettings.wellbeingCheckins'] = wellbeingCheckins;

    // Update settings
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: settingsFields },
      { new: true }
    ).select('notificationSettings -_id');

    res.json(user.notificationSettings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/notifications/test
// @desc    Send a test notification
// @access  Private
router.post('/test', auth, async (req, res) => {
  try {
    const subscriptions = await NotificationSubscription.find({
      user: req.user.id,
      active: true
    });
    
    if (subscriptions.length === 0) {
      return res.status(400).json({ msg: 'No active subscriptions found' });
    }

    const payload = JSON.stringify({
      title: 'Test Notification',
      body: 'This is a test notification from your Personal Assistant',
      icon: '/icon-192x192.png',
      url: '/'
    });

    const results = [];
    
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub.subscription, payload);
        results.push({ 
          endpoint: sub.subscription.endpoint,
          success: true 
        });
      } catch (error) {
        console.error('Error sending notification:', error);
        results.push({ 
          endpoint: sub.subscription.endpoint, 
          success: false,
          error: error.message 
        });
        
        // Deactivate subscription if it's gone (unsubscribed)
        if (error.statusCode === 410) {
          await NotificationSubscription.findByIdAndUpdate(
            sub._id,
            { $set: { active: false } }
          );
        }
      }
    }

    res.json({ results });
  } catch (err) {
    console.error('Error in test notification:', err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/notifications/send
// @desc    Send notification to a user (used by internal services)
// @access  Private (admin only)
router.post(
  '/send/:userId',
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('body', 'Body is required').not().isEmpty(),
  ],
  async (req, res) => {
    // This should be protected by an admin middleware
    // For now we'll use the same auth middleware
    // and check if the user is sending to themselves
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Only allow sending to self for now 
      // (in a real app, this would be admin-only)
      if (req.params.userId !== req.user.id) {
        return res.status(403).json({ 
          msg: 'Not authorized to send notifications to other users' 
        });
      }

      const { title, body, icon, url, data } = req.body;

      const subscriptions = await NotificationSubscription.find({
        user: req.params.userId,
        active: true
      });
      
      if (subscriptions.length === 0) {
        return res.status(400).json({ msg: 'No active subscriptions found for this user' });
      }

      const payload = JSON.stringify({
        title,
        body,
        icon: icon || '/icon-192x192.png',
        url: url || '/',
        data
      });

      const results = [];
      
      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(sub.subscription, payload);
          results.push({ 
            endpoint: sub.subscription.endpoint,
            success: true 
          });
        } catch (error) {
          results.push({ 
            endpoint: sub.subscription.endpoint, 
            success: false,
            error: error.message 
          });
          
          // Deactivate subscription if it's gone
          if (error.statusCode === 410) {
            await NotificationSubscription.findByIdAndUpdate(
              sub._id,
              { $set: { active: false } }
            );
          }
        }
      }

      res.json({ results });
    } catch (err) {
      console.error('Error sending notification:', err);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/notifications/vapid-public-key
// @desc    Get the VAPID public key for push subscriptions
// @access  Public
router.get('/vapid-public-key', (req, res) => {
  if (process.env.VAPID_PUBLIC_KEY) {
    res.send(process.env.VAPID_PUBLIC_KEY);
  } else {
    res.status(500).send('VAPID keys not configured');
  }
});

// @route   GET api/notifications/upcoming
// @desc    Get upcoming task reminders
// @access  Private
router.get('/upcoming', auth, async (req, res) => {
  try {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    const tasks = await Task.find({
      user: req.user.id,
      reminderTime: { $gte: now, $lte: oneHourLater },
      status: { $ne: 'Completed' }
    }).sort({ reminderTime: 1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;