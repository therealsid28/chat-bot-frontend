import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface LowConfidenceProps {
  queries: Array<{ [key: string]: unknown }>;
  onResolve?: (index: number) => void;
  onAddTraining?: (query: string, response: string) => void;
}

const LowConfidence: React.FC<LowConfidenceProps> = ({ queries }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Low Confidence Monitor
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Low confidence queries monitoring interface will be implemented here.
        </Typography>
        {queries.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {queries.length} low confidence queries found.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default LowConfidence; 