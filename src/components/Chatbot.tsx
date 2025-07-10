import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface ChatbotProps {
  onLowConfidence?: (query: any) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onLowConfidence }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Chatbot Tester
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Chatbot testing interface will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Chatbot; 