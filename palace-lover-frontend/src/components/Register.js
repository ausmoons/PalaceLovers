import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post('https://localhost:7251/api/account/register', { email, password, username });
      login(response.data);
      navigate('/');
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="display-4 mb-4 extra-large-text-2">{t('register')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <label htmlFor="email" className="form-label large-text">{t('email')}</label>
          <input 
            type="email" 
            className="form-control large-text" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="username" className="form-label large-text">{t('username')}</label>
          <input 
            type="text" 
            className="form-control large-text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="password" className="form-label large-text">{t('password')}</label>
          <input 
            type="password" 
            className="form-control large-text" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="confirmPassword" className="form-label large-text">{t('confirmpassword')}</label>
          <input 
            type="password" 
            className="form-control large-text" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary large-text">{t('register')}</button>
      </form>
    </div>
  );
};

export default Register;
