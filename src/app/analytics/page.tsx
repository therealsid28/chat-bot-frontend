'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, Container, Stack, useTheme, alpha,
  Chip, Avatar, Switch, FormControlLabel, IconButton, Tooltip as MUITooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, CardContent, Tabs, Tab
} from '@mui/material';
import {
  TrendingUp, AccessTime, ThumbUp, Warning, 
  ArrowUpward, ArrowDownward, Info, Timeline,
  PieChart as PieChartIcon, Autorenew, BarChart
} from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useThemeMode } from '../../components/Accessibility'; // Make sure this exists and works in Next.js
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Animated Bar Chart Component
type AnimatedBarChartProps = {
  data: number[];
  labels: string[];
  height?: number;
  barColor?: string;
};
const AnimatedBarChart = ({ data, labels, height = 200, barColor = '#3f51b5' }: AnimatedBarChartProps) => {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(...data);

  return (
    <Box sx={{ height, display: 'flex', alignItems: 'flex-end', justifyContent: 
    'space-between', mt: 2 }}>
      {data.map((value: number, index: number) => {
        const percentage = (value / maxValue) * 100;
        return (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              width: `${100/data.length - 2}%`, 
            }}
          >
            <Box 
              sx={{ 
                height: animated ? `${percentage}%` : '0%',
                width: '100%',
                maxWidth: 40,
                backgroundColor: barColor,
                borderRadius: '4px 4px 0 0',
                transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:hover': {
                  opacity: 0.8,
                  cursor: 'pointer',
                },
                '&:hover::after': {
                  content: `"${value}"`,
                  position: 'absolute',
                  top: -30,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: isDark ? theme.palette.grey[800] : theme.palette.grey[100],
                  padding: '2px 6px',
                  borderRadius: 1,
                  fontSize: '12px',
                  zIndex: 10
                }
              }}
            />
            <Typography variant="caption" sx={{ mt: 1, color: 'white' }}>
              {labels[index]}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

// Animated Pie Chart Component
type AnimatedPieChartProps = {
  data: number[];
  colors: string[];
  labels: string[];
};
const AnimatedPieChart = ({ data, colors, labels }: AnimatedPieChartProps) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const total = data.reduce((acc: number, val: number) => acc + val, 0);
  let cumulativePercentage = 0;

  return (
    <Box sx={{ textAlign: 'center', position: 'relative' }}>
      <Box 
        sx={{ 
          width: 200, 
          height: 200, 
          borderRadius: '50%', 
          position: 'relative', 
          overflow: 'hidden',
          margin: '0 auto',
          transform: animated ? 'scale(1)' : 'scale(0.5)',
          opacity: animated ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {data.map((value: number, index: number) => {
          const percentage = (value / total) * 100;
          const previousCumulative = cumulativePercentage;
          cumulativePercentage += percentage;
          return (
            <Box 
              key={index} 
              sx={{ 
                position: 'absolute',
                top: 0, 
                left: 0,
                width: '100%', 
                height: '100%',
                background: `conic-gradient(
                  transparent ${previousCumulative}%, 
                  ${colors[index]} ${previousCumulative}%, 
                  ${colors[index]} ${cumulativePercentage}%, 
                  transparent ${cumulativePercentage}%
                )`,
              }}
            />
          );
        })}
        {/* Donut hole */}
        <Box sx={{ 
          position: 'absolute', 
          top: '25%', 
          left: '25%', 
          width: '50%', 
          height: '50%', 
          borderRadius: '50%', 
          backgroundColor: 'background.paper' 
        }} />
      </Box>
      {/* Legend */}
      <Stack 
        direction="row" 
        spacing={2} 
        justifyContent="center" 
        sx={{ mt: 3 }}
      >
        {data.map((value: number, index: number) => (
          <Stack key={index} direction="row" alignItems="center" spacing={0.5}>
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '2px', 
                backgroundColor: colors[index] 
              }} 
            />
            <Typography variant="caption">{labels[index]}: {Math.round((value / total) * 100)}%</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

const Analytics = () => {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const [timeRange, setTimeRange] = useState('week');
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Fix event handler types
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const newTimeRange = e.target.checked ? 'year' : 'week';
    setTimeout(() => {
      setTimeRange(newTimeRange);
      setIsLoading(false);
    }, 800);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Demo data
  const generateData = () => {
    const totalQueries = 1248;
    const avgResponseTime = 0.75;
    const confidenceRate = 87;
    const lowConfidenceCount = 48;
    const barLabels = timeRange === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const queryData = timeRange === 'week'
      ? [45, 62, 58, 71, 82, 42, 55]
      : [120, 145, 132, 165, 190, 210, 185, 220, 240, 195, 205, 230];
    const confidenceData = timeRange === 'week'
      ? [82, 88, 76, 92, 86, 78, 90]
      : [75, 79, 82, 80, 85, 88, 86, 90, 92, 89, 84, 87];
    const confidenceDistribution = [68, 21, 11];
    const recentInteractions = [
      { id: 1, query: "How do I reset my password?", time: "2 mins ago", confidence: 94, status: "Complete" },
      { id: 2, query: "When is the next faculty meeting?", time: "10 mins ago", confidence: 76, status: "Complete" },
      { id: 3, query: "Can I change my course schedule?", time: "25 mins ago", confidence: 45, status: "Low Confidence" },
      { id: 4, query: "What are the library hours this weekend?", time: "32 mins ago", confidence: 88, status: "Complete" },
      { id: 5, query: "How do I submit assignments online?", time: "1 hour ago", confidence: 92, status: "Complete" }
    ];
    return {
      totalQueries,
      avgResponseTime,
      confidenceRate,
      lowConfidenceCount,
      barLabels,
      queryData,
      confidenceData,
      confidenceDistribution,
      recentInteractions
    };
  };

  const data = generateData();

  return (
    <SidebarProvider>
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#212121' }}>
      <AppSidebar />
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'auto', p: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl" sx={{ p: 0 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4,
            opacity: animateIn ? 1 : 0,
            transform: animateIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
          }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  backgroundImage: isDark 
                    ? 'linear-gradient(45deg, #6b73ff 30%, #50c9c3 90%)'
                    : 'linear-gradient(45deg, #2196F3 30%, #4a148c 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Analytics Dashboard
              </Typography>
              <Typography variant="body1" color="white">
                Performance metrics and insights for your chatbot
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControlLabel
                control={
                  <Switch 
                    checked={timeRange === 'year'} 
                    onChange={handleTimeRangeChange} 
                    color="primary" 
                    disabled={isLoading}
                  />
                }
                label={
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    {isLoading && (
                      <Autorenew 
                        fontSize="small" 
                        sx={{ mr: 0.5, animation: `${spin} 1s linear infinite` }} 
                      />
                    )}
                    {timeRange === 'year' ? "Yearly View" : "Weekly View"}
                  </Typography>
                }
              />
            </Stack>
          </Box>
          {/* Stat Cards */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            '@media (min-width: 600px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
            '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
            gap: 24,
            mb: 4
          }}>
            {[
              {
                title: 'Total Queries',
                value: data.totalQueries,
                icon: <TrendingUp fontSize="small" />,
                change: '+18.2%',
                color: theme.palette.primary.main,
                changeText: 'vs last week'
              },
              {
                title: 'Avg. Response Time',
                value: `${data.avgResponseTime}s`,
                icon: <AccessTime fontSize="small" />,
                change: '-7.4%',
                color: '#FF9671',
                changeText: 'faster than before',
                isDown: true
              },
              {
                title: 'Confidence Rate',
                value: `${data.confidenceRate}%`,
                icon: <ThumbUp fontSize="small" />,
                change: '+5.1%',
                color: '#50C9C3',
                changeText: 'vs last month'
              },
              {
                title: 'Low Confidence',
                value: data.lowConfidenceCount,
                icon: <Warning fontSize="small" />,
                change: '-12.3%',
                color: '#F857A6',
                changeText: 'improvement',
                isDown: true
              }
            ].map((card, index) => (
              <Box key={index}>
                <Paper 
                  elevation={isDark ? 2 : 1} 
                  sx={{ 
                    borderRadius: 2, 
                    overflow: 'hidden', 
                    height: '100%',
                    bgcolor: '#000000',
                    color: 'white',
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease`,
                    transitionDelay: `${index * 0.1}s`,
                    '&:hover': {
                      boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}`,
                      transform: 'translateY(-5px)'
                    },
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      backgroundColor: card.color
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography color="text.secondary" variant="subtitle2" fontWeight={500} sx={{ color: 'white' }}>
                        {card.title}
                      </Typography>
                      <Avatar sx={{ bgcolor: alpha(card.color, 0.2), color: card.color, width: 36, height: 36 }}>
                        {card.icon}
                      </Avatar>
                    </Box>
                    <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 1, color: 'white' }}>
                      {card.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {card.isDown ? (
                        <ArrowDownward sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                      ) : (
                        <ArrowUpward sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                      )}
                      <Typography variant="body2" color="success.main" fontWeight="medium">
                        {card.change}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {card.changeText}
                      </Typography>
                    </Box>
                  </CardContent>
                </Paper>
              </Box>
            ))}
          </Box>
          {/* Chart tabs */}
          <Paper 
            elevation={isDark ? 2 : 1} 
            sx={{ 
              mb: 3, 
              borderRadius: 2, 
              overflow: 'hidden',
              bgcolor: '#000000',
              color: 'white',
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
              transitionDelay: '0.2s',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="chart tabs"
                variant="fullWidth"
                textColor="inherit"
                indicatorColor="secondary"
                sx={{
                  color: 'white',
                  '& .MuiTab-root': { color: 'white' },
                  '& .Mui-selected': { color: 'white' },
                  '& .MuiTabs-indicator': { backgroundColor: theme.palette.secondary.main },
                }}
              >
                <Tab icon={<BarChart />} label="Query Volume" />
                <Tab icon={<Timeline />} label="Confidence Trend" />
                <Tab icon={<PieChartIcon />} label="Distribution" />
              </Tabs>
            </Box>
            <Box sx={{ p: 3, minHeight: 300 }}>
              {tabValue === 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                    Query Volume ({timeRange === 'year' ? 'Yearly' : 'Weekly'})
                  </Typography>
                  <AnimatedBarChart 
                    data={data.queryData} 
                    labels={data.barLabels}
                    barColor={theme.palette.primary.main}
                  />
                </>
              )}
              {tabValue === 1 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                    Confidence Score Trend ({timeRange === 'year' ? 'Yearly' : 'Weekly'})
                  </Typography>
                  <AnimatedBarChart 
                    data={data.confidenceData} 
                    labels={data.barLabels}
                    barColor="#50C9C3"
                  />
                </>
              )}
              {tabValue === 2 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                    Confidence Distribution
                  </Typography>
                  <AnimatedPieChart 
                    data={data.confidenceDistribution}
                    labels={['High (>80%)', 'Medium (60-80%)', 'Low (<60%)']}
                    colors={['#66bb6a', '#ffb74d', '#ef5350']}
                  />
                </>
              )}
            </Box>
          </Paper>
          {/* Recent Interactions Table */}
          <Paper 
            elevation={isDark ? 2 : 1} 
            sx={{ 
              mb: 3, 
              borderRadius: 2, 
              overflow: 'hidden',
              bgcolor: '#000000',
              color: 'white',
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
              transitionDelay: '0.3s',
            }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                Recent Interactions
              </Typography>
              <MUITooltip title="View all interactions">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </MUITooltip>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User Query</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Confidence</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.recentInteractions.map((row, index) => (
                    <TableRow 
                      key={row.id}
                      sx={{ 
                        opacity: animateIn ? 1 : 0,
                        transform: animateIn ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                        transitionDelay: `${0.4 + index * 0.1}s`,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      <TableCell sx={{ color: 'white' }}>{row.query}</TableCell>
                      <TableCell sx={{ color: 'white' }}>{row.time}</TableCell>
                      <TableCell>
                        <LinearProgress 
                          variant="determinate" 
                          value={row.confidence} 
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            width: 80,
                            mb: 0.5,
                            bgcolor: alpha(theme.palette.grey[500], 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: row.confidence >= 80 
                                ? theme.palette.success.main 
                                : row.confidence >= 60 
                                  ? theme.palette.warning.main 
                                  : theme.palette.error.main
                            }
                          }}
                        />
                        <Typography variant="caption" fontWeight="bold" color="white">
                          {row.confidence}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status}
                          size="small"
                          color={row.status === "Low Confidence" ? "error" : "primary"}
                          variant="filled"
                          sx={{
                            bgcolor: row.status === "Low Confidence" ? theme.palette.error.main : theme.palette.primary.main,
                            color: 'white',
                            fontWeight: 500,
                            letterSpacing: 0.5,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </Box>
    </SidebarProvider>
  );
};

export default Analytics;
