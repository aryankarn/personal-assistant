import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const FitnessTracker = () => {
  const { token } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/fitness', {
          headers: {
            'x-auth-token': token
          }
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.msg || 'Failed to fetch workouts');
        }

        setWorkouts(data);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Fitness Tracker</h1>
          <Link to="/fitness/new" className="btn btn-primary">
            Add New Workout
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger mb-6">
            {error}
          </div>
        )}

        {workouts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-lg text-gray-600 mb-4">No workouts added yet.</p>
            <Link to="/fitness/new" className="btn btn-primary">
              Plan Your First Workout
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <div key={workout._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className={`p-2 text-center text-white ${
                  workout.type === 'Strength' ? 'bg-blue-600' :
                  workout.type === 'Cardio' ? 'bg-orange-600' :
                  workout.type === 'Flexibility' ? 'bg-purple-600' :
                  workout.type === 'HIIT' ? 'bg-red-600' :
                  'bg-gray-600'
                }`}>
                  {workout.type}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{workout.name}</h3>
                  <div className="flex justify-between text-sm mb-3">
                    <span>
                      {new Date(workout.date).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      workout.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      workout.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      workout.status === 'Skipped' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {workout.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <span>Duration: {workout.duration} minutes</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <span>Exercises: {workout.exercises?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <Link to={`/fitness/${workout._id}`} className="text-blue-600 hover:underline">
                      View Details
                    </Link>
                    <Link to={`/fitness/${workout._id}/edit`} className="text-green-600 hover:underline">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessTracker;