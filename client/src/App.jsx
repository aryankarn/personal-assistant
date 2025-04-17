import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Landing from './components/pages/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import DSATracker from './components/dsa/DSATracker';
import FitnessTracker from './components/fitness/FitnessTracker';
import WellbeingTracker from './components/wellbeing/WellbeingTracker';
import TaskManager from './components/tasks/TaskManager';
import PrivateRoute from './components/routing/PrivateRoute';
import NotificationsSetup from './components/notifications/NotificationsSetup';
import Profile from './components/profile/Profile';
import NotFound from './components/pages/NotFound';
import './App.css';

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
    token: localStorage.getItem('token')
  });

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          loading: false,
          user: null,
          token: null
        });
        return;
      }
      
      try {
        const res = await fetch('http://localhost:5000/api/auth/user', {
          headers: {
            'x-auth-token': token
          }
        });
        
        const data = await res.json();
        
        if (res.ok) {
          setAuthState({
            isAuthenticated: true,
            loading: false,
            user: data,
            token
          });
        } else {
          localStorage.removeItem('token');
          setAuthState({
            isAuthenticated: false,
            loading: false,
            user: null,
            token: null
          });
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        localStorage.removeItem('token');
        setAuthState({
          isAuthenticated: false,
          loading: false,
          user: null,
          token: null
        });
      }
    };
    
    checkAuth();
  }, []);
  
  const login = (token, user) => {
    localStorage.setItem('token', token);
    setAuthState({
      isAuthenticated: true,
      loading: false,
      user,
      token
    });
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      loading: false,
      user: null,
      token: null
    });
  };
  
  const updateUser = (updatedUser) => {
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        ...authState, 
        login, 
        logout,
        updateUser
      }}
    >
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={!authState.isAuthenticated ? <Landing /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!authState.isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!authState.isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/dsa/*" element={
              <PrivateRoute>
                <DSATracker />
              </PrivateRoute>
            } />
            
            <Route path="/fitness/*" element={
              <PrivateRoute>
                <FitnessTracker />
              </PrivateRoute>
            } />
            
            <Route path="/wellbeing/*" element={
              <PrivateRoute>
                <WellbeingTracker />
              </PrivateRoute>
            } />
            
            <Route path="/tasks/*" element={
              <PrivateRoute>
                <TaskManager />
              </PrivateRoute>
            } />
            
            <Route path="/notifications" element={
              <PrivateRoute>
                <NotificationsSetup />
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {authState.isAuthenticated && <BottomNav />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;