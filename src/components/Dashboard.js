import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getUserCount, getBlogCount } from '../services/dashboadService';
import io from 'socket.io-client';
import { getAuthToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [userCount, setUserCount] = useState(null);  
  const [blogCount, setBlogCount] = useState(null);  
  const [analyticsData, setAnalyticsData] = useState([]);
  const [blogAnalytics, setBlogAnalytics] = useState([]);

  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    // Handle unauthorized access
    if (!isAuthenticated || !isAdmin) {
      logout();  // Clear session if unauthorized
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate, logout]);

  

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userData = await getUserCount(); 
        setUserCount(userData);

        const blogData = await getBlogCount(); 
        setBlogCount(blogData);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();

    const token = getAuthToken();

    const socketUser = io(process.env.REACT_APP_SOCKET_USER_URL, {
      query: { token }, 
    });

    const socketBlog = io(process.env.REACT_APP_SOCKET_BLOG_URL, {
      query: { token }
    });

    // Listen for user analytics
    socketUser.on('analytics', (data) => {
      if (data.action === 'REGISTER') {
        setUserCount(data.userCount);
      }
      setAnalyticsData((prev) => [
        ...prev,
        { time: new Date().toLocaleTimeString(), action: data.action },
      ]);
    });

    // Listen for blog analytics
    socketBlog.on('blogAnalytics', (data) => {
      if (data.action === 'CREATE') {
        setBlogCount(data.blogCount);
      }
      setBlogAnalytics((prev) => [
        ...prev,
        { action: data.action, blogId: data.blogId, time: new Date().toLocaleTimeString() },
      ]);
    });

    return () => {
      socketUser.off('analytics');
      socketBlog.off('blogAnalytics');
    };
  }, []);

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ minHeight: 150 }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              {userCount !== null ? (
                <Typography variant="h3" color="primary">
                  {userCount}
                </Typography>
              ) : (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                  <Typography variant="body1" sx={{ marginLeft: 2 }}>
                    Loading...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ minHeight: 150 }}>
            <CardContent>
              <Typography variant="h6">Total Blogs</Typography>
              {blogCount !== null ? (
                <Typography variant="h3" color="secondary">
                  {blogCount}
                </Typography>
              ) : (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                  <Typography variant="body1" sx={{ marginLeft: 2 }}>
                    Loading...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ padding: 2, marginTop: 3 }}>
        <Typography variant="h6" gutterBottom>
          Real-Time User Actions
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="action" stroke={COLORS[0]} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      <Divider sx={{ marginY: 4 }} />

      <Paper sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Real-Time Blog Analytics
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={blogAnalytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="action" stroke={COLORS[1]} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
