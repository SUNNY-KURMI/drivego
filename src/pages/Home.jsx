import React, { useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Rating
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import SecurityIcon from '@mui/icons-material/Security';
import SavingsIcon from '@mui/icons-material/Savings';
import StarIcon from '@mui/icons-material/Star';
import heroimage from '../assets/images/homeimg.jpg';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const heroRef = useRef(null);

  useEffect(() => {
    // Create an animation for the hero background
    if (heroRef.current) {
      const hero = heroRef.current;
      const updateGradient = () => {
        const angle = (Date.now() / 50) % 360;
        hero.style.backgroundImage = `linear-gradient(${angle}deg, rgba(0,0,0,0.9) 0%, rgba(33,33,33,0.95) 50%, rgba(66,66,66,0.9) 100%)`;
        requestAnimationFrame(updateGradient);
      };
      
      const animation = requestAnimationFrame(updateGradient);
      return () => cancelAnimationFrame(animation);
    }
  }, []);

  // Animation variants for staggered text animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          background: 'black',
          color: '#fff',
          py: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(55,65,81,0.3) 0%, transparent 70%)',
            zIndex: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            zIndex: 1,
            opacity: 0.5
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h1" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '2.5rem', md: '3.8rem' },
                      fontWeight: 800,
                      lineHeight: 1.1,
                      background: 'linear-gradient(90deg, #ffffff 0%, #d0d0d0 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 2px 10px rgba(255,255,255,0.1)',
                      mb: 2
                    }}
                  >
                    Professional Drivers
                    <br />
                    At Your Fingertips
                  </Typography>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4, 
                      maxWidth: 500,
                      fontWeight: 400,
                      color: 'grey.300',
                      lineHeight: 1.6
                    }}
                  >
                    Book experienced drivers for your car anywhere in India with our simple, reliable service.
                  </Typography>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2}
                  >
                    <Button 
                      variant="contained" 
                      size="large" 
                      onClick={() => navigate('/drivers')}
                      sx={{
                        py: 1.8,
                        px: 4,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: '50px',
                        background: 'linear-gradient(90deg, #f5f7fa 0%, #c3cfe2 100%)',
                        color: '#000',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                          background: 'linear-gradient(90deg, #c3cfe2 0%, #f5f7fa 100%)',
                        }
                      }}
                    >
                      Book a Driver
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large"
                      color="inherit"
                      onClick={() => navigate('/driver-registration')}
                      sx={{
                        py: 1.8,
                        px: 4,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: '50px',
                        borderColor: 'rgba(255,255,255,0.5)',
                        borderWidth: '2px',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-3px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Become a Driver
                    </Button>
                  </Stack>
                </motion.div>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <Box
                  component="img"
                  src={heroimage}
                  alt="Professional Driver"
                  sx={{
                    width: '100%',
                    maxWidth: 550,
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    ml: 'auto',
                    display: 'block',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    transition: 'all 0.5s ease',
                    border: '4px solid rgba(255,255,255,0.1)',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(0deg)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                    }
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Key Features */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fb 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 70%)',
          top: '10%',
          left: '5%',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 70%)',
          bottom: '5%',
          right: '5%',
        }
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Typography 
              variant="h3" 
              textAlign="center" 
              gutterBottom
              sx={{ 
                mb: 2,
                fontWeight: 700,
                background: 'linear-gradient(90deg, #000000 0%, #434343 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Why Choose DriveGo?
            </Typography>
            <Typography 
              variant="h6" 
              textAlign="center" 
              color="text.secondary"
              sx={{ 
                mb: 8,
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 400
              }}
            >
              We provide a seamless experience with professional drivers who are vetted, trained, and ready to serve.
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card 
                  elevation={0} 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      '& .icon-wrapper': {
                        transform: 'scale(1.1) rotate(5deg)'
                      }
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      mb: 3, 
                      alignItems: 'center',
                      position: 'relative'
                    }}>
                      <Box 
                        className="icon-wrapper"
                        sx={{ 
                          background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                          mr: 3,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <AccessTimeFilledIcon 
                          sx={{ 
                            fontSize: 30, 
                            color: 'white',
                          }} 
                        />
                      </Box>
                      <Typography variant="h5" component="div" fontWeight={700}>
                        Time-Saving
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      Book a driver in minutes and have them arrive at your doorstep right when you need them. No waiting, no hassle.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card 
                  elevation={0} 
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      '& .icon-wrapper': {
                        transform: 'scale(1.1) rotate(5deg)'
                      }
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      mb: 3, 
                      alignItems: 'center',
                      position: 'relative'  
                    }}>
                      <Box 
                        className="icon-wrapper"
                        sx={{ 
                          background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                          mr: 3,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <SecurityIcon 
                          sx={{ 
                            fontSize: 30, 
                            color: 'white',
                          }} 
                        />
                      </Box>
                      <Typography variant="h5" component="div" fontWeight={700}>
                        Safety First
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      All our drivers undergo rigorous background checks and training to ensure your safety and peace of mind.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card 
                  elevation={0} 
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      '& .icon-wrapper': {
                        transform: 'scale(1.1) rotate(5deg)'
                      }
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      mb: 3, 
                      alignItems: 'center',
                      position: 'relative'  
                    }}>
                      <Box 
                        className="icon-wrapper"
                        sx={{ 
                          background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                          mr: 3,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <SavingsIcon 
                          sx={{ 
                            fontSize: 30, 
                            color: 'white',
                          }} 
                        />
                      </Box>
                      <Typography variant="h5" component="div" fontWeight={700}>
                        Cost-Effective
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      Pay only for the time you need. No hidden charges, no long-term commitments. Just transparent pricing.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\' viewBox=\'0 0 800 800\'%3E%3Cg fill=\'none\' stroke=\'%23333333\' stroke-width=\'1\'%3E%3Cpath d=\'M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63\'/%3E%3Cpath d=\'M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764\'/%3E%3Cpath d=\'M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880\'/%3E%3Cpath d=\'M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382\'/%3E%3Cpath d=\'M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269\'/%3E%3C/g%3E%3Cg fill=\'%23444444\'%3E%3Ccircle cx=\'769\' cy=\'229\' r=\'5\'/%3E%3Ccircle cx=\'539\' cy=\'269\' r=\'5\'/%3E%3Ccircle cx=\'603\' cy=\'493\' r=\'5\'/%3E%3Ccircle cx=\'731\' cy=\'737\' r=\'5\'/%3E%3Ccircle cx=\'520\' cy=\'660\' r=\'5\'/%3E%3Ccircle cx=\'309\' cy=\'538\' r=\'5\'/%3E%3Ccircle cx=\'295\' cy=\'764\' r=\'5\'/%3E%3Ccircle cx=\'40\' cy=\'599\' r=\'5\'/%3E%3Ccircle cx=\'102\' cy=\'382\' r=\'5\'/%3E%3Ccircle cx=\'127\' cy=\'80\' r=\'5\'/%3E%3Ccircle cx=\'370\' cy=\'105\' r=\'5\'/%3E%3Ccircle cx=\'578\' cy=\'42\' r=\'5\'/%3E%3Ccircle cx=\'237\' cy=\'261\' r=\'5\'/%3E%3Ccircle cx=\'390\' cy=\'382\' r=\'5\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundPosition: 'center',
          opacity: 0.1
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Typography 
              variant="h3" 
              textAlign="center" 
              gutterBottom
              sx={{ 
                mb: 2,
                fontWeight: 700,
                background: 'linear-gradient(90deg, #ffffff 0%, #d0d0d0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              How It Works
            </Typography>
            <Typography 
              variant="h6" 
              textAlign="center" 
              color="grey.400"
              sx={{ 
                mb: 8,
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 400
              }}
            >
              Booking a driver with DriveGo is simple and straightforward.
            </Typography>
          </motion.div>

          <Grid container spacing={isMobile ? 6 : 10} justifyContent="center">
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Box sx={{ 
                  textAlign: 'center', 
                  position: 'relative',
                  zIndex: 2
                }}>
                  <Box 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      position: 'relative',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite',
                      }
                    }}
                  >
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #ffffff 0%, #d0d0d0 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      1
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    Choose a Driver
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'grey.400',
                      maxWidth: 300,
                      mx: 'auto',
                      lineHeight: 1.8
                    }}
                  >
                    Browse through our verified drivers and select one that meets your needs based on experience and ratings.
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Box sx={{ 
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <Box 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      position: 'relative',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite 0.5s',
                      }
                    }}
                  >
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #ffffff 0%, #d0d0d0 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      2
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    Book & Pay
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'grey.400',
                      maxWidth: 300,
                      mx: 'auto',
                      lineHeight: 1.8
                    }}
                  >
                    Set your pickup time, location details, and complete the booking with our secure payment process.
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Box sx={{ 
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <Box 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      position: 'relative',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite 1s',
                      }
                    }}
                  >
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(90deg, #ffffff 0%, #d0d0d0 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      3
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    Enjoy Your Ride
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'grey.400',
                      maxWidth: 300,
                      mx: 'auto',
                      lineHeight: 1.8
                    }}
                  >
                    Your driver arrives at the scheduled time. Sit back, relax, and enjoy the professional service.
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Box sx={{ 
              mt: 10, 
              textAlign: 'center'
            }}>
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => navigate('/drivers')}
                sx={{
                  py: 1.8,
                  px: 6,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  background: 'linear-gradient(90deg, #f5f7fa 0%, #c3cfe2 100%)',
                  color: '#000',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                    background: 'linear-gradient(90deg, #c3cfe2 0%, #f5f7fa 100%)',
                  }
                }}
              >
                Book Your Driver Now
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fb 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at bottom right, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Typography 
              variant="h3" 
              textAlign="center" 
              gutterBottom
              sx={{ 
                mb: 2,
                fontWeight: 700,
                background: 'linear-gradient(90deg, #000000 0%, #434343 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              What Our Customers Say
            </Typography>
            <Typography 
              variant="h6" 
              textAlign="center" 
              color="text.secondary"
              sx={{ 
                mb: 8,
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 400
              }}
            >
              Don't just take our word for it - hear what our satisfied customers have to say about DriveGo.
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {[
              { 
                name: "Priya Sharma", 
                role: "Business Executive", 
                comment: "DriveGo has transformed my daily commute. The drivers are professional, punctual, and I can work during my travel time. Highly recommended!", 
                rating: 5 
              },
              { 
                name: "Aditya Patel", 
                role: "Wedding Planner", 
                comment: "We hired multiple drivers for a destination wedding. The service was impeccable, and our guests were extremely satisfied. Will definitely use again!", 
                rating: 5 
              },
              { 
                name: "Neha Gupta", 
                role: "Tourist", 
                comment: "As a tourist in India, having a knowledgeable driver made all the difference. My driver knew all the best spots and kept me safe throughout the journey.", 
                rating: 4.5 
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card 
                    elevation={0} 
                    sx={{ 
                      height: '100%',
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'visible',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      },
                      '&::before': {
                        content: '"""',
                        position: 'absolute',
                        top: -20,
                        left: 20,
                        fontSize: '80px',
                        lineHeight: 1,
                        fontFamily: 'Georgia, serif',
                        color: 'rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ mb: 3 }}>
                        <Rating
                          value={testimonial.rating}
                          readOnly
                          precision={0.5}
                          icon={<StarIcon fontSize="inherit" sx={{ color: '#FFD700' }} />}
                          emptyIcon={<StarIcon fontSize="inherit" sx={{ color: 'rgba(0,0,0,0.1)' }} />}
                        />
                      </Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 4, 
                          fontStyle: 'italic',
                          lineHeight: 1.8,
                          color: 'text.secondary',
                          minHeight: 130
                        }}
                      >
                        "{testimonial.comment}"
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 50, 
                            height: 50, 
                            borderRadius: '50%', 
                            bgcolor: 'grey.300',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            fontWeight: 700,
                            color: 'white',
                            background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
                          }}
                        >
                          {testimonial.name.charAt(0)}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ 
        py: { xs: 10, md: 16 }, 
        background: 'linear-gradient(135deg, #000000 0%, #222222 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 70%)',
          zIndex: 1
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          zIndex: 1
        }
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Box 
              sx={{ 
                textAlign: 'center',
                borderRadius: 5,
                position: 'relative',
                p: { xs: 4, md: 8 },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 5,
                  border: '1px solid rgba(255,255,255,0.1)',
                  zIndex: -1
                }
              }}
            >
              <Typography 
                variant="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #ffffff 0%, #d0d0d0 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 10px rgba(255,255,255,0.1)',
                  mb: 3
                }}
              >
                Ready to Experience Hassle-Free Travel?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 5,
                  maxWidth: 700,
                  mx: 'auto',
                  fontWeight: 400,
                  color: 'grey.400',
                  lineHeight: 1.6
                }}
              >
                Book your first driver today and discover why thousands of customers trust DriveGo for their transportation needs.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3}
                justifyContent="center"
              >
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={() => navigate('/drivers')}
                  sx={{
                    py: 2,
                    px: 6,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '50px',
                    background: 'linear-gradient(90deg, #f5f7fa 0%, #c3cfe2 100%)',
                    color: '#000',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
                      background: 'linear-gradient(90deg, #c3cfe2 0%, #f5f7fa 100%)',
                    }
                  }}
                >
                  Book a Driver
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  color="inherit"
                  onClick={() => navigate('/driver-registration')}
                  sx={{
                    py: 2,
                    px: 6,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '50px',
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderWidth: '2px',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Become a Driver
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

// Add keyframes for the animation
const GlobalStyles = () => {
  return (
    <style jsx global>{`
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.3);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
    `}</style>
  );
};

// Export the component with global styles
export { GlobalStyles }; 