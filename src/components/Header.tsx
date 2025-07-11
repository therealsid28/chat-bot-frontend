import React from 'react';
import { Typography, IconButton, AppBar, Toolbar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

interface HeaderProps {
  activeTab: string;
  isMobile: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, isMobile, setMobileSidebarOpen }) => {
  const pageTitles: { [key: string]: string } = {
    '': 'Dashboard',
    'chatbot': 'Chatbot Tester',
    'low-confidence': 'Low Confidence Monitor',
    'analytics': 'Analytics Dashboard',
    'documents': 'Document Manager',
    'chatbot-builder': 'Chatbot Builder',
    'subscription': 'Subscription Management',
    'accessibility': 'Accessibility Settings'
  };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent' }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMobileSidebarOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {pageTitles[activeTab] || 'Dashboard'}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 