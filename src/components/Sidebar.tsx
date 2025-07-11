import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  Analytics as AnalyticsIcon,
  Description as DescriptionIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isExpanded: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isExpanded,
  // toggleSidebar,
  isMobile,
  mobileOpen,
  setMobileOpen
}) => {
  const menuItems = [
    { id: '', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'chatbot', label: 'Chatbot', icon: <ChatIcon /> },
    { id: 'low-confidence', label: 'Low Confidence', icon: <ChatIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { id: 'documents', label: 'Documents', icon: <DescriptionIcon /> },
    { id: 'chatbot-builder', label: 'Chatbot Builder', icon: <BuildIcon /> },
    { id: 'subscription', label: 'Subscription', icon: <MonetizationOnIcon /> },
    { id: 'accessibility', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ width: isExpanded ? 240 : 72, p: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={() => setActiveTab(item.id)}
              selected={activeTab === item.id}
              sx={{
                minHeight: 48,
                justifyContent: isExpanded ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isExpanded ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {isExpanded && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: 240 },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isExpanded ? 240 : 72,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isExpanded ? 240 : 72,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar; 