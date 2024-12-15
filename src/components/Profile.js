// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Chip, Grid, Paper, Divider } from '@mui/material';
import { getUserProfile, updateUserProfile } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setEmail(profile.email || '');
        setName(profile.name || '');
        setInterests(profile.interests || []);
      } catch (err) {
        setError('Failed to load profile');
      }
    };
    fetchProfile();

    const userRole = localStorage.getItem('role');
    if (userRole === 'admin') {
      history.push('/dashboard');
    }
  }, [history]);

  const handleAddInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest('');
    }
  };

  const handleDeleteInterest = (interestToDelete) => {
    setInterests(interests.filter((interest) => interest !== interestToDelete));
  };

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile({ name, interests });
      setSuccess('Profile updated successfully');
      setError('');
    } catch (err) {
      setError('Failed to update profile');
      setSuccess('');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: 'auto', mt: 6, borderRadius: 3, background: '#f5f5f5' }}>
      <Typography variant="h5" align="center" gutterBottom>Profile Management</Typography>
      {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
      {success && <Typography color="success.main" align="center" sx={{ mt: 2 }}>{success}</Typography>}

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Email</Typography>
          <TextField value={email} fullWidth disabled variant="outlined" margin="dense" />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Name</Typography>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            variant="outlined"
            margin="dense"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom>Interests</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {interests.map((interest, index) => (
            <Chip
              key={index}
              label={interest}
              onDelete={() => handleDeleteInterest(interest)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            label="New Interest"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            size="small"
            fullWidth
            variant="outlined"
          />
          <Button onClick={handleAddInterest} variant="contained" size="small">Add</Button>
        </Box>
      </Box>

      <Button
        onClick={handleUpdateProfile}
        fullWidth
        variant="contained"
        sx={{ mt: 4, py: 1.5, fontSize: '1rem', borderRadius: 2 }}
      >
        Update Profile
      </Button>
    </Paper>
  );
};

export default Profile;
