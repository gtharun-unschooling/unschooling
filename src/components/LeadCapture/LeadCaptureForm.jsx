import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { Send, Download, Email } from '@mui/icons-material';
import { trackEvent } from '../analytics/GoogleAnalytics';

const LeadCaptureForm = ({ 
  title = "Get Your Free Learning Plan",
  subtitle = "Discover personalized learning recommendations for your child",
  showAgeSelector = true,
  showInterestSelector = true,
  ctaText = "Get Free Plan",
  onSuccess = () => {}
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    childAge: '',
    interests: [],
    learningGoals: '',
    newsletter: false,
    smsUpdates: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const ageGroups = [
    { value: '0-3', label: '0-3 years (Nurture)' },
    { value: '3-6', label: '3-6 years (Grow)' },
    { value: '6-10', label: '6-10+ years (Thrive)' }
  ];

  const interestOptions = [
    'Science & Nature',
    'Arts & Crafts',
    'Music & Dance',
    'Sports & Physical Activity',
    'Reading & Writing',
    'Mathematics',
    'Technology & Coding',
    'Social Skills',
    'Problem Solving',
    'Creative Thinking'
  ];

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleInterestChange = (interest) => (event) => {
    if (event.target.checked) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter(i => i !== interest)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.childAge) {
      newErrors.childAge = 'Please select your child\'s age group';
    }
    
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Track lead capture event
      trackEvent('lead_capture', 'marketing', 'form_submission', 1);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Lead captured:', formData);
      
      setIsSuccess(true);
      onSuccess(formData);
      
      // Track conversion
      trackEvent('conversion', 'marketing', 'lead_capture', 1);
      
    } catch (error) {
      console.error('Error capturing lead:', error);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ color: 'success.main', mb: 2 }}>
          <Email sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h5" gutterBottom color="success.main">
          Thank You!
        </Typography>
        <Typography variant="body1" paragraph>
          We've sent your personalized learning plan to your email. 
          Check your inbox and start your child's learning journey today!
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          sx={{ mt: 2 }}
        >
          Download Free Resources
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        {title}
      </Typography>
      <Typography variant="body1" paragraph align="center" color="text.secondary">
        {subtitle}
      </Typography>

      {errors.submit && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.submit}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Your Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={handleInputChange('phone')}
            />
          </Grid>
          
          {showAgeSelector && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.childAge}>
                <InputLabel>Child's Age Group</InputLabel>
                <Select
                  value={formData.childAge}
                  onChange={handleInputChange('childAge')}
                  label="Child's Age Group"
                >
                  {ageGroups.map((age) => (
                    <MenuItem key={age.value} value={age.value}>
                      {age.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.childAge && (
                  <Typography variant="caption" color="error">
                    {errors.childAge}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          )}
          
          {showInterestSelector && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                What interests your child? (Select all that apply)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {interestOptions.map((interest) => (
                  <FormControlLabel
                    key={interest}
                    control={
                      <Checkbox
                        checked={formData.interests.includes(interest)}
                        onChange={handleInterestChange(interest)}
                        size="small"
                      />
                    }
                    label={interest}
                  />
                ))}
              </Box>
              {errors.interests && (
                <Typography variant="caption" color="error">
                  {errors.interests}
                </Typography>
              )}
            </Grid>
          )}
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Learning Goals (Optional)"
              value={formData.learningGoals}
              onChange={handleInputChange('learningGoals')}
              placeholder="Tell us about your child's learning goals..."
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.newsletter}
                  onChange={handleInputChange('newsletter')}
                />
              }
              label="Subscribe to our newsletter for learning tips and updates"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.smsUpdates}
                  onChange={handleInputChange('smsUpdates')}
                />
              }
              label="Receive SMS updates about your child's progress"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
            >
              {isSubmitting ? 'Creating Your Plan...' : ctaText}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default LeadCaptureForm;
