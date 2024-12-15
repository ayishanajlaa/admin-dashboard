// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Login from './components/Login';  
import Register from './components/Register';  
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'


const AdminRoute = ({ element }) => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('admin');

  if (!isAdmin) {
    navigate('/login'); // Redirect to login if not an admin
    return null;
  }

  return element;
};

const App = () => {
  return (
    <AuthProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <AdminRoute element={<Dashboard />} />
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;
