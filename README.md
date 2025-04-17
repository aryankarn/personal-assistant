# Personal Growth Assistant

A comprehensive web and mobile application to improve habits in data structures & algorithms (DSA), fitness, and mental wellbeing.

## Features

- **DSA Practice Tracker**: Track progress on coding problems by platform, difficulty, and category
- **Workout Planner**: Log exercises, sets, reps, and monitor fitness progress
- **Mental Wellbeing**: Record mood, energy levels, stress, sleep quality, and activities
- **Task Manager**: Organize tasks with priorities, deadlines, and reminders
- **Push Notifications**: Receive timely reminders across devices
- **Progressive Web App**: Works on both web and mobile with offline capabilities

## Tech Stack

### Frontend
- React with Vite
- React Router for navigation
- Tailwind CSS for styling
- Chart.js for data visualization
- Progressive Web App (PWA) with Workbox

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Push notifications with web-push
- Scheduled tasks with node-cron

## Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Web browser with support for service workers and push notifications

## Installation and Setup

### 1. Clone the repository
```bash
git clone [repository-url]
cd personal-assistant
```

### 2. Set up the backend server

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/personal-assistant
JWT_SECRET=your_jwt_secret_here
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

To generate VAPID keys for push notifications:
```bash
npx web-push generate-vapid-keys
```

Start the server:
```bash
npm run dev
```

### 3. Set up the frontend client

Open a new terminal window, navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The application should now be running at http://localhost:3000.

## Usage

1. **Register an account** or login if you already have one
2. Navigate through the different sections of the app:
   - **Dashboard**: View summary of your progress across all areas
   - **DSA**: Track and manage coding practice problems
   - **Fitness**: Log and monitor your workouts
   - **Wellbeing**: Record your mood and wellbeing metrics
   - **Tasks**: Manage your tasks and set reminders
   - **Notifications**: Configure notification settings
3. Enable push notifications to receive reminders
4. On mobile devices, you can install the app on your home screen for a native app experience

## Building for Production

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
```

The built files will be in the `client/dist` directory, which can be deployed to any static hosting service.

## License

[MIT](LICENSE)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
