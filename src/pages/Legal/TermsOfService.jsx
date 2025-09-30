import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import Navbar from '../../components/Navbar';

const TermsOfService = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
            Terms of Service
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" paragraph>
              By accessing and using Unschooling React ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              2. Description of Service
            </Typography>
            <Typography variant="body1" paragraph>
              Unschooling React is a personalized learning platform that provides AI-generated learning plans, content recommendations, and educational resources for children and families. Our service includes:
            </Typography>
            <ul>
              <li>Personalized learning plans based on child profiles</li>
              <li>Educational content and resources</li>
              <li>Progress tracking and analytics</li>
              <li>Parent dashboard and reporting</li>
              <li>Learning kits and materials delivery</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              3. User Accounts and Registration
            </Typography>
            <Typography variant="body1" paragraph>
              To access certain features of the Service, you must register for an account. You agree to:
            </Typography>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              4. Subscription and Payment
            </Typography>
            <Typography variant="body1" paragraph>
              Our Service offers various subscription plans:
            </Typography>
            <ul>
              <li><strong>Nurture Plan:</strong> ₹499/month for ages 0-3 (Parent-Guided)</li>
              <li><strong>Grow Plan:</strong> ₹799/month for ages 3-6 (Light Autonomy)</li>
              <li><strong>Thrive Plan:</strong> ₹999/month for ages 6-10+ (Independent)</li>
            </ul>
            <Typography variant="body1" paragraph>
              All payments are processed securely through our payment partners. Subscriptions auto-renew unless cancelled. You may cancel your subscription at any time through your account settings.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              5. Privacy and Data Protection
            </Typography>
            <Typography variant="body1" paragraph>
              We are committed to protecting your privacy and personal information. Our collection, use, and disclosure of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              6. Intellectual Property Rights
            </Typography>
            <Typography variant="body1" paragraph>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Unschooling React and its licensors. The Service is protected by copyright, trademark, and other laws.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              7. Prohibited Uses
            </Typography>
            <Typography variant="body1" paragraph>
              You may not use our Service:
            </Typography>
            <ul>
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              8. Termination
            </Typography>
            <Typography variant="body1" paragraph>
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              9. Disclaimer
            </Typography>
            <Typography variant="body1" paragraph>
              The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms relating to our Service and the use of this Service.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              10. Governing Law
            </Typography>
            <Typography variant="body1" paragraph>
              These Terms shall be interpreted and governed by the laws of India. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in India.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              11. Contact Information
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions about these Terms of Service, please contact us at:
            </Typography>
            <Typography variant="body1">
              Email: legal@unschooling.in<br />
              Address: Unschooling React, India<br />
              Phone: +91-XXXX-XXXX
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default TermsOfService;
