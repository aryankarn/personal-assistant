import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaBell, FaBellSlash, FaCheck } from 'react-icons/fa';

const NotificationsSetup = () => {
  const { token, user, updateUser } = useContext(AuthContext);
  const [settings, setSettings] = useState({
    dailySummary: true,
    taskReminders: true,
    dsaReminders: true,
    workoutReminders: true,
    wellbeingCheckins: true
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    // Check if user has already subscribed to notifications
    if ('Notification' in window && user) {
      setIsSubscribed(Notification.permission === 'granted');
      
      // Load notification settings
      const fetchSettings = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/notifications/settings', {
            headers: {
              'x-auth-token': token
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setSettings(data);
          }
        } catch (error) {
          console.error('Error fetching notification settings:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  const handleSubscribe = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setMessage({
        text: 'Push notifications are not supported in your browser',
        type: 'error'
      });
      return;
    }
    
    try {
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        setMessage({
          text: 'Notification permission denied',
          type: 'error'
        });
        return;
      }
      
      setIsSubscribed(true);
      
      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;
      
      // Get push subscription
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Get VAPID public key from backend
        const response = await fetch('http://localhost:5000/api/notifications/vapid-public-key');
        const vapidPublicKey = await response.text();
        
        // Convert VAPID key to Uint8Array
        const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
        
        // Subscribe to push notifications
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey
        });
      }
      
      // Send subscription to server
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      };
      
      await fetch('http://localhost:5000/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          subscription,
          deviceInfo
        })
      });
      
      setMessage({
        text: 'Successfully subscribed to notifications!',
        type: 'success'
      });
      
      // Send a test notification
      await fetch('http://localhost:5000/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      setMessage({
        text: 'Failed to subscribe to notifications',
        type: 'error'
      });
    }
  };

  const handleSettingChange = async (setting, value) => {
    try {
      const updatedSettings = { ...settings, [setting]: value };
      setSettings(updatedSettings);
      
      const response = await fetch('http://localhost:5000/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ [setting]: value })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      
      setMessage({
        text: 'Notification settings updated successfully',
        type: 'success'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setMessage({
        text: 'Failed to update settings',
        type: 'error'
      });
    }
  };

  // Function to convert base64 to Uint8Array for VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Notification Settings</h1>
      
      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'} mb-6`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Push Notifications</h2>
            <p className="text-gray-600">
              Receive notifications even when the app is closed
            </p>
          </div>
          
          {isSubscribed ? (
            <div className="flex items-center text-green-600">
              <FaCheck className="mr-1" /> Enabled
            </div>
          ) : (
            <button 
              onClick={handleSubscribe}
              className="btn btn-primary flex items-center"
            >
              <FaBell className="mr-2" /> Enable Notifications
            </button>
          )}
        </div>
        
        {!('Notification' in window) && (
          <p className="text-orange-600 mb-4">
            Your browser does not support push notifications.
          </p>
        )}
        
        {isSubscribed && (
          <p className="text-green-600 mb-4">
            You will receive notifications for the selected categories below.
          </p>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Notification Categories</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Daily Summary</h3>
              <p className="text-sm text-gray-600">
                Receive a daily summary of your progress
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.dailySummary}
                onChange={() => handleSettingChange('dailySummary', !settings.dailySummary)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Task Reminders</h3>
              <p className="text-sm text-gray-600">
                Get reminders for upcoming tasks
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.taskReminders}
                onChange={() => handleSettingChange('taskReminders', !settings.taskReminders)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">DSA Practice Reminders</h3>
              <p className="text-sm text-gray-600">
                Get reminded to practice DSA problems
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.dsaReminders}
                onChange={() => handleSettingChange('dsaReminders', !settings.dsaReminders)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Workout Reminders</h3>
              <p className="text-sm text-gray-600">
                Get reminders for scheduled workouts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.workoutReminders}
                onChange={() => handleSettingChange('workoutReminders', !settings.workoutReminders)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Wellbeing Check-ins</h3>
              <p className="text-sm text-gray-600">
                Reminders to log your mood and wellbeing
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.wellbeingCheckins}
                onChange={() => handleSettingChange('wellbeingCheckins', !settings.wellbeingCheckins)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSetup;