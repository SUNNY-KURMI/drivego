import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

const DriverRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signUp, signInWithGoogle, createOrUpdateUserProfile } = useAuth();
  
  const [googleUser, setGoogleUser] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    licenseNumber: '',
    licenseType: '',
    licenseExpiryDate: null,
    licensePicture: null,
    experience: '',
    vehicleType: '',
    previousEmployment: '',
    languages: [],
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If user exists and we're in step 0, check if they signed in with Google
    if (user && activeStep === 0 && user.app_metadata?.provider === 'google') {
      setGoogleUser(user);
      
      // Prefill data from Google account
      setFormData((prev) => ({
        ...prev,
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
      }));
      
      // Move to driver info step
      setActiveStep(1);
    }
  }, [user, activeStep]);

  const licenseTypes = [
    'Commercial Driver License (CDL)',
    'Light Commercial Vehicle (LCV)',
    'Heavy Commercial Vehicle (HCV)',
    'Public Service Vehicle (PSV)',
  ];

  const vehicleTypes = [
    'Sedan',
    'SUV',
    'Luxury Sedan',
    'Premium SUV',
    'Van',
  ];

  const availableLanguages = [
    'English',
    'Hindi',
    'Marathi',
    'Gujarati',
    'Tamil',
    'Telugu',
    'Kannada',
    'Malayalam',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      licenseExpiryDate: date,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        licensePicture: file,
      }));
    }
  };

  const handleAddLanguage = () => {
    if (selectedLanguage && !formData.languages.includes(selectedLanguage)) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, selectedLanguage],
      }));
      setSelectedLanguage('');
    }
  };

  const handleRemoveLanguage = (language) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang !== language),
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const { data, error } = await signInWithGoogle('/driver-registration');
      if (error) throw error;
      // Redirect happens automatically via OAuth
    } catch (error) {
      console.error('Error with Google sign-up:', error);
      setError(error.message || 'Failed to sign up with Google.');
      setGoogleLoading(false);
    }
  };

  const handleAccountCreation = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate password
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await signUp(
        formData.email,
        formData.password, 
        {
          full_name: formData.fullName,
          phone: formData.phoneNumber,
          is_driver: true,
        }
      );

      if (authError) throw authError;
      
      // Move to driver info step
      setActiveStep(1);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDriverInfoSubmission = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get the user ID (either from Google auth or from the new registration)
      const userId = googleUser?.id || user?.id;
      const userEmail = googleUser?.email || user?.email || formData.email;
      
      if (!userId) {
        throw new Error('User authentication failed. Please try again.');
      }

      // Upload the license picture to Supabase Storage
      let licensePictureUrl = null;
      if (formData.licensePicture) {
        try {
          const fileExt = formData.licensePicture.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `driver-licenses/${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('driver-documents')
            .upload(filePath, formData.licensePicture);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            throw new Error('Failed to upload license picture');
          }

          // Get the public URL
          const { data: urlData } = supabase.storage
            .from('driver-documents')
            .getPublicUrl(filePath);

          licensePictureUrl = urlData?.publicUrl || null;
        } catch (uploadError) {
          console.error('Error handling file upload:', uploadError);
          // Continue with registration even if file upload fails
        }
      }

      // Store the driver profile data in Supabase database
      const { error: profileError } = await supabase
        .from('driver_profiles')
        .insert([
          {
            user_id: userId,
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            license_number: formData.licenseNumber,
            license_type: formData.licenseType,
            license_expiry_date: formData.licenseExpiryDate,
            license_picture_url: licensePictureUrl,
            years_of_experience: parseInt(formData.experience, 10) || 0,
            vehicle_type: formData.vehicleType,
            previous_employment: formData.previousEmployment,
            languages_spoken: formData.languages,
            email: userEmail,
            status: 'pending', // Pending approval by admin
          },
        ]);

      if (profileError) {
        console.error('Error creating driver profile:', profileError);
        throw new Error('Failed to create driver profile');
      }

      // Update the user metadata to indicate they're a driver
      if (googleUser) {
        try {
          await supabase.auth.updateUser({
            data: {
              is_driver: true,
            },
          });

          // Also update the user profile in our database
          await createOrUpdateUserProfile({
            full_name: formData.fullName,
            phone: formData.phoneNumber,
            is_driver: true,
          });
        } catch (updateError) {
          console.error('Error updating user metadata:', updateError);
          // Continue with registration even if metadata update fails
        }
      }

      setSuccess(true);
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Driver registration successful! Your application is pending approval.' } 
        });
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  // Render steps
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignUp}
              disabled={googleLoading || loading || success}
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
                  Or sign up with email
                </Typography>
              </Divider>
            </Box>

            <Box component="form" onSubmit={handleAccountCreation} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading || success}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={loading || success}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading || success}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading || success}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading || success}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || success}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(135deg, #2B2171 0%, #E94057 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #231b5c 0%, #d13a4e 100%)',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </>
        );
      case 1:
        return (
          <Box component="form" onSubmit={handleDriverInfoSubmission} noValidate>
            <Grid container spacing={3}>
              {googleUser && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    You're signed in with Google. Complete your driver profile below.
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Driver License Number"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  disabled={loading || success}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={loading || success}>
                  <InputLabel>License Type</InputLabel>
                  <Select
                    name="licenseType"
                    value={formData.licenseType}
                    onChange={handleChange}
                    label="License Type"
                  >
                    {licenseTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="License Expiry Date"
                    value={formData.licenseExpiryDate}
                    onChange={handleDateChange}
                    disabled={loading || success}
                    renderInput={(params) => (
                      <TextField {...params} required fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ height: '56px', width: '100%' }}
                  disabled={loading || success}
                >
                  Upload License Picture
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading || success}
                  />
                </Button>
                {formData.licensePicture && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    File selected: {formData.licensePicture.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Years of Experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={loading || success}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={loading || success}>
                  <InputLabel>Vehicle Type</InputLabel>
                  <Select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    label="Vehicle Type"
                  >
                    {vehicleTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Previous Employment History"
                  name="previousEmployment"
                  multiline
                  rows={4}
                  value={formData.previousEmployment}
                  onChange={handleChange}
                  disabled={loading || success}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth disabled={loading || success}>
                    <InputLabel>Languages Spoken</InputLabel>
                    <Select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      label="Languages Spoken"
                    >
                      {availableLanguages.map((language) => (
                        <MenuItem key={language} value={language}>
                          {language}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="text"
                    onClick={handleAddLanguage}
                    sx={{ mt: 1 }}
                    disabled={!selectedLanguage || loading || success}
                  >
                    Add Language
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.languages.map((language) => (
                    <Chip
                      key={language}
                      label={language}
                      onDelete={() => handleRemoveLanguage(language)}
                      deleteIcon={<DeleteIcon />}
                      disabled={loading || success}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  {!googleUser && (
                    <Button 
                      onClick={handleBack} 
                      disabled={loading || success}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || success}
                    sx={{
                      minWidth: '200px',
                      ml: 'auto',
                      background: 'linear-gradient(135deg, #2B2171 0%, #E94057 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #231b5c 0%, #d13a4e 100%)',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Application'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        background: 'linear-gradient(135deg, #2B2171 0%, #E94057 100%)',
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#2B2171' }}>
            Become a Driver
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
            Join our network of professional drivers and start earning
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Registration successful! Your driver application is being reviewed.
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Account Information</StepLabel>
            </Step>
            <Step>
              <StepLabel>Driver Information</StepLabel>
            </Step>
          </Stepper>

          {getStepContent(activeStep)}
        </Paper>
      </Container>
    </Box>
  );
};

export default DriverRegistration; 