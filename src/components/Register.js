import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Link, Chip, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const isFormValid = name && email && password && !emailError && !passwordError;
    setSubmitDisabled(!isFormValid);
  }, [name, email, password, emailError, passwordError]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must contain at least 1 number, 1 lowercase letter, 1 uppercase letter, 1 special character, and be at least 6 characters long.'
      );
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleDeleteInterest = (interestToDelete) => {
    setInterests(interests.filter((interest) => interest !== interestToDelete));
  };

  const handleRegister = async () => {
    if (!name || !validateEmail(email) || !validatePassword(password)) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    try {
      await registerUser(name, email, password, isAdmin, interests);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <Box sx={{ width: 400, mx: 'auto', mt: 5, p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center">Register</Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        margin="normal"
        error={touched.name && !name}
        helperText={touched.name && !name && "Name is required"}
        onBlur={() => handleBlur('name')}
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (!validateEmail(e.target.value)) {
            setEmailError('Please enter a valid email address.');
          } else {
            setEmailError('');
          }
        }}
        fullWidth
        required
        margin="normal"
        error={touched.email && !!emailError}
        helperText={touched.email && emailError}
        onBlur={() => handleBlur('email')}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          validatePassword(e.target.value);
        }}
        fullWidth
        required
        margin="normal"
        error={touched.password && !!passwordError}
        helperText={touched.password && passwordError}
        onBlur={() => handleBlur('password')}
      />

      <FormControlLabel
        control={<Checkbox checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />}
        label="Register as Admin"
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', marginY: 2 }}>
        {interests.map((interest, index) => (
          <Chip
            key={index}
            label={interest}
            onDelete={() => handleDeleteInterest(interest)}
            sx={{ margin: 0.5 }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
        <TextField
          label="New Interest"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          size="small"
          sx={{ flex: 1, mr: 1 }}
          margin="dense"
        />
        <Button
          onClick={handleAddInterest}
          variant="outlined"
          size="small"
          sx={{ padding: '6px 16px' }}
        >
          Add
        </Button>
      </Box>

      <Button
        onClick={handleRegister}
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        disabled={submitDisabled}
      >
        Register
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Already have an account?
          <Link href="/login" sx={{ ml: 1 }}>Login</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
