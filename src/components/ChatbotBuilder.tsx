import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ChatbotBuilder: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Chatbot Builder
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Chatbot builder interface will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatbotBuilder; 