import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

const Profile = () => {
  const { user, getUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData = await getUserProfile();
        if (profileData) {
          setProfile(profileData);
          setFormData({
            ...formData,
            fullName: profileData.full_name || '',
            phoneNumber: profileData.phone_number || profileData.phone || '',
            email: profileData.email || user?.email || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!profile) {
        throw new Error('Profile data is missing');
      }
      
      const isDriverProfile = profile.isDriver === true;
      const tableName = isDriverProfile ? 'driver_profiles' : 'user_profiles';
      const idField = isDriverProfile ? 'user_id' : 'id';
      const idValue = isDriverProfile ? user.id : profile.id;

      if (!idValue) {
        throw new Error('User ID is missing');
      }

      const { error } = await supabase
        .from(tableName)
        .update({
          full_name: formData.fullName,
          [isDriverProfile ? 'phone_number' : 'phone']: formData.phoneNumber,
        })
        .eq(idField, idValue);

      if (error) throw error;

      // Update the user's metadata in the auth profile
      const { error: authError } = await supabase.auth.updateUser({
        data: { 
          full_name: formData.fullName,
          phone: formData.phoneNumber,
        }
      });

      if (authError) throw authError;

      setSuccess('Profile updated successfully');
      
      // Refresh profile data
      const updatedProfile = await getUserProfile();
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      // Sign in with current password to verify it's correct
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.currentPassword,
      });
      
      if (signInError) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });
      
      if (error) throw error;
      
      setSuccess('Password updated successfully');
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const isDriverProfile = profile?.isDriver === true;

  return (
    <Box 
      sx={{ 
        py: 4,
        background: 'linear-gradient(135deg, rgba(43, 33, 113, 0.05) 0%, rgba(233, 64, 87, 0.05) 100%)',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3, borderRadius: '16px' }}>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#2B2171',
                width: 56,
                height: 56,
                mr: 2,
              }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5" component="h1">
                {profile?.full_name || 'User Profile'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.email || user?.email}
              </Typography>
              {isDriverProfile && (
                <Chip 
                  label="Driver" 
                  color="primary" 
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Profile Information" />
                <Tab label="Change Password" />
                {isDriverProfile && <Tab label="Driver Information" />}
              </Tabs>
            </Box>

            {/* Profile Information Tab */}
            <Box role="tabpanel" hidden={tabValue !== 0} sx={{ py: 3 }}>
              {tabValue === 0 && (
                <Box component="form" onSubmit={handleProfileUpdate}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        disabled={true}
                        helperText="Email cannot be changed"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                          mt: 1,
                          background: 'linear-gradient(135deg, #2B2171 0%, #E94057 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #231b5c 0%, #d13a4e 100%)',
                          },
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>

            {/* Change Password Tab */}
            <Box role="tabpanel" hidden={tabValue !== 1} sx={{ py: 3 }}>
              {tabValue === 1 && (
                <Box component="form" onSubmit={handlePasswordChange}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                          mt: 1,
                          background: 'linear-gradient(135deg, #2B2171 0%, #E94057 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #231b5c 0%, #d13a4e 100%)',
                          },
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>

            {/* Driver Information Tab */}
            {isDriverProfile && (
              <Box role="tabpanel" hidden={tabValue !== 2} sx={{ py: 3 }}>
                {tabValue === 2 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="License Number"
                        value={profile?.license_number || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="License Type"
                        value={profile?.license_type || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Vehicle Type"
                        value={profile?.vehicle_type || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Years of Experience"
                        value={profile?.years_of_experience || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Languages Spoken
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profile?.languages_spoken?.map((language) => (
                          <Chip
                            key={language}
                            label={language}
                          />
                        )) || <Typography variant="body2">No languages specified</Typography>}
                      </Box>
                    </Grid>
                    {profile?.status === 'pending' && (
                      <Grid item xs={12}>
                        <Alert severity="info">
                          Your driver profile is pending approval. You will be notified once it's approved.
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile; 