import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface AnalyticsProps {
  queries: any[];
}

const Analytics: React.FC<AnalyticsProps> = ({ queries }) => {
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