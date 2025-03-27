import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
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
  const date = new Date(dateTimeStr);
  return date.toLocaleString();
};

// Validate if string is a valid UUID v4
const isValidUUID = (str) => {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const Bookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(Boolean(location.state?.message));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user) return;

        setLoading(true);
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleViewDetails = (booking) => {
    // Make sure the booking ID is a valid UUID before navigating
    if (booking && booking.id && isValidUUID(booking.id)) {
      navigate(`/bookings/${booking.id}`);
    } else {
      setError('Invalid booking ID. Cannot view details.');
      setShowSnackbar(true);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'Cancelled' })
        .eq('id', selectedBooking.id);

      if (error) {
        throw error;
      }

      // Update local state
      setBookings(bookings.map(booking =>
        booking.id === selectedBooking.id
          ? { ...booking, status: 'Cancelled' }
          : booking
      ));

      setSuccessMessage('Booking cancelled successfully');
      setShowSnackbar(true);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking. Please try again.');
      setShowSnackbar(true);
    } finally {
      handleDialogClose();
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    (booking.driver_name && booking.driver_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (booking.pickup_location && booking.pickup_location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (booking.drop_location && booking.drop_location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box sx={{ py: 4, background: 'linear-gradient(135deg, rgba(43, 33, 113, 0.05) 0%, rgba(233, 64, 87, 0.05) 100%)', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, borderRadius: '16px' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Bookings
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search bookings by driver name or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredBookings.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              No bookings found. Book a driver to see your bookings here.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Driver</TableCell>
                    <TableCell>Pickup Location</TableCell>
                    <TableCell>Drop Location</TableCell>
                    <TableCell>Pickup Date & Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.driver_name}</TableCell>
                        <TableCell>{booking.pickup_location}</TableCell>
                        <TableCell>{booking.drop_location}</TableCell>
                        <TableCell>{formatDateTime(booking.pickup_datetime)}</TableCell>
                        <TableCell>{booking.duration_hours} hours</TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status}
                            color={getStatusColor(booking.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>₹{booking.total_amount?.toFixed(2)}</TableCell>
                        <TableCell>
                          {booking.status === 'Confirmed' ? (
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => handleCancelBooking(booking)}
                            >
                              Cancel
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              onClick={() => handleViewDetails(booking)}
                            >
                              View Details
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredBookings.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </Paper>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No, Keep Booking
          </Button>
          <Button onClick={handleConfirmCancel} color="error">
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage || error}
      />
    </Box>
  );
};

export default Bookings; 