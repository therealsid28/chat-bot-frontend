import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const DocumentManager: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Document Manager
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Document management interface will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DocumentManager; 