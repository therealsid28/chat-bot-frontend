"use client";

import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, useTheme, Paper, Divider,
  IconButton, Button, Avatar, LinearProgress, Stack, CircularProgress, alpha
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title,
  Tooltip as ChartTooltip, Legend, PointElement, LineElement, ArcElement
} from 'chart.js';
import {
  TrendingUp as TrendingUpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ReportGmailerrorred as ReportIcon,
  CheckCircle as CheckCircleIcon,
  SmartToy as SmartToyIcon,
  WarningAmber as WarningIcon,
  AddCircle as AddCircleIcon,
  Tune as TuneIcon,
  Chat as ChatIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { gsap } from 'gsap';

// ✅ CUSTOM COMPONENTS — Make sure these exist in the same directory or update the path
import Chatbot from './Chatbot';
import LowConfidence from './LowConfidence';
import Analytics from './Analytics';
import AccessibilityPanel from './AccessibilityPanel';
import DocumentManager from './DocumentManager';
import ChatbotBuilder from './ChatbotBuilder';
import SubscriptionManagement from './SubscriptionManagement';
// import OnboardingBot from './OnboardingBot';
// import { useThemeMode } from './Accessibility';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, ChartTooltip,
  Legend, PointElement, LineElement, ArcElement
);

const MOBILE_BREAKPOINT = 768;
const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function DashboardStats() {
  const theme = useTheme();
  // const { mode } = useThemeMode();

  // const isDarkMode = mode === 'dark';
  // const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

  const [lowConfidenceQueries, setLowConfidenceQueries] = useState<Array<{ [key: string]: unknown }>>([]);
  const [activeTab, setActiveTab] = useState('');
  const [isSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  // const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // const [showOnboardingBot, setShowOnboardingBot] = useState(true);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  const bgColor = '#000000'; // Always use dark theme
  const accentColor = '#7C3AED';

  const sidebarWidth = isMobile
    ? 0
    : isSidebarExpanded
      ? EXPANDED_WIDTH
      : COLLAPSED_WIDTH;

  const welcomeRef = useRef<HTMLDivElement>(null);
  const metricsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const graphRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const robotIconRef = useRef<HTMLDivElement>(null);

  const dailyStats = {
    confidenceAvg: 82,
    totalQueries: 247,
    lowConfidenceCount: 18,
    resolvedQueries: 192,
    apiResponseTime: 0.8,
  };

  const commonQueries = [
    "How do I reset my student password?",
    "When is the registration deadline?",
    "Where can I find my class schedule?",
    "How do I apply for financial aid?",
    "What are the library opening hours?"
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      // if (window.innerWidth >= MOBILE_BREAKPOINT) setMobileSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (activeTab === '') {
      if (welcomeRef.current) {
        timeline.fromTo(welcomeRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 });
      }

      if (metricsRefs.current.length) {
        timeline.fromTo(metricsRefs.current, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.1
        }, "-=0.4");
      }

      if (graphRef.current) {
        timeline.fromTo(graphRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.2");
      }

      if (actionsRef.current) {
        timeline.fromTo(actionsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4");
      }

      if (feedbackRef.current) {
        timeline.fromTo(feedbackRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4");
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (robotIconRef.current) {
      gsap.to(robotIconRef.current, {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: "linear",
        transformOrigin: "50% 50%",
      });
    }
    return () => {
      if (robotIconRef.current) {
        gsap.killTweensOf(robotIconRef.current);
        gsap.set(robotIconRef.current, { rotation: 0 });
      }
    };
  }, []);

  // useEffect(() => {
  //   const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
  //   setShowOnboardingBot(!onboardingComplete);
  //   if (process.env.NODE_ENV === 'development') {
  //     (window as { toggleOnboarding?: () => void }).toggleOnboarding = () => {
  //       setShowOnboardingBot((prev: boolean) => !prev);
  //     };
  //   }
  // }, []);

  const confidenceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Confidence Score (%)',
      data: [80, 78, 82, 75, 85, 90, 88],
      fill: true,
      backgroundColor: 'rgba(124, 58, 237, 0.2)',
      borderColor: accentColor,
      tension: 0.4,
      pointBackgroundColor: accentColor,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: accentColor,
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle' as const,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          callback: (value: string | number) => value + '%',
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const,
    },
  };

  const handleLowConfidence = (query: { [key: string]: unknown }) => setLowConfidenceQueries(prev => [...prev, query]);
  const handleResolveQuery = (index: number) => setLowConfidenceQueries(prev => prev.filter((_, i) => i !== index));
  const handleAddTrainingData = (query: string) => {
    // setIsLoading(true);
    setTimeout(() => {
      // setIsLoading(false);
      handleResolveQuery(lowConfidenceQueries.findIndex(q => q.question === query));
    }, 1000);
  };

  const handleTestChatbot = () => setActiveTab('chatbot');
  const handleViewLowConfidence = () => setActiveTab('low-confidence');
  const handleAddTraining = () => setActiveTab('documents');
  const handleAdjustThreshold = () => alert("Confidence threshold adjustment UI would appear here.");
  // const handleStartOnboarding = () => setShowOnboardingBot(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isExpanded={isSidebarExpanded}
        toggleSidebar={() => setIsSidebarExpanded((v) => !v)}
        isMobile={isMobile}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      /> */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          bgcolor: bgColor,
          background: 'linear-gradient(to bottom, #1A1B23, #24252E)',
          overflowX: 'hidden',
        }}
      >
        {/* <Header 
          activeTab={activeTab} 
          isMobile={isMobile} 
          setMobileSidebarOpen={setMobileSidebarOpen} 
        /> */}
        
        <Box 
          sx={{ 
            p: 3, 
            maxWidth: 1400, 
            width: '100%',
            mx: 'auto',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {activeTab === '' && (
            <Box>
              <Paper
                ref={welcomeRef}
                elevation={3}
                sx={{
                  mb: 4,
                  p: { xs: 3, md: 4 },
                  background: `linear-gradient(135deg, ${accentColor} 0%, #5B21B6 100%)`,
                  borderRadius: 3,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ zIndex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Welcome back, Admin!
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2, opacity: 0.9, fontWeight: 400 }}>
                    Monitor your assistant&apos;s performance and fine-tune with confidence.
                  </Typography>
                  <Box 
                    sx={{
                      display: 'inline-block',
                      px: 2, 
                      py: 0.5, 
                      bgcolor: 'rgba(255,255,255,0.15)',
                      borderRadius: 4,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography variant="body2">
                      Model: Gemini API • Confidence Threshold: 70%
                    </Typography>
                  </Box>
                </Box>
                <Box 
                  sx={{ 
                    display: { xs: 'none', md: 'flex' },
                    height: 140,
                    width: 140,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 70, opacity: 0.9 }} />
                </Box>
              </Paper>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
                <Paper
                  ref={(el: HTMLDivElement | null) => { metricsRefs.current[0] = el; }}
                  elevation={2}
                  sx={{
                    p: 2,
                    height: '100%',
                    borderRadius: 2,
                    bgcolor: '#000000',
                    color: 'white',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.dark, mr: 1.5 }}>
                      <TrendingUpIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="medium">
                      Confidence Avg
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: theme.palette.primary.main }}>
                    {dailyStats.confidenceAvg}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={dailyStats.confidenceAvg} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      '.MuiLinearProgress-bar': {
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 4,
                      }
                    }} 
                  />
                </Paper>
                
                <Paper
                  ref={(el: HTMLDivElement | null) => { metricsRefs.current[1] = el; }}
                  elevation={2}
                  sx={{
                    p: 2,
                    height: '100%',
                    borderRadius: 2,
                    bgcolor: '#000000',
                    color: 'white',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.secondary.dark, mr: 1.5 }}>
                      <QuestionAnswerIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="medium">
                      Total Queries
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: theme.palette.secondary.main }}>
                      {dailyStats.totalQueries}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Today
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    +12.5% from yesterday
                  </Typography>
                </Paper>
                
                <Paper
                  ref={(el: HTMLDivElement | null) => { metricsRefs.current[2] = el; }}
                  elevation={2}
                  sx={{
                    p: 2,
                    height: '100%',
                    borderRadius: 2,
                    bgcolor: '#000000',
                    color: 'white',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.error.light, mr: 1.5 }}>
                      <ReportIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="medium">
                      Low Confidence
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: theme.palette.error.main }}>
                      {dailyStats.lowConfidenceCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Unresolved
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#ef5350', fontWeight: 500 }}>
                    Needs attention
                  </Typography>
                </Paper>
                
                <Paper
                  ref={(el: HTMLDivElement | null) => { metricsRefs.current[3] = el; }}
                  elevation={2}
                  sx={{
                    p: 2,
                    height: '100%',
                    borderRadius: 2,
                    bgcolor: '#000000',
                    color: 'white',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.success.light, mr: 1.5 }}>
                      <CheckCircleIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="medium">
                      Resolved Queries
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={(dailyStats.resolvedQueries / dailyStats.totalQueries) * 100}
                        size={60}
                        thickness={6}
                        sx={{ color: theme.palette.success.main }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="body2" component="div" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {Math.round((dailyStats.resolvedQueries / dailyStats.totalQueries) * 100)}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.success.main }}>
                      {dailyStats.resolvedQueries}
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3, mb: 4 }}>
                <Paper
                  ref={graphRef}
                  elevation={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    minHeight: 400,
                    borderRadius: 2,
                    bgcolor: '#000000',
                    color: 'white',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 15px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Confidence Trend (Last 7 Days)
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    View daily confidence scores to track AI performance
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line data={confidenceData} options={chartOptions} />
                  </Box>
                </Paper>
                
                <Stack spacing={3}>
                  <Paper
                    ref={feedbackRef}
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: '#000000',
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 15px rgba(0,0,0,0.3)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.info.light, mr: 2 }}>
                        <ChatIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        Top Queries This Week
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                      {commonQueries.map((query, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            py: 1.5, 
                            borderBottom: index < commonQueries.length - 1 ? '1px solid' : 'none', 
                            borderColor: 'rgba(255,255,255,0.1)'
                          }}
                        >
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box component="span" sx={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 24,
                              height: 24,
                              mr: 1,
                              bgcolor: theme.palette.primary.main,
                              color: 'white',
                              borderRadius: '50%',
                              fontSize: 14,
                            }}>
                              {index + 1}
                            </Box>
                            {query}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                  
                  <Paper
                    ref={actionsRef}
                    elevation={2}
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      bgcolor: '#000000',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Quick Actions
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2, mt: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SmartToyIcon />}
                        onClick={handleTestChatbot}
                        fullWidth
                        sx={{ 
                          py: 1.5,
                          textTransform: 'none',
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        Test Chatbot
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<WarningIcon />}
                        onClick={handleViewLowConfidence}
                        fullWidth
                        sx={{ 
                          py: 1.5,
                          textTransform: 'none',
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        View Low Confidence
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddCircleIcon />}
                        onClick={handleAddTraining}
                        fullWidth
                        sx={{ 
                          py: 1.5,
                          textTransform: 'none',
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        Add Training Data
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<TuneIcon />}
                        onClick={handleAdjustThreshold}
                        fullWidth
                        sx={{ 
                          py: 1.5,
                          textTransform: 'none',
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        Adjust Threshold
                      </Button>
                    </Box>
                  </Paper>
                </Stack>
              </Box>
            </Box>
          )}
          {activeTab === 'chatbot' && (
            <section>
              <Chatbot onLowConfidence={handleLowConfidence} />
            </section>
          )}
          {activeTab === 'low-confidence' && (
            <section>
              <LowConfidence 
                queries={lowConfidenceQueries} 
                onResolve={handleResolveQuery}
                onAddTraining={handleAddTrainingData}
              />
            </section>
          )}
          {activeTab === 'analytics' && (
            <section>
              <Analytics queries={lowConfidenceQueries} />
            </section>
          )}
          {activeTab === 'documents' && (
            <section>
              <DocumentManager />
            </section>
          )}
          {activeTab === 'chatbot-builder' && (
            <section>
              <ChatbotBuilder />
            </section>
          )}
          {activeTab === 'accessibility' && (
            <section>
              <AccessibilityPanel />
            </section>
          )}
          {activeTab === 'subscription' && (
            <>
              {console.log('Rendering subscription tab')}
              <SubscriptionManagement />
            </>
          )}
        </Box>
      </Box>
      
      {showWelcomeBanner && (
        <Box
          sx={{
            position: 'absolute',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 80px)',
            maxWidth: 800,
            zIndex: 1000,
            p: 2,
            borderRadius: 2,
            bgcolor: 'success.main',
            color: 'white',
            boxShadow: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            🎉 Your chatbot is live! Welcome to the Admin Dashboard.
          </Typography>
          <IconButton size="small" color="inherit" onClick={() => setShowWelcomeBanner(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      
      {/* {showOnboardingBot && <OnboardingBot onStartOnboarding={handleStartOnboarding} />} */}
    </Box>
  );
}
