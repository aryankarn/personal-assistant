import mongoose from 'mongoose';

const notificationSubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    endpoint: {
      type: String,
      required: true
    },
    keys: {
      p256dh: {
        type: String,
        required: true
      },
      auth: {
        type: String,
        required: true
      }
    }
  },
  deviceInfo: {
    userAgent: String,
    deviceType: String, // 'mobile', 'desktop', 'tablet'
    platform: String
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
});

const NotificationSubscription = mongoose.model('NotificationSubscription', notificationSubscriptionSchema);

export default NotificationSubscription;