import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const DSATracker = () => {
  const { token } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dsa', {
          headers: {
            'x-auth-token': token
          }
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.msg || 'Failed to fetch DSA problems');
        }

        setProblems(data);
      } catch (err) {
        console.error('Error fetching DSA problems:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">DSA Problem Tracker</h1>
          <Link to="/dsa/new" className="btn btn-primary">
            Add New Problem
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger mb-6">
            {error}
          </div>
        )}

        {problems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-lg text-gray-600 mb-4">No DSA problems added yet.</p>
            <Link to="/dsa/new" className="btn btn-primary">
              Add Your First Problem
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Platform</th>
                    <th className="px-4 py-3 text-left">Difficulty</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem) => (
                    <tr key={problem._id} className="border-t border-gray-200">
                      <td className="px-4 py-3">{problem.title}</td>
                      <td className="px-4 py-3">{problem.platform}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3">{problem.category}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          problem.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          problem.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          problem.status === 'Revisit' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {problem.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/dsa/${problem._id}`} className="text-blue-600 hover:underline mr-3">
                          View
                        </Link>
                        <Link to={`/dsa/${problem._id}/edit`} className="text-green-600 hover:underline">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DSATracker;