import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const message = location.state?.message || '';

  const { signIn, signInWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(message);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (message) {
      setNotification(message);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) throw error;

      // Redirect to the page the user was trying to access, or home
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError(error.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const { data, error } = await signInWithGoogle(from);
      if (error) throw error;
      // Redirect happens automatically via OAuth
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      setError(error.message || 'Failed to sign in with Google.');
      setGoogleLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2B2171 0%, #E94057 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: '16px',
            maxWidth: '400px',
            mx: 'auto',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                bgcolor: '#2B2171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2,
              }}
            >
              <LockIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h5" component="h1" gutterBottom>
              Welcome <span style={{ color: '#E94057' }}>Back</span>
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {notification && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {notification}
            </Alert>
          )}

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            sx={{
              py: 1.2,
              mb: 2,
              borderColor: '#2B2171',
              color: '#2B2171',
              '&:hover': {
                borderColor: '#E94057',
                color: '#E94057',
                backgroundColor: 'transparent',
              },
            }}
          >
            {googleLoading ? <CircularProgress size={24} color="inherit" /> : 'Continue with Google'}
          </Button>

          <Box sx={{ position: 'relative', my: 3 }}>
            <Divider sx={{ '&::before, &::after': { borderColor: 'rgba(0, 0, 0, 0.12)' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                Or sign in with email
              </Typography>
            </Divider>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1,
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    sx={{
                      color: '#2B2171',
                      '&.Mui-checked': {
                        color: '#2B2171',
                      },
                    }}
                  />
                }
                label="Remember me"
              />
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{ color: '#2B2171' }}
              >
                Forgot Password?
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #2B2171 0%, #E94057 100%)',
                borderRadius: '8px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #231b5c 0%, #d13a4e 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'SIGN IN'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                New user?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{ color: '#E94057', fontWeight: 500 }}
                >
                  Create Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 