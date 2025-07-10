import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

interface OnboardingBotProps {
  onStartOnboarding: () => void;
}

const OnboardingBot: React.FC<OnboardingBotProps> = ({ onStartOnboarding }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Let's get you started with a quick tour of your new dashboard.
        </Typography>
        <Button variant="contained" onClick={onStartOnboarding}>
          Start Onboarding
        </Button>
      </Paper>
    </Box>
  );
};

export default OnboardingBot; 