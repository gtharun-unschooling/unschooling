import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import Navbar from '../../components/Navbar';

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
            Privacy Policy
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              1. Information We Collect
            </Typography>
            <Typography variant="body1" paragraph>
              We collect information you provide directly to us, such as when you create an account, subscribe to our service, or contact us for support.
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Personal Information:
            </Typography>
            <ul>
              <li>Name and contact information (email, phone number)</li>
              <li>Child's information (age, interests, learning preferences)</li>
              <li>Payment and billing information</li>
              <li>Account credentials and preferences</li>
            </ul>

            <Typography variant="h6" gutterBottom>
              Usage Information:
            </Typography>
            <ul>
              <li>Learning progress and activity data</li>
              <li>Content interaction and engagement metrics</li>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" paragraph>
              We use the information we collect to:
            </Typography>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Generate personalized learning plans and recommendations</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Detect, prevent, and address technical issues</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              3. Information Sharing and Disclosure
            </Typography>
            <Typography variant="body1" paragraph>
              We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
            </Typography>
            <ul>
              <li><strong>Service Providers:</strong> We may share information with trusted third parties who assist us in operating our service</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, user information may be transferred</li>
              <li><strong>Consent:</strong> We may share information with your explicit consent</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              4. Data Security
            </Typography>
            <Typography variant="body1" paragraph>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </Typography>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage and backup procedures</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              5. Your Rights (GDPR Compliance)
            </Typography>
            <Typography variant="body1" paragraph>
              Under the General Data Protection Regulation (GDPR), you have the following rights:
            </Typography>
            <ul>
              <li><strong>Right to Access:</strong> Request copies of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
            </ul>
            <Typography variant="body1" paragraph>
              To exercise these rights, please contact us at privacy@unschooling.in
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              6. Children's Privacy
            </Typography>
            <Typography variant="body1" paragraph>
              Our service is designed for families and children. We take special care to protect children's privacy:
            </Typography>
            <ul>
              <li>We collect minimal information necessary for educational purposes</li>
              <li>Parental consent is required for children under 13</li>
              <li>We do not knowingly collect personal information from children without parental consent</li>
              <li>Parents can review, update, or delete their child's information at any time</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              7. Cookies and Tracking Technologies
            </Typography>
            <Typography variant="body1" paragraph>
              We use cookies and similar tracking technologies to enhance your experience:
            </Typography>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
            </ul>
            <Typography variant="body1" paragraph>
              You can control cookie settings through your browser preferences or our cookie consent banner.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              8. Data Retention
            </Typography>
            <Typography variant="body1" paragraph>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. Specifically:
            </Typography>
            <ul>
              <li>Account information: Until account deletion</li>
              <li>Learning data: 3 years after last activity</li>
              <li>Payment records: 7 years for tax and legal compliance</li>
              <li>Analytics data: 2 years in anonymized form</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              9. International Data Transfers
            </Typography>
            <Typography variant="body1" paragraph>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers, including:
            </Typography>
            <ul>
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Certification schemes and codes of conduct</li>
            </ul>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              10. Changes to This Privacy Policy
            </Typography>
            <Typography variant="body1" paragraph>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date. We encourage you to review this privacy policy periodically.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              11. Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions about this privacy policy or our data practices, please contact us:
            </Typography>
            <Typography variant="body1">
              Email: privacy@unschooling.in<br />
              Data Protection Officer: dpo@unschooling.in<br />
              Address: Unschooling React, India<br />
              Phone: +91-XXXX-XXXX
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
