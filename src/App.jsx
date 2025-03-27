import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Drivers from './pages/Drivers';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import Auth from './components/Auth';
import Register from './pages/Register';
import DriverRegistration from './pages/DriverRegistration';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';
import Checkout from './pages/Checkout';
import BookingDetails from './pages/BookingDetails';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Header />
            <Box component="main" sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/bookings" element={<Auth><Bookings /></Auth>} />
                <Route path="/bookings/:id" element={<Auth><BookingDetails /></Auth>} />
                <Route path="/profile" element={<Auth><Profile /></Auth>} />
                <Route path="/checkout" element={<Auth><Checkout /></Auth>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/driver-registration" element={<DriverRegistration />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
