import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/sign-in', { replace: true });
    }
  }, [token, navigate]);

  if (!token || !user) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return children;
};

export default ProtectedRoute; 