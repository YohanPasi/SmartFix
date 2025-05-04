import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';

const Navigation = ({ user }) => {
  return (
    <>
      {user?.role === 'service_provider' && (
        <>
          <ListItem button component={Link} to="/provider-dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/provider/services">
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Services" />
          </ListItem>
        </>
      )}
    </>
  );
};

export default Navigation; 