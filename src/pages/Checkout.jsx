import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  InputAdornment,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import PaymentIcon from '@mui/icons-material/Payment';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Driver from '../models/Driver';

const paymentMethods = [
  { id: 'credit_card', name: 'Credit Card' },
  { id: 'debit_card', name: 'Debit Card' },
  { id: 'upi', name: 'UPI Payment' },
  { id: 'netbanking', name: 'Net Banking' },
  { id: 'cod', name: 'Cash on Delivery' },
];

const BookingSummary = ({ booking, driver, duration, totalCost }) => (
  <Card sx={{ 
    mb: 3, 
    borderRadius: 3,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    border: 'none'
  }}>
    <Box sx={{ 
      bgcolor: 'black', 
      color: 'white', 
      p: 2.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Typography variant="h6" fontWeight={600}>Booking Summary</Typography>
      <Chip 
        label="Confirmed" 
        size="small" 
        sx={{ 
          bgcolor: '#00C853', 
          color: 'white',
          fontWeight: 500
        }} 
      />
    </Box>
    <CardContent sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Driver</Typography>
          <Typography variant="body1" fontWeight={500}>{driver.name}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Vehicle</Typography>
          <Typography variant="body1" fontWeight={500}>{driver.vehicle}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Pickup Date & Time</Typography>
          <Typography variant="body1" fontWeight={500}>
            {booking.pickupDateTime ? new Date(booking.pickupDateTime).toLocaleString() : 'Not set'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Duration</Typography>
          <Typography variant="body1" fontWeight={500}>{duration} hours</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Pickup Location</Typography>
          <Typography variant="body1" fontWeight={500}>{booking.pickupLocation || 'Not specified'}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Drop Location</Typography>
          <Typography variant="body1" fontWeight={500}>{booking.dropLocation || 'Not specified'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 2.5 }} />
          <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 2 }}>
            <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1" color="text.secondary">Rate per hour</Typography>
              <Typography variant="body1" fontWeight={500}>₹{driver.price}</Typography>
            </Grid>
            <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1" color="text.secondary">Duration</Typography>
              <Typography variant="body1" fontWeight={500}>{duration} hours</Typography>
            </Grid>
            <Divider sx={{ my: 1.5 }} />
            <Grid container justifyContent="space-between">
              <Typography variant="h6" fontWeight={700}>Total Cost</Typography>
              <Typography variant="h6" fontWeight={700} color="black">₹{totalCost}</Typography>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const DriverCard = ({ driver }) => (
  <Card sx={{ 
    mb: 3, 
    borderRadius: 3,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    border: 'none'
  }}>
    <Box sx={{ 
      position: 'relative',
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' } 
    }}>
      <CardMedia
        component="img"
        sx={{
          width: { xs: '100%', sm: 180 },
          height: { xs: 180, sm: 'auto' },
          objectFit: 'cover',
          filter: 'brightness(0.95)'
        }}
        image={driver.image}
        alt={driver.name}
      />
      <CardContent sx={{ 
        flex: '1 0 auto', 
        p: 3,
        position: 'relative',
        zIndex: 1
      }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>{driver.name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating
            value={driver.rating}
            readOnly
            precision={0.1}
            size="small"
            icon={<StarIcon fontSize="inherit" sx={{ color: 'black' }} />}
            emptyIcon={<StarIcon fontSize="inherit" sx={{ color: 'rgba(0,0,0,0.2)' }} />}
          />
          <Typography variant="body2" fontWeight={500} sx={{ ml: 1 }}>
            ({driver.rating})
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 1.5, color: '#555' }} />
              <Typography variant="body1" fontWeight={500}>{driver.experience}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon fontSize="small" sx={{ mr: 1.5, color: '#555' }} />
              <Typography variant="body1" fontWeight={500}>{driver.location}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalTaxiIcon fontSize="small" sx={{ mr: 1.5, color: '#555' }} />
              <Typography variant="body1" fontWeight={500}>{driver.vehicle}</Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ 
          mt: 2.5, 
          p: 2, 
          borderRadius: 2, 
          bgcolor: '#f8f9fa', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Hourly Rate</Typography>
            <Typography variant="h5" fontWeight={700}>₹{driver.price}</Typography>
          </Box>
          <Chip 
            label="Available Now" 
            size="medium" 
            color="success"
            sx={{ fontWeight: 500 }}
          />
        </Box>
      </CardContent>
    </Box>
  </Card>
);

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, getUserProfile } = useAuth();
  const [driver, setDriver] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [duration, setDuration] = useState(4); // Default 4 hours
  
  const [booking, setBooking] = useState({
    pickupDateTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    pickupLocation: '',
    dropLocation: '',
    additionalNotes: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
  });

  // Steps for the checkout process
  const steps = ['Driver Selection', 'Booking Details', 'Payment Information', 'Confirmation'];

  useEffect(() => {
    // Get the driver data from location state or fetch from API
    if (location.state?.driver) {
      // Ensure driver is a Driver model instance
      const driverModel = location.state.driver instanceof Driver 
        ? location.state.driver 
        : Driver.fromData(location.state.driver);
      
      setDriver(driverModel);
    } else {
      // Redirect back to drivers page if no driver is selected
      navigate('/drivers');
    }

    // Load user profile
    const loadProfile = async () => {
      try {
        if (user) {
          const profileData = await getUserProfile();
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadProfile();
  }, [location, navigate, user, getUserProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({
      ...booking,
      [name]: value,
    });
  };

  const handleDateTimeChange = (newValue) => {
    setBooking({
      ...booking,
      pickupDateTime: newValue,
    });
  };

  const handleDurationChange = (e) => {
    setDuration(Number(e.target.value));
  };

  const calculateTotalCost = () => {
    return driver ? driver.price * duration : 0;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validation for step 1 - Driver is already selected
      if (!driver) {
        setError('Please select a driver first');
        return;
      }
    } else if (activeStep === 1) {
      // Validation for step 2 - Booking details
      if (!booking.pickupDateTime) {
        setError('Please select pickup date and time');
        return;
      }
      if (!booking.pickupLocation) {
        setError('Please enter pickup location');
        return;
      }
      if (!booking.dropLocation) {
        setError('Please enter drop location');
        return;
      }
    } else if (activeStep === 2) {
      // Validation for step 3 - Payment information
      if (booking.paymentMethod === 'credit_card' || booking.paymentMethod === 'debit_card') {
        if (!booking.cardNumber || !booking.cardName || !booking.expiryDate || !booking.cvv) {
          setError('Please fill in all card details');
          return;
        }
      } else if (booking.paymentMethod === 'upi' && !booking.upiId) {
        setError('Please enter UPI ID');
        return;
      } else if (booking.paymentMethod === 'netbanking' && !booking.bankName) {
        setError('Please select your bank');
        return;
      }
    }

    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (!user) {
        throw new Error('You must be logged in to book a driver');
      }

      if (!driver || !driver.id) {
        throw new Error('Invalid driver information');
      }

      const totalCost = calculateTotalCost();
      
      // Create a new booking in the database
      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            driver_id: typeof driver.id === 'number' ? driver.id.toString() : driver.id, // Convert number ID to string if needed
            driver_name: driver.name,
            pickup_location: booking.pickupLocation,
            drop_location: booking.dropLocation,
            pickup_datetime: booking.pickupDateTime.toISOString(),
            duration_hours: duration,
            notes: booking.additionalNotes,
            status: 'Confirmed',
            payment_method: booking.paymentMethod,
            payment_status: booking.paymentMethod === 'cod' ? 'Pending' : 'Paid',
            total_amount: totalCost,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (bookingError) {
        throw bookingError;
      }

      setSuccess(true);
      
      // Wait for 3 seconds before redirecting
      setTimeout(() => {
        navigate('/bookings', { 
          state: { message: 'Booking completed successfully!' } 
        });
      }, 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.message || 'An error occurred while processing your booking');
    } finally {
      setLoading(false);
    }
  };

  // Render different steps of the checkout process
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Selected Driver
            </Typography>
            {driver && <DriverCard driver={driver} />}
            
            <Typography variant="h6" gutterBottom>
              Select Duration
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Duration (hours)</InputLabel>
              <Select
                value={duration}
                label="Duration (hours)"
                onChange={handleDurationChange}
              >
                {[1, 2, 4, 6, 8, 12, 24].map(hours => (
                  <MenuItem key={hours} value={hours}>{hours} hours</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Booking Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Pickup Date & Time"
                    value={booking.pickupDateTime}
                    onChange={handleDateTimeChange}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                    minDateTime={new Date(new Date().setHours(new Date().getHours() + 1))}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Pickup Location"
                  name="pickupLocation"
                  value={booking.pickupLocation}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Drop Location"
                  name="dropLocation"
                  value={booking.dropLocation}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  name="additionalNotes"
                  multiline
                  rows={4}
                  value={booking.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any specific instructions for the driver"
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              Payment Method
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel>Select Payment Method</InputLabel>
              <Select
                name="paymentMethod"
                value={booking.paymentMethod}
                onChange={handleInputChange}
                label="Select Payment Method"
              >
                {paymentMethods.map(method => (
                  <MenuItem key={method.id} value={method.id}>
                    {method.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {(booking.paymentMethod === 'credit_card' || booking.paymentMethod === 'debit_card') && (
              <Box sx={{ 
                p: 3, 
                borderRadius: 3, 
                bgcolor: '#f8f9fa', 
                border: '1px solid', 
                borderColor: 'grey.200',
                mb: 3
              }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Card Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      name="cardNumber"
                      value={booking.cardNumber}
                      onChange={handleInputChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PaymentIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name on Card"
                      name="cardName"
                      value={booking.cardName}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      name="expiryDate"
                      value={booking.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      name="cvv"
                      value={booking.cvv}
                      onChange={handleInputChange}
                      placeholder="XXX"
                      variant="outlined"
                      type="password"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {booking.paymentMethod === 'upi' && (
              <Box sx={{ 
                p: 3, 
                borderRadius: 3, 
                bgcolor: '#f8f9fa', 
                border: '1px solid', 
                borderColor: 'grey.200',
                mb: 3
              }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  UPI Details
                </Typography>
                <TextField
                  fullWidth
                  label="UPI ID"
                  name="upiId"
                  value={booking.upiId}
                  onChange={handleInputChange}
                  placeholder="username@upi"
                  variant="outlined"
                />
              </Box>
            )}

            {booking.paymentMethod === 'netbanking' && (
              <Box sx={{ 
                p: 3, 
                borderRadius: 3, 
                bgcolor: '#f8f9fa', 
                border: '1px solid', 
                borderColor: 'grey.200',
                mb: 3
              }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Net Banking
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Select Bank</InputLabel>
                  <Select
                    name="bankName"
                    value={booking.bankName}
                    onChange={handleInputChange}
                    label="Select Bank"
                  >
                    <MenuItem value="sbi">State Bank of India</MenuItem>
                    <MenuItem value="hdfc">HDFC Bank</MenuItem>
                    <MenuItem value="icici">ICICI Bank</MenuItem>
                    <MenuItem value="axis">Axis Bank</MenuItem>
                    <MenuItem value="kotak">Kotak Mahindra Bank</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {booking.paymentMethod === 'cod' && (
              <Alert 
                severity="info" 
                icon={<PaymentIcon />}
                sx={{ 
                  mt: 2, 
                  bgcolor: '#e3f2fd', 
                  borderRadius: 2,
                  p: 2,
                  '.MuiAlert-icon': {
                    alignItems: 'center'
                  }
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  Cash Payment Selected
                </Typography>
                <Typography variant="body2">
                  You will pay the driver directly at the time of service.
                </Typography>
              </Alert>
            )}
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              Review and Confirm
            </Typography>
            
            {driver && (
              <BookingSummary
                booking={booking}
                driver={driver}
                duration={duration}
                totalCost={calculateTotalCost()}
              />
            )}
            
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                mt: 3,
                mb: 3,
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Payment Method
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 1 
              }}>
                <PaymentIcon sx={{ color: 'text.secondary', mr: 2 }} />
                <Typography variant="body1" fontWeight={500}>
                  {paymentMethods.find(method => method.id === booking.paymentMethod)?.name}
                </Typography>
              </Box>
            </Paper>
            
            {!loading && !success && (
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  mt: 3,
                  bgcolor: 'black',
                  color: 'white',
                  borderRadius: '50px',
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: '#333',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                  }
                }}
                fullWidth
              >
                Confirm and Book Now
              </Button>
            )}
            
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <CircularProgress sx={{ color: 'black' }} />
              </Box>
            )}
            
            {success && (
              <Box sx={{ mt: 3 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    borderRadius: 3, 
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'green.200',
                    bgcolor: '#f0f9f0',
                  }}
                >
                  <CheckCircleIcon 
                    color="success" 
                    sx={{ fontSize: 60, mb: 2 }} 
                  />
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    Booking Confirmed!
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Your driver has been booked successfully. We're redirecting you to your bookings page.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You will receive a confirmation email shortly.
                  </Typography>
                </Paper>
              </Box>
            )}
          </Box>
        );
      
      default:
        return null;
    }
  };

  if (!driver) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '70vh',
        flexDirection: 'column',
        gap: 2 
      }}>
        <CircularProgress size={40} sx={{ color: 'black' }} />
        <Typography variant="body1" color="text.secondary">Loading your booking information...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      py: 5, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fb 100%)',
      minHeight: '100vh' 
    }}>
      <Container maxWidth="md">
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'grey.100',
          }}
        >
          <Box sx={{ 
            bgcolor: 'black', 
            color: 'white', 
            p: 3,
            textAlign: 'center'
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight={600}
              gutterBottom
            >
              Complete Your Booking
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              You're just a few steps away from booking your driver
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mx: 3, 
                mt: 3, 
                mb: 0,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ p: 3, pt: 4, pb: 1 }}>
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: 4,
                '& .MuiStepLabel-label': {
                  fontWeight: 500
                },
                '& .MuiStepLabel-label.Mui-active': {
                  fontWeight: 700,
                  color: 'black'
                },
                '& .MuiStepLabel-iconContainer': {
                  '& .MuiStepIcon-root': {
                    color: 'grey.300'
                  },
                  '& .MuiStepIcon-root.Mui-active': {
                    color: 'black'
                  },
                  '& .MuiStepIcon-root.Mui-completed': {
                    color: 'black'
                  },
                  '& .MuiStepIcon-text': {
                    fill: 'white'
                  }
                }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box sx={{ px: 3, pb: 4, pt: 1 }}>
            {getStepContent(activeStep)}
          </Box>

          {!success && activeStep !== steps.length - 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              p: 3,
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'grey.100'
            }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ 
                  px: 3,
                  color: 'black',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  px: 4,
                  py: 1,
                  bgcolor: 'black',
                  color: 'white',
                  borderRadius: '50px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#333',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                  }
                }}
              >
                {activeStep === steps.length - 2 ? 'Review Booking' : 'Continue'}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Checkout; 