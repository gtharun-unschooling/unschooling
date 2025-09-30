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
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Send,
  Support,
  PriorityHigh,
  BugReport,
  QuestionAnswer,
  Feedback
} from '@mui/icons-material';
import { trackEvent } from '../analytics/GoogleAnalytics';

const SupportTicket = ({ onTicketCreated }) => {
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'technical', label: 'Technical Issue', icon: <BugReport /> },
    { value: 'billing', label: 'Billing & Payments', icon: <PriorityHigh /> },
    { value: 'learning', label: 'Learning Content', icon: <QuestionAnswer /> },
    { value: 'account', label: 'Account Issues', icon: <Support /> },
    { value: 'feedback', label: 'Feedback & Suggestions', icon: <Feedback /> }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' },
    { value: 'urgent', label: 'Urgent', color: 'error' }
  ];

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Track support ticket creation
      trackEvent('support_ticket', 'customer_service', formData.category, 1);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically send the ticket to your backend
      const ticket = {
        id: `TICKET-${Date.now()}`,
        ...formData,
        status: 'open',
        createdAt: new Date().toISOString(),
        priority: formData.priority
      };

      console.log('Support ticket created:', ticket);
      
      setIsSuccess(true);
      onTicketCreated?.(ticket);
      
    } catch (error) {
      console.error('Error creating support ticket:', error);
      setError('Failed to create support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
          <Support />
        </Avatar>
        <Typography variant="h5" gutterBottom color="success.main">
          Ticket Created Successfully!
        </Typography>
        <Typography variant="body1" paragraph>
          We've received your support request and will get back to you within 24 hours.
          You'll receive an email confirmation shortly.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setIsSuccess(false);
            setFormData({
              subject: '',
              category: '',
              priority: 'medium',
              description: '',
              attachments: []
            });
          }}
        >
          Create Another Ticket
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Support sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5">
          Create Support Ticket
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subject"
              value={formData.subject}
              onChange={handleInputChange('subject')}
              required
              placeholder="Brief description of your issue"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={handleInputChange('category')}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {category.icon}
                      <Typography sx={{ ml: 1 }}>
                        {category.label}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={handleInputChange('priority')}
                label="Priority"
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    <Chip
                      label={priority.label}
                      color={priority.color}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {priority.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Description"
              value={formData.description}
              onChange={handleInputChange('description')}
              required
              placeholder="Please provide detailed information about your issue or question..."
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Response Time:</strong><br />
              • High Priority: 2-4 hours<br />
              • Medium Priority: 4-8 hours<br />
              • Low Priority: 24-48 hours
            </Typography>
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
              {isSubmitting ? 'Creating Ticket...' : 'Create Support Ticket'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SupportTicket;
