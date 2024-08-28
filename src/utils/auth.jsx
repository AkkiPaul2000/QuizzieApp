import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom'; 
import axios from 'axios';
import { BACKEND_URL } from './constant';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? true : false; 
  });

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('token');
      console.log('token')
      if (token) {
        try {
          // Verify token on the backend 
          const response = await axios.get(`${BACKEND_URL}/api/auth/verify`, {
            headers: { Authorization: token },
          });
          
          // Decode the token and set user data
          const decodedUser = jwtDecode(token);
          setUser(decodedUser);

        } catch (error) {
          if (error.response && error.response.status === 401) {
            // Token is invalid or expired
            logout(); 
            navigate('/login'); 
            toast.error('Your session has expired. Please log in again.'); 
          } else {
            // Handle other errors
            logout()
            console.error('Error verifying token:', error);
            toast.error('An error occurred. Please login again');
          }
        }
      } else {
        // No token found, user is not logged in
        logout(); 
        navigate('/login'); 
      }
    };

    // Check token validity only if not on the /quiz/:id route
    if (!location.pathname.startsWith('/quiz/') && location.pathname !== '/login' && location.pathname !== '/register') { 
      checkTokenValidity(); 
    }
    setIsLoading(false); // Set loading to false after verification (or error)

  }, [location]); 

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    // We don't decode the token here anymore, 
    // as the backend will provide user data in the /verify response
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};