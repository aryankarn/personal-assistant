import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const WellbeingTracker = () => {
  const { token } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/wellbeing', {
          headers: {
            'x-auth-token': token
          }
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.msg || 'Failed to fetch wellbeing entries');
        }

        setEntries(data);
      } catch (err) {
        console.error('Error fetching wellbeing entries:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [token]);

  // Helper function to get emoji for mood
  const getMoodEmoji = (mood) => {
    if (mood >= 9) return '😄';
    if (mood >= 7) return '🙂';
    if (mood >= 5) return '😐';
    if (mood >= 3) return '🙁';
    return '😢';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Wellbeing Tracker</h1>
          <Link to="/wellbeing/new" className="btn btn-primary">
            Add New Entry
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger mb-6">
            {error}
          </div>
        )}

        {entries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-lg text-gray-600 mb-4">No wellbeing entries added yet.</p>
            <Link to="/wellbeing/new" className="btn btn-primary">
              Add Your First Entry
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <div key={entry._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    <span className="text-2xl" title={`Mood: ${entry.mood}/10`}>
                      {getMoodEmoji(entry.mood)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Mood:</span>
                      <span className="ml-2 font-medium">{entry.mood}/10</span>
                    </div>
                    {entry.energy !== undefined && (
                      <div className="text-sm">
                        <span className="text-gray-600">Energy:</span>
                        <span className="ml-2 font-medium">{entry.energy}/10</span>
                      </div>
                    )}
                    {entry.stress !== undefined && (
                      <div className="text-sm">
                        <span className="text-gray-600">Stress:</span>
                        <span className="ml-2 font-medium">{entry.stress}/10</span>
                      </div>
                    )}
                    {entry.sleep && entry.sleep.hours !== undefined && (
                      <div className="text-sm">
                        <span className="text-gray-600">Sleep:</span>
                        <span className="ml-2 font-medium">{entry.sleep.hours}h</span>
                      </div>
                    )}
                  </div>
                  
                  {entry.activities && entry.activities.length > 0 && (
                    <div className="mb-4">
                      <span className="text-gray-600 text-sm">Activities:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {entry.activities.map((activity, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {entry.journal && (
                    <div className="mb-4">
                      <span className="text-gray-600 text-sm">Journal:</span>
                      <p className="mt-1 text-sm text-gray-800 line-clamp-3">{entry.journal}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Link to={`/wellbeing/${entry._id}`} className="text-blue-600 hover:underline">
                      View Details
                    </Link>
                    <Link to={`/wellbeing/${entry._id}/edit`} className="text-green-600 hover:underline">
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

export default WellbeingTracker;