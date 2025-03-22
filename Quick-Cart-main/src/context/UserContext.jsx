import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    try {
      // Your login API call here
      const response = await loginAPI(credentials);
      if (response.success) {
        setIsAuthenticated(true);
        // Store token or user data if needed
        localStorage.setItem('token', response.token);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  // Check token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <UserContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};