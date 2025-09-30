import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Email,
  Send,
  Schedule,
  Analytics,
  Campaign,
  PersonAdd
} from '@mui/icons-material';
import { trackEvent } from '../analytics/GoogleAnalytics';

const EmailCampaign = ({ onCampaignSent }) => {
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    content: '',
    audience: 'all',
    scheduleType: 'immediate',
    scheduledDate: '',
    personalization: true,
    tracking: true
  });
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const audienceOptions = [
    { value: 'all', label: 'All Subscribers', count: 1250 },
    { value: 'nurture', label: 'Nurture Plan Users', count: 450 },
    { value: 'grow', label: 'Grow Plan Users', count: 380 },
    { value: 'thrive', label: 'Thrive Plan Users', count: 420 },
    { value: 'inactive', label: 'Inactive Users', count: 180 },
    { value: 'new', label: 'New Subscribers (Last 30 days)', count: 95 }
  ];

  const templateOptions = [
    { value: 'welcome', label: 'Welcome Series' },
    { value: 'learning_tips', label: 'Learning Tips' },
    { value: 'progress_update', label: 'Progress Update' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'custom', label: 'Custom' }
  ];

  const handleInputChange = (field) => (event) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSwitchChange = (field) => (event) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleTemplateSelect = (template) => {
    const templates = {
      welcome: {
        subject: 'Welcome to Unschooling React! 🎉',
        content: `Hi {{name}},

Welcome to your personalized learning journey! We're excited to help your child discover their potential through our AI-powered learning plans.

Here's what you can expect:
• Personalized learning recommendations
• Progress tracking and insights
• Expert-curated content
• Support from our learning community

Get started by exploring your dashboard and setting up your child's profile.

Best regards,
The Unschooling Team`
      },
      learning_tips: {
        subject: 'Weekly Learning Tips for {{childName}}',
        content: `Hi {{name}},

Here are this week's learning tips for {{childName}}:

🎯 Focus Area: {{focusArea}}
📚 Recommended Activities: {{activities}}
🎨 Creative Projects: {{projects}}
🏃 Physical Activities: {{physical}}

Remember: Every child learns differently. Follow your child's interests and pace.

Happy Learning!
The Unschooling Team`
      },
      progress_update: {
        subject: '{{childName}}'s Learning Progress Update',
        content: `Hi {{name}},

Great news! {{childName}} has been making wonderful progress:

📈 This Week's Achievements:
{{achievements}}

🎯 Areas of Focus:
{{focusAreas}}

📊 Overall Progress:
{{overallProgress}}

Keep up the great work! Continue encouraging {{childName}}'s natural curiosity.

Best regards,
The Unschooling Team`
      }
    };

    if (templates[template]) {
      setCampaignData(prev => ({
        ...prev,
        subject: templates[template].subject,
        content: templates[template].content
      }));
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setError('');

    try {
      // Track email campaign
      trackEvent('email_campaign', 'marketing', campaignData.audience, 1);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      const campaign = {
        id: `CAMPAIGN-${Date.now()}`,
        ...campaignData,
        status: 'sent',
        sentAt: new Date().toISOString(),
        recipientCount: audienceOptions.find(a => a.value === campaignData.audience)?.count || 0
      };

      console.log('Email campaign sent:', campaign);
      
      setIsSuccess(true);
      onCampaignSent?.(campaign);
      
    } catch (error) {
      console.error('Error sending email campaign:', error);
      setError('Failed to send email campaign. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (isSuccess) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
          <Send />
        </Avatar>
        <Typography variant="h5" gutterBottom color="success.main">
          Campaign Sent Successfully!
        </Typography>
        <Typography variant="body1" paragraph>
          Your email campaign has been sent to {audienceOptions.find(a => a.value === campaignData.audience)?.count} subscribers.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setIsSuccess(false);
            setCampaignData({
              name: '',
              subject: '',
              content: '',
              audience: 'all',
              scheduleType: 'immediate',
              scheduledDate: '',
              personalization: true,
              tracking: true
            });
          }}
        >
          Create Another Campaign
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Email sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5">
          Email Campaign
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSend}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Campaign Name"
              value={campaignData.name}
              onChange={handleInputChange('name')}
              required
              placeholder="e.g., Welcome Series - Week 1"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Template</InputLabel>
              <Select
                value=""
                onChange={(e) => handleTemplateSelect(e.target.value)}
                label="Template"
              >
                {templateOptions.map((template) => (
                  <MenuItem key={template.value} value={template.value}>
                    {template.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subject Line"
              value={campaignData.subject}
              onChange={handleInputChange('subject')}
              required
              placeholder="Email subject line"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Audience</InputLabel>
              <Select
                value={campaignData.audience}
                onChange={handleInputChange('audience')}
                label="Audience"
              >
                {audienceOptions.map((audience) => (
                  <MenuItem key={audience.value} value={audience.value}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{audience.label}</span>
                      <Chip label={audience.count} size="small" />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Schedule</InputLabel>
              <Select
                value={campaignData.scheduleType}
                onChange={handleInputChange('scheduleType')}
                label="Schedule"
              >
                <MenuItem value="immediate">Send Immediately</MenuItem>
                <MenuItem value="scheduled">Schedule for Later</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {campaignData.scheduleType === 'scheduled' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Scheduled Date & Time"
                value={campaignData.scheduledDate}
                onChange={handleInputChange('scheduledDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Email Content"
              value={campaignData.content}
              onChange={handleInputChange('content')}
              required
              placeholder="Write your email content here..."
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Campaign Settings
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={campaignData.personalization}
                  onChange={handleSwitchChange('personalization')}
                />
              }
              label="Enable Personalization ({{name}}, {{childName}})"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={campaignData.tracking}
                  onChange={handleSwitchChange('tracking')}
                />
              }
              label="Enable Open & Click Tracking"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSending}
              startIcon={isSending ? <CircularProgress size={20} /> : <Send />}
            >
              {isSending ? 'Sending Campaign...' : 'Send Email Campaign'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EmailCampaign;
