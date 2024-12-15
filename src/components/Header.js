import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

const Header = () => {
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Application
        </Typography>
        {isAuthenticated ? (
          <>
            {isAdmin && (
              <Button
                color="inherit"
                onClick={() => navigate('/dashboard')}
                className={isActive('/dashboard')} // Apply 'active' class
              >
                Dashboard
              </Button>
            )}
            <Button
              color="inherit"
              onClick={() => navigate('/profile')}
              className={isActive('/profile')} // Apply 'active' class
            >
              Profile
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              className={isActive('/login')} // Apply 'active' class
            >
              Login
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/register')}
              className={isActive('/register')} // Apply 'active' class
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
