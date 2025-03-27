import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PaymentIcon from '@mui/icons-material/Payment';
import EventIcon from '@mui/icons-material/Event';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'primary';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    case 'ongoing':
      return 'info';
    default:
      return 'default';
  }
};

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return 'N/A';
  const date = new Date(dateTimeStr);
  return date.toLocaleString();
};

// Validate if string is a valid UUID v4
const isValidUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        if (!user) return;

        // Validate UUID format first
        if (!isValidUUID(id)) {
          throw new Error('Invalid booking ID format');
        }

        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Booking not found');
        }

        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError(error.message || 'Failed to load booking details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, user]);

  const handleCancelBooking = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'Cancelled' })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setBooking({ ...booking, status: 'Cancelled' });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmitReview = async () => {
    try {
      setReviewSubmitting(true);
      
      const { error } = await supabase
        .from('bookings')
        .update({
          rating,
          review,
          rated: true
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setBooking({ ...booking, rating, review, rated: true });
      setReviewSuccess(true);
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        handleCloseReviewDialog();
        setReviewSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/bookings')}
        >
          Back to Bookings
        </Button>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Booking not found</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/bookings')}
        >
          Back to Bookings
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4, background: 'linear-gradient(135deg, rgba(43, 33, 113, 0.05) 0%, rgba(233, 64, 87, 0.05) 100%)', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3, borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Booking Details
            </Typography>
            <Chip
              label={booking.status}
              color={getStatusColor(booking.status)}
              sx={{ fontSize: '1rem', py: 1, px: 2 }}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Driver Information
                  </Typography>
                  <Typography variant="body1">{booking.driver_name}</Typography>
                  
                  {booking.rated && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>Your Rating:</Typography>
                      <Rating value={booking.rating} readOnly />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Trip Details
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOnIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pickup Location" 
                        secondary={booking.pickup_location} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOnIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Drop Location" 
                        secondary={booking.drop_location} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarTodayIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pickup Date & Time" 
                        secondary={formatDateTime(booking.pickup_datetime)} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTimeIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Duration" 
                        secondary={`${booking.duration_hours} hours`} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payment Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <PaymentIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Payment Method" 
                        secondary={booking.payment_method.replace('_', ' ').toUpperCase()} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ReceiptIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Amount" 
                        secondary={`₹${booking.total_amount.toFixed(2)}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Payment Status" 
                        secondary={booking.payment_status} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Booking Date" 
                        secondary={formatDateTime(booking.created_at)} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            {booking.notes && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Additional Notes</Typography>
                    <Typography variant="body1">
                      {booking.notes}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {booking.review && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Your Review</Typography>
                    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <Rating value={booking.rating} readOnly />
                    </Box>
                    <Typography variant="body1">
                      {booking.review}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/bookings')}
                >
                  Back to Bookings
                </Button>
                
                <Box>
                  {booking.status === 'Confirmed' && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleCancelBooking}
                      sx={{ mr: 2 }}
                    >
                      Cancel Booking
                    </Button>
                  )}
                  
                  {booking.status === 'Completed' && !booking.rated && (
                    <Button
                      variant="contained"
                      onClick={handleOpenReviewDialog}
                      sx={{
                        background: 'linear-gradient(135deg, #2B2171 0%, #E94057 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #231b5c 0%, #d13a4e 100%)',
                        },
                      }}
                    >
                      Rate & Review
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Review Dialog */}
      <Dialog open={openDialog} onClose={handleCloseReviewDialog}>
        <DialogTitle>Rate Your Trip</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography component="legend" sx={{ mr: 2 }}>Rating:</Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
          </Box>
          <TextField
            autoFocus
            margin="dense"
            id="review"
            label="Your Review"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          {reviewSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Review submitted successfully!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitReview}
            disabled={reviewSubmitting || rating === 0}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #2B2171 0%, #E94057 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #231b5c 0%, #d13a4e 100%)',
              },
            }}
          >
            {reviewSubmitting ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingDetails; 