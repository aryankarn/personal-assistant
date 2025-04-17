import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaCode, FaDumbbell, FaBrain, FaTasks, FaArrowRight, FaPlus } from 'react-icons/fa';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    dsa: { totalProblems: 0, completedProblems: 0 },
    fitness: { totalWorkouts: 0, completedWorkouts: 0 },
    wellbeing: { averageMood: 0, entriesCount: 0 },
    tasks: { totalTasks: 0, completedTasks: 0, dueTodayCount: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch DSA stats
        const dsaRes = await fetch('http://localhost:5000/api/dsa/stats/summary', {
          headers: { 'x-auth-token': token }
        });
        const dsaData = await dsaRes.json();
        
        // Fetch Fitness stats
        const fitnessRes = await fetch('http://localhost:5000/api/fitness/stats/summary', {
          headers: { 'x-auth-token': token }
        });
        const fitnessData = await fitnessRes.json();
        
        // Fetch Tasks stats
        const tasksRes = await fetch('http://localhost:5000/api/tasks/stats/summary', {
          headers: { 'x-auth-token': token }
        });
        const tasksData = await tasksRes.json();
        
        // Fetch Wellbeing stats (last 30 days)
        const wellbeingRes = await fetch('http://localhost:5000/api/wellbeing/stats/trends', {
          headers: { 'x-auth-token': token }
        });
        const wellbeingData = await wellbeingRes.json();
        
        // Calculate average mood
        let averageMood = 0;
        let entriesCount = 0;
        if (wellbeingData.moodTrend && wellbeingData.moodTrend.length > 0) {
          const totalMood = wellbeingData.moodTrend.reduce((sum, entry) => sum + entry.mood, 0);
          entriesCount = wellbeingData.moodTrend.length;
          averageMood = entriesCount > 0 ? Math.round((totalMood / entriesCount) * 10) / 10 : 0;
        }
        
        setStats({
          dsa: {
            totalProblems: dsaData.totalProblems || 0,
            completedProblems: dsaData.completedProblems || 0
          },
          fitness: {
            totalWorkouts: fitnessData.totalWorkouts || 0,
            completedWorkouts: fitnessData.completedWorkouts || 0
          },
          wellbeing: {
            averageMood,
            entriesCount
          },
          tasks: {
            totalTasks: tasksData.totalTasks || 0,
            completedTasks: tasksData.completedTasks || 0,
            dueTodayCount: tasksData.dueTodayCount || 0
          }
        });

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const getMoodEmoji = (mood) => {
    if (!mood) return '😐';
    if (mood >= 4) return '😁';
    if (mood >= 3) return '🙂';
    if (mood >= 2) return '😐';
    return '😔';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 mb-8 shadow-lg text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="opacity-90">Here's your personal growth summary</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* DSA Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
            <div className="bg-blue-50 p-6">
              <div className="flex items-center justify-between">
                <div className="bg-blue-100 rounded-full p-3">
                  <FaCode className="text-blue-600 text-xl" />
                </div>
                <Link to="/dsa" className="text-blue-600 hover:text-blue-800 flex items-center group">
                  <span className="text-sm font-medium mr-1 group-hover:mr-2 transition-all duration-200">View All</span>
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </Link>
              </div>
              <h2 className="text-xl font-bold mt-4 text-gray-800">DSA Progress</h2>
              <p className="text-gray-500 text-sm">Tracking your coding challenges</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Problems Solved</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">{stats.dsa.completedProblems}</p>
                    <p className="text-gray-500 text-sm ml-2 mb-1">/ {stats.dsa.totalProblems}</p>
                  </div>
                </div>
                
                <Link to="/dsa/new" className="bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white p-2 rounded-full transition-colors duration-200">
                  <FaPlus />
                </Link>
              </div>
              
              <div>
                <div className="flex justify-between mb-1.5 text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-blue-600">
                    {stats.dsa.totalProblems > 0 
                      ? Math.round((stats.dsa.completedProblems / stats.dsa.totalProblems) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ 
                      width: `${stats.dsa.totalProblems > 0 
                        ? (stats.dsa.completedProblems / stats.dsa.totalProblems) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fitness Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
            <div className="bg-green-50 p-6">
              <div className="flex items-center justify-between">
                <div className="bg-green-100 rounded-full p-3">
                  <FaDumbbell className="text-green-600 text-xl" />
                </div>
                <Link to="/fitness" className="text-green-600 hover:text-green-800 flex items-center group">
                  <span className="text-sm font-medium mr-1 group-hover:mr-2 transition-all duration-200">View All</span>
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </Link>
              </div>
              <h2 className="text-xl font-bold mt-4 text-gray-800">Fitness Tracker</h2>
              <p className="text-gray-500 text-sm">Stay active and healthy</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Workouts Completed</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">{stats.fitness.completedWorkouts}</p>
                    <p className="text-gray-500 text-sm ml-2 mb-1">/ {stats.fitness.totalWorkouts}</p>
                  </div>
                </div>
                
                <Link to="/fitness/new" className="bg-green-100 text-green-600 hover:bg-green-600 hover:text-white p-2 rounded-full transition-colors duration-200">
                  <FaPlus />
                </Link>
              </div>
              
              <div>
                <div className="flex justify-between mb-1.5 text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-green-600">
                    {stats.fitness.totalWorkouts > 0 
                      ? Math.round((stats.fitness.completedWorkouts / stats.fitness.totalWorkouts) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-600 to-green-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ 
                      width: `${stats.fitness.totalWorkouts > 0 
                        ? (stats.fitness.completedWorkouts / stats.fitness.totalWorkouts) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wellbeing Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
            <div className="bg-purple-50 p-6">
              <div className="flex items-center justify-between">
                <div className="bg-purple-100 rounded-full p-3">
                  <FaBrain className="text-purple-600 text-xl" />
                </div>
                <Link to="/wellbeing" className="text-purple-600 hover:text-purple-800 flex items-center group">
                  <span className="text-sm font-medium mr-1 group-hover:mr-2 transition-all duration-200">View All</span>
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </Link>
              </div>
              <h2 className="text-xl font-bold mt-4 text-gray-800">Mental Wellbeing</h2>
              <p className="text-gray-500 text-sm">Track your mental health</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-2">Your Average Mood</p>
                  <div className="flex flex-col items-center">
                    <div className="text-5xl mb-2">
                      {getMoodEmoji(stats.wellbeing.averageMood)}
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.wellbeing.averageMood || 'No data'}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">From {stats.wellbeing.entriesCount} entries</p>
                </div>
              </div>
              
              <div className="pt-2">
                <Link 
                  to="/wellbeing/new" 
                  className="block w-full py-2 px-4 bg-purple-100 hover:bg-purple-600 text-purple-600 hover:text-white rounded-lg transition-colors duration-200 text-center font-medium"
                >
                  + Add Today's Entry
                </Link>
              </div>
            </div>
          </div>
          
          {/* Tasks Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
            <div className="bg-orange-50 p-6">
              <div className="flex items-center justify-between">
                <div className="bg-orange-100 rounded-full p-3">
                  <FaTasks className="text-orange-600 text-xl" />
                </div>
                <Link to="/tasks" className="text-orange-600 hover:text-orange-800 flex items-center group">
                  <span className="text-sm font-medium mr-1 group-hover:mr-2 transition-all duration-200">View All</span>
                  <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </Link>
              </div>
              <h2 className="text-xl font-bold mt-4 text-gray-800">Tasks</h2>
              <p className="text-gray-500 text-sm">Manage your to-do items</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <p className="text-gray-500 text-xs mb-1">Due Today</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.tasks.dueTodayCount}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-gray-500 text-xs mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.tasks.completedTasks}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1.5 text-sm">
                  <span className="text-gray-500">Completion Rate</span>
                  <span className="font-medium text-orange-600">
                    {stats.tasks.totalTasks > 0 
                      ? Math.round((stats.tasks.completedTasks / stats.tasks.totalTasks) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-orange-600 to-orange-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ 
                      width: `${stats.tasks.totalTasks > 0 
                        ? (stats.tasks.completedTasks / stats.tasks.totalTasks) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-2">
                <Link 
                  to="/tasks/new" 
                  className="block w-full py-2 px-4 bg-orange-100 hover:bg-orange-600 text-orange-600 hover:text-white rounded-lg transition-colors duration-200 text-center font-medium"
                >
                  + Add New Task
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;