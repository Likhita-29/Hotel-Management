import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { Logout, AccountCircle } from '@mui/icons-material';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    // Clear all auth related data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast.success("Logged out..."); 
    
    // Navigate to sign-in page
    setTimeout(() => {
      navigate('/sign-in', { replace: true });
    }, 1000);
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#ffffff", height: "60px" }}>
        <Box sx={{
          flexGrow: 0,
          padding: "10px 30px",
          display: 'flex',
          justifyContent: "flex-end",
          alignItems: "center"
        }}>


          <Box>
            <Tooltip title="Account settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </Menu>
          </Box>

          {/* This is needed for toast notifications */}
          <ToastContainer position="top-right" autoClose={800} />
        </Box>
        
      </AppBar>
    </>
  );
};

export default Header;