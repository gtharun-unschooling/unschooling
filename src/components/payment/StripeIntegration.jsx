import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import { CreditCard, Security } from '@mui/icons-material';
import { trackEvent, trackConversion } from '../analytics/GoogleAnalytics';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ 
  planName, 
  planPrice, 
  planId, 
  onSuccess, 
  onError 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent on component mount
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: planId,
          amount: planPrice * 100, // Convert to cents
          currency: 'inr'
        }),
      });

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setError('Failed to initialize payment. Please try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        setError(error.message);
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Track successful payment
        trackEvent('payment_success', 'business', planName, planPrice);
        trackConversion('subscription', planPrice, 'INR');
        
        onSuccess(paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
      onError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <CreditCard sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5">
          Complete Your Subscription
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {planName} Plan
        </Typography>
        <Typography variant="h4" color="primary.main">
          ₹{planPrice}/month
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Card Information
          </Typography>
          <Box sx={{ 
            p: 2, 
            border: '1px solid #e0e0e0', 
            borderRadius: 1,
            backgroundColor: '#fafafa'
          }}>
            <CardElement options={cardElementOptions} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Security sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            Your payment information is secure and encrypted
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={!stripe || isProcessing}
          startIcon={isProcessing ? <CircularProgress size={20} /> : <CreditCard />}
        >
          {isProcessing ? 'Processing...' : `Subscribe to ${planName} - ₹${planPrice}/month`}
        </Button>
      </form>
    </Paper>
  );
};

const StripeIntegration = ({ planName, planPrice, planId, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        planName={planName}
        planPrice={planPrice}
        planId={planId}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripeIntegration;
