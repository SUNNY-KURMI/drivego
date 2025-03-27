import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Chip,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Stack,
  Skeleton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import FilterListIcon from '@mui/icons-material/FilterList';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import Driver from '../models/Driver';

// Import driver images
import driver1Image from '../assets/images/driver1.jpg';
import driver2Image from '../assets/images/driver2.jpg';
import driver3Image from '../assets/images/driver3.jpg';
import driver4Image from '../assets/images/driver4.jpg';
import driver5Image from '../assets/images/driver5.jpg';
import driver6Image from '../assets/images/driver6.jpg';

// Mock data - replace with actual API call
const mockDriversData = [
  {
    id: 1,
    name: 'Rahul Singh',
    image: driver1Image,
    rating: 4.8,
    experience: '5+ years',
    location: 'Mumbai',
    vehicle: 'Toyota Camry',
    status: 'Available',
    price: 599,
    description: 'Professional driver with experience in luxury vehicles and excellent customer service skills.'
  },
  {
    id: 2,
    name: 'Vikram Joshi',
    image: driver2Image,
    rating: 4.9,
    experience: '3+ years',
    location: 'Delhi',
    vehicle: 'Honda City',
    status: 'Available',
    price: 499,
    description: 'Safe, punctual driver with knowledge of all major routes. Specializes in airport transfers.'
  },
  {
    id: 3,
    name: 'Arjun Malhotra',
    image: driver3Image,
    rating: 4.7,
    experience: '4+ years',
    location: 'Bangalore',
    vehicle: 'Hyundai Verna',
    status: 'Available',
    price: 699,
    description: 'Experienced chauffeur with defensive driving certification and multilingual capabilities.'
  },
  {
    id: 4,
    name: 'Neelam Iyer',
    image: driver4Image,
    rating: 4.9,
    experience: '6+ years',
    location: 'Chennai',
    vehicle: 'Maruti Dzire',
    status: 'Available',
    price: 449,
    description: 'Specialized in corporate travel with exemplary professionalism and punctuality.'
  },
  {
    id: 5,
    name: 'Pradeep Kumar',
    image: driver5Image,
    rating: 4.6,
    experience: '4+ years',
    location: 'Mumbai',
    vehicle: 'Honda Civic',
    status: 'Available',
    price: 549,
    description: 'Knowledgeable driver with expertise in navigating busy metropolitan areas efficiently.'
  },
  {
    id: 6,
    name: 'Sanjay Mehta',
    image: driver6Image,
    rating: 4.8,
    experience: '7+ years',
    location: 'Delhi',
    vehicle: 'Toyota Innova',
    status: 'Available',
    price: 799,
    description: 'Specialized in long-distance travel with excellent knowledge of interstate routes.'
  },
];

// Convert raw driver data to Driver model instances
const mockDrivers = mockDriversData.map(driver => Driver.fromData(driver));

