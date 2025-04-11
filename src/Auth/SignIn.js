import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Box, Button, TextField, CircularProgress } from "@mui/material";

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    // Basic validation
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/auth/login", formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success("Login Successful");
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.32)',
          maxWidth: '400px'
        }}
      >
        <Box sx={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          Sign In
        </Box>

        <TextField
          type="email"
          required
          id="email"
          name="email"
          variant="outlined"
          label="Enter Email"
          onChange={handleChange}
          fullWidth
          disabled={loading}
          margin="normal"
        />

        <TextField
          type="password"
          required
          id="password"
          name="password"
          variant="outlined"
          label="Enter Password"
          onChange={handleChange}
          fullWidth
          disabled={loading}
          margin="normal"
        />

        <Button
          type="submit"
          className="primary_button"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 3, height:"42px"}}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
        </Button>
      </Box>

      <ToastContainer position="top-right" autoClose={2000} />
      
    </Box>
  );
};

export default SignIn;