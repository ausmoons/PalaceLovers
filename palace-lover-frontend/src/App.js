import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import MainPage from './components/MainPage';
import Login from './components/Login';
import Register from './components/Register';
import AddPalace from './components/AddPalace';
import EditPalace from './components/EditPalace';
import Header from './components/Header';
import PalaceDetails from './components/PalaceDetails';
import { useAuth } from './context/AuthContext';
import AdminView from './views/AdminView';

const App = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && location.pathname !== '/register' && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Header isAuthenticated={!!user} onLogout={handleLogout} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={user ? <MainPage /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/add-palace" element={user ? <AddPalace /> : <Navigate to="/login" />} />
          <Route path="/edit-palace/:id" element={user ? <EditPalace /> : <Navigate to="/login" />} />
          <Route path="/palace/:id" element={<PalaceDetails />} />
          <Route path="/admin" element={user && user.roles.includes('Admin') ? <AdminView /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