const Drivers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [drivers, setDrivers] = useState(mockDrivers);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(!isMobile);

  // This would be replaced with an actual API call
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setDrivers(mockDrivers);
        setLoading(false);
      }, 1000);
    };

    fetchDrivers();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocationFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleToggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationFilter('all');
    setSortBy('rating');
  };

  const handleBookNow = (driver) => {
    if (!user) {
      // If user is not logged in, redirect to login page with a return path
      navigate('/login', { state: { from: '/drivers' } });
      return;
    }
    
    // Ensure driver is a valid Driver instance
    const driverModel = driver instanceof Driver ? driver : Driver.fromData(driver);
    
    if (!driverModel.isValid()) {
      console.error('Invalid driver data:', driver);
      return;
    }
    
    // Navigate to checkout page with driver information
    navigate('/checkout', { state: { driver: driverModel } });
  };

  // Filter based on selected tab
  const getFilteredDriversByTab = (driversToFilter) => {
    switch (selectedTab) {
      case 0: // All
        return driversToFilter;
      case 1: // Economy
        return driversToFilter.filter(driver => driver.price < 500);
      case 2: // Premium
        return driversToFilter.filter(driver => driver.price >= 500 && driver.price < 700);
      case 3: // Luxury
        return driversToFilter.filter(driver => driver.price >= 700);
      default:
        return driversToFilter;
    }
  };

  const filteredDrivers = getFilteredDriversByTab(drivers)
    .filter((driver) => {
      const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = locationFilter === 'all' || driver.location === locationFilter;
      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'experience') return parseInt(b.experience) - parseInt(a.experience);
      return 0;
    });

  // Skeleton loader for driver cards
  const DriverCardSkeleton = () => (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.100',
      }}
    >
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" width="60%" height={28} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="30%" height={32} />
          <Skeleton variant="rectangular" width="40%" height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box sx={{ 
      py: 4, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fb 100%)',
      minHeight: '100vh' 
    }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            fontWeight={700}
            sx={{
              background: 'linear-gradient(90deg, #000000 0%, #434343 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            Book Your Professional Driver
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 700,
              textAlign: { xs: 'center', md: 'left' },
              mb: 2
            }}
          >
            Choose from our verified professional drivers for a safe and comfortable journey.
          </Typography>
        </Box>

        <Paper 
          elevation={0} 
          sx={{ 
            mb: 4, 
            borderRadius: 3, 
            overflow: 'hidden', 
            border: '1px solid', 
            borderColor: 'grey.200',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  placeholder="Search by name, vehicle or location"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={handleSearch}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <Button
                  variant={filtersOpen ? "contained" : "outlined"}
                  startIcon={<TuneIcon />}
                  onClick={handleToggleFilters}
                  fullWidth
                  sx={{ 
                    height: '40px',
                    display: { xs: 'flex', md: 'none' }
                  }}
                >
                  Filters
                </Button>
                <FormControl 
                  fullWidth 
                  size="small" 
                  sx={{ display: { xs: 'none', md: 'block' } }}
                >
                  <Select
                    value={locationFilter}
                    onChange={handleLocationChange}
                    displayEmpty
                  >
                    <MenuItem value="all">All Locations</MenuItem>
                    <MenuItem value="Mumbai">Mumbai</MenuItem>
                    <MenuItem value="Delhi">Delhi</MenuItem>
                    <MenuItem value="Bangalore">Bangalore</MenuItem>
                    <MenuItem value="Chennai">Chennai</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth size="small">
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    displayEmpty
                  >
                    <MenuItem value="rating">Sort by Rating</MenuItem>
                    <MenuItem value="price_low">Price: Low to High</MenuItem>
                    <MenuItem value="price_high">Price: High to Low</MenuItem>
                    <MenuItem value="experience">Most Experienced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button 
                  variant="text" 
                  onClick={handleResetFilters}
                  endIcon={<CloseIcon />}
                  fullWidth 
                  sx={{ 
                    height: '40px',
                    justifyContent: 'flex-end',
                    display: filtersOpen ? 'flex' : 'none'
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>

            {filtersOpen && (
              <Box sx={{ mt: 3, display: { xs: 'block', md: 'none' } }}>
                <Typography variant="subtitle2" gutterBottom>
                  Location
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <Select
                    value={locationFilter}
                    onChange={handleLocationChange}
                    displayEmpty
                  >
                    <MenuItem value="all">All Locations</MenuItem>
                    <MenuItem value="Mumbai">Mumbai</MenuItem>
                    <MenuItem value="Delhi">Delhi</MenuItem>
                    <MenuItem value="Bangalore">Bangalore</MenuItem>
                    <MenuItem value="Chennai">Chennai</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>

          <Divider />

          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ 
              bgcolor: 'background.paper',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                minHeight: 48,
              },
              '& .Mui-selected': {
                fontWeight: 700,
                color: '#000',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '20%',
                  width: '60%',
                  height: '3px',
                  background: 'linear-gradient(90deg, #000000 0%, #434343 100%)',
                  borderRadius: '10px 10px 0 0'
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab label="All Drivers" />
            <Tab label="Economy" />
            <Tab label="Premium" />
            <Tab label="Luxury" />
          </Tabs>
        </Paper>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <DriverCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : filteredDrivers.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            p: 4
          }}>
            <Typography variant="h6" gutterBottom>
              No drivers match your search criteria
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try changing your search terms or filters
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleResetFilters}
              sx={{
                bgcolor: 'black',
                '&:hover': {
                  bgcolor: '#333'
                }
              }}
            >
              Reset Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredDrivers.map((driver) => (
              <Grid item xs={12} sm={6} md={4} key={driver.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'grey.100',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={driver.image}
                      alt={driver.name}
                      sx={{ 
                        objectFit: 'cover',
                        filter: 'brightness(0.9)'
                      }}
                    />
                    <Chip
                      label={driver.status}
                      color="success"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        fontWeight: 600,
                        backgroundColor: '#00C853',
                        color: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                        pt: 4,
                        pb: 1.5,
                        px: 2,
                      }}
                    >
                      <Typography variant="h6" color="white" fontWeight={700}>
                        {driver.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating
                          value={driver.rating}
                          readOnly
                          precision={0.1}
                          size="small"
                          emptyIcon={<StarIcon style={{ color: 'rgba(255,255,255,0.3)' }} fontSize="inherit" />}
                        />
                        <Typography variant="body2" sx={{ ml: 1, color: 'white' }}>
                          ({driver.rating})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 2.5, bgcolor: 'white' }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1.5, color: '#555' }} />
                        <Typography variant="body2" fontWeight={500}>{driver.experience}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1.5, color: '#555' }} />
                        <Typography variant="body2" fontWeight={500}>{driver.location}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalTaxiIcon fontSize="small" sx={{ mr: 1.5, color: '#555' }} />
                        <Typography variant="body2" fontWeight={500}>{driver.vehicle}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <VerifiedUserIcon fontSize="small" sx={{ mr: 1.5, color: '#1976D2' }} />
                        <Typography variant="body2" fontWeight={500} color="#1976D2">Verified Driver</Typography>
                      </Box>
                    </Stack>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 2,
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        height: '40px'
                      }}
                    >
                      {driver.description}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'white' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#000' }}>
                      ₹{driver.price}<Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>/hr</Typography>
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleBookNow(driver)}
                      sx={{
                        minWidth: '120px',
                        bgcolor: 'black',
                        color: 'white',
                        borderRadius: '50px',
                        fontWeight: 600,
                        textTransform: 'none',
                        py: 1,
                        '&:hover': {
                          bgcolor: '#333',
                          boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      Book Now
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Drivers; 