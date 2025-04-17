import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaDumbbell, FaBrain, FaTasks, FaBell, FaMobile, FaArrowRight } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="py-8 md:py-12 fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6 p-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="bg-white dark:bg-gray-900 rounded-full px-4 py-1.5">
              <span className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Your All-in-One Growth Tool
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Personal Growth Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Track your progress in coding, fitness, and mental wellbeing all in one place.
            Build better habits and achieve your personal development goals with our comprehensive assistant.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn btn-primary text-lg px-8 py-3 flex items-center">
              Get Started <FaArrowRight className="ml-2" />
            </Link>
            <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
              Login
            </Link>
          </div>
          
          {/* Hero Image */}
          <div className="mt-12 glass-card mx-auto max-w-4xl shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-75"></div>
            <img 
              src="https://placehold.co/1200x600/5e5be7/FFFFFF/png?text=Dashboard+Preview" 
              alt="Dashboard Preview" 
              className="relative z-10 rounded-lg shadow-inner w-full"
            />
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 mb-3">Features</span>
            <h2 className="text-3xl font-bold">Everything You Need</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* DSA Tracker */}
            <div className="card p-6 border-t-4 border-blue-500">
              <div className="text-blue-600 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaCode className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">DSA Practice Tracker</h3>
              <p className="text-gray-600">
                Track your progress on data structures and algorithms problems.
                Organize by difficulty, category, and platform.
              </p>
              <Link to="/register" className="inline-block mt-4 text-blue-600 font-medium">Learn more →</Link>
            </div>
            
            {/* Fitness Tracker */}
            <div className="card p-6 border-t-4 border-green-500">
              <div className="text-green-600 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FaDumbbell className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Workout Planner</h3>
              <p className="text-gray-600">
                Plan and track your workouts. Monitor your progress over time.
                Log exercises, sets, reps, and weights.
              </p>
              <Link to="/register" className="inline-block mt-4 text-green-600 font-medium">Learn more →</Link>
            </div>
            
            {/* Wellbeing Tracker */}
            <div className="card p-6 border-t-4 border-purple-500">
              <div className="text-purple-600 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FaBrain className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Mental Wellbeing</h3>
              <p className="text-gray-600">
                Monitor your mood, energy levels, and stress.
                Journal your thoughts and track activities.
              </p>
              <Link to="/register" className="inline-block mt-4 text-purple-600 font-medium">Learn more →</Link>
            </div>
            
            {/* Task Manager */}
            <div className="card p-6 border-t-4 border-amber-500">
              <div className="text-amber-600 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <FaTasks className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Task Manager</h3>
              <p className="text-gray-600">
                Stay organized with our comprehensive task manager.
                Set priorities, due dates, and reminders.
              </p>
              <Link to="/register" className="inline-block mt-4 text-amber-600 font-medium">Learn more →</Link>
            </div>
            
            {/* Notifications */}
            <div className="card p-6 border-t-4 border-red-500">
              <div className="text-red-600 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <FaBell className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Notifications</h3>
              <p className="text-gray-600">
                Receive timely reminders and updates about your tasks, 
                workouts, and wellbeing check-ins.
              </p>
              <Link to="/register" className="inline-block mt-4 text-red-600 font-medium">Learn more →</Link>
            </div>
            
            {/* Cross-platform */}
            <div className="card p-6 border-t-4 border-indigo-500">
              <div className="text-indigo-600 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FaMobile className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Web & Mobile Access</h3>
              <p className="text-gray-600">
                Access your personal assistant from any device.
                Our progressive web app works seamlessly everywhere.
              </p>
              <Link to="/register" className="inline-block mt-4 text-indigo-600 font-medium">Learn more →</Link>
            </div>
          </div>
        </div>
        
        {/* Testimonials (New Section) */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 mb-3">Testimonials</span>
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card">
              <p className="italic mb-4">"This app has completely transformed how I track my coding practice. I've solved 2x more problems since I started using it!"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">JD</div>
                <div>
                  <p className="font-semibold">Jane Developer</p>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card">
              <p className="italic mb-4">"I love how I can track both my fitness and coding progress in one place. The wellbeing features keep me balanced too."</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold mr-3">MF</div>
                <div>
                  <p className="font-semibold">Mike Fitness</p>
                  <p className="text-sm text-gray-500">Web Developer & Fitness Enthusiast</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card">
              <p className="italic mb-4">"The task manager is intuitive, and the reminders keep me accountable. Best productivity app I've used!"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-3">SP</div>
                <div>
                  <p className="font-semibold">Sara Productive</p>
                  <p className="text-sm text-gray-500">Product Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are improving their skills, health, and wellbeing with our personal assistant.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 font-medium">
              Create Your Account
            </Link>
            <Link to="/login" className="btn px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;