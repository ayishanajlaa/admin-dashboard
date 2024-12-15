import React, { useState,useContext } from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { AuthContext } from '../context/AuthContext'; 


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 



  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      login(data.token, data.isAdmin); 
      if (data.isAdmin) {
        navigate('/dashboard');  
      } else {
        navigate('/profile');  
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Box sx={{ width: 400, mx: 'auto', mt: 5, p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center">Login</Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}
      
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      
      <Button onClick={handleLogin} fullWidth variant="contained" sx={{ mt: 2 }}>
        Login
      </Button>
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Don't have an account? 
          <Link href="/register" sx={{ ml: 1 }}>
            Register
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
