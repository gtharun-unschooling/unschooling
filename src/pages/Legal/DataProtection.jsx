import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Button, Alert, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Download, Delete, Email, Security } from '@mui/icons-material';
import Navbar from '../../components/Navbar';

const DataProtection = () => {
  const [requestType, setRequestType] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the request to your backend
    console.log('Data protection request:', { requestType, email, message });
    setIsSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
            Data Protection Rights
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Exercise your data protection rights under GDPR
          </Typography>

          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="body2">
              Under the General Data Protection Regulation (GDPR), you have several rights regarding your personal data. 
              Use the form below to exercise these rights.
            </Typography>
          </Alert>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Your Data Protection Rights
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
              <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Download color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Right to Access</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Request a copy of all personal data we hold about you in a structured, machine-readable format.
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Right to Rectification</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Request correction of inaccurate or incomplete personal data.
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Delete color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Right to Erasure</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Request deletion of your personal data ("right to be forgotten").
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Security color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Right to Restrict Processing</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Request limitation of processing of your personal data in certain circumstances.
                </Typography>
              </Paper>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Submit a Data Protection Request
            </Typography>
            
            {isSubmitted ? (
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body1">
                  Your data protection request has been submitted successfully. 
                  We will process your request within 30 days and contact you at the provided email address.
                </Typography>
              </Alert>
            ) : (
              <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                <form onSubmit={handleSubmit}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Request Type</InputLabel>
                    <Select
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      label="Request Type"
                      required
                    >
                      <MenuItem value="access">Data Access Request</MenuItem>
                      <MenuItem value="rectification">Data Rectification Request</MenuItem>
                      <MenuItem value="erasure">Data Erasure Request</MenuItem>
                      <MenuItem value="restriction">Processing Restriction Request</MenuItem>
                      <MenuItem value="portability">Data Portability Request</MenuItem>
                      <MenuItem value="objection">Processing Objection Request</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Additional Information"
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please provide any additional details about your request..."
                    sx={{ mb: 3 }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                  >
                    Submit Request
                  </Button>
                </form>
              </Paper>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Processing Timeline
            </Typography>
            <Typography variant="body1" paragraph>
              We will process your data protection request within 30 days of receipt. For complex requests, 
              we may extend this period by up to 2 months and will notify you of the extension.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Verification Process
            </Typography>
            <Typography variant="body1" paragraph>
              To protect your privacy, we may need to verify your identity before processing your request. 
              This may involve:
            </Typography>
            <ul>
              <li>Email verification</li>
              <li>Account authentication</li>
              <li>Additional identity verification for sensitive requests</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body1" paragraph>
              For questions about data protection or to submit requests via email:
            </Typography>
            <Typography variant="body1">
              Data Protection Officer: dpo@unschooling.in<br />
              General Inquiries: privacy@unschooling.in<br />
              Phone: +91-XXXX-XXXX
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default DataProtection;
