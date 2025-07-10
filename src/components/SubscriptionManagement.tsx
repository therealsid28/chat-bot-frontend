import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SubscriptionManagement: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Subscription Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Subscription management interface will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SubscriptionManagement; 