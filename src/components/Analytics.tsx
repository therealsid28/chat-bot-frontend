import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface AnalyticsProps {
  queries: Array<{ [key: string]: unknown }>;
}

const Analytics: React.FC<AnalyticsProps> = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Analytics dashboard will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Analytics; 