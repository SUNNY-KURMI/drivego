import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createOrUpdateUserProfile } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get session from URL fragment/hash
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session) {
          // Session is available, user is logged in
          // Create/update profile with OAuth data
          await createOrUpdateUserProfile({
            full_name: session.user.user_metadata?.full_name,
            first_name: session.user.user_metadata?.given_name,
            last_name: session.user.user_metadata?.family_name,
          });
          
          // Check for a redirect path
          const redirectTo = searchParams.get('redirectTo') || '/';
          navigate(redirectTo, { replace: true });
        } else {
          // No session, redirect to login
          setError('Authentication failed. Please try again.');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setError(error.message || 'Authentication error. Please try again.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, createOrUpdateUserProfile]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #2B2171 0%, #E94057 100%)',
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
          <Typography variant="h6" color="white">
            Completing authentication...
          </Typography>
        </>
      ) : error ? (
        <Alert severity="error" sx={{ maxWidth: '400px' }}>
          {error}
        </Alert>
      ) : (
        <CircularProgress size={60} sx={{ color: 'white' }} />
      )}
    </Box>
  );
};

export default AuthCallback; 