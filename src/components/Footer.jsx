import React from 'react';
import { Box, Container, Typography, Grid, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'DriveGo',
      description: 'Premium driver services at your fingertips',
    },
    {
      title: 'Links',
      items: [
        { label: 'Home', path: '/' },
        { label: 'Drivers', path: '/drivers' },
        { label: 'Bookings', path: '/bookings' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Cookie Policy', path: '/cookies' },
      ],
    },
    {
      title: 'Contact',
      items: [
        { label: 'support@drivego.com', path: 'mailto:support@drivego.com' },
        { label: '+91 1234567890', path: 'tel:+911234567890' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#2B2171',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {sections.map((section) => (
            <Grid item xs={12} sm={6} md={3} key={section.title}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {section.title}
              </Typography>
              {section.description && (
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                  {section.description}
                </Typography>
              )}
              {section.items && (
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {section.items.map((item) => (
                    <Box component="li" key={item.label} sx={{ mb: 1 }}>
                      <Link
                        component={RouterLink}
                        to={item.path}
                        sx={{
                          color: 'white',
                          opacity: 0.8,
                          textDecoration: 'none',
                          '&:hover': {
                            opacity: 1,
                            color: '#FF6B6B',
                          },
                        }}
                      >
                        {item.label}
                      </Link>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} DriveGo. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 