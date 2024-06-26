import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('Initial token:', token);
    console.log('Initial user data:', userData);

    if (token && userData) {
      axios.get('https://localhost:7251/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setUser(response.data);
          console.log('User data fetched:', response.data);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        });
    }
  }, []);

  const login = (data) => {
    console.log('Login data:', data);
    const { token, user } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser({ email: user.email, roles: user.roles, id: user.id });
    console.log('User data after login:', { email: user.email, roles: user.roles, id: user.id });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
