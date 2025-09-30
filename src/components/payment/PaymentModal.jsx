import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Razorpay configuration and service functions
const PLAN_PRICING = {
  'nurture': {
    monthly: 49900, // ₹499 in paise
    yearly: 499000, // ₹4990 in paise (2 months free)
  },
  'grow': {
    monthly: 79900, // ₹799 in paise
    yearly: 799000, // ₹7990 in paise (2 months free)
  },
  'thrive': {
    monthly: 99900, // ₹999 in paise
    yearly: 999000, // ₹9990 in paise (2 months free)
  },
};

const getPlanPricing = (planType, billingCycle = 'monthly') => {
  return PLAN_PRICING[planType]?.[billingCycle] || 0;
};

const formatAmount = (amountInPaise) => {
  return (amountInPaise / 100).toFixed(2);
};

const getYearlySavings = (planType) => {
  const monthlyPrice = PLAN_PRICING[planType].monthly;
  const yearlyPrice = PLAN_PRICING[planType].yearly;
  const monthlyTotal = monthlyPrice * 12;
  const savings = monthlyTotal - yearlyPrice;
  return savings;
};

const PaymentModal = ({ isOpen, onClose, selectedPlan, billingCycle = 'monthly' }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (isOpen && selectedPlan) {
      loadScript();
    }
  }, [isOpen, selectedPlan]);

  const loadScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!currentUser) {
      setError('Please login to continue with payment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create order data
      const amount = getPlanPricing(selectedPlan.title.toLowerCase(), billingCycle);
      const currency = 'INR';
      
      const orderData = {
        amount: amount,
        currency: currency,
        receipt: `order_${Date.now()}_${selectedPlan.title.toLowerCase()}`,
        notes: {
          plan_type: selectedPlan.title.toLowerCase(),
          billing_cycle: billingCycle,
          user_id: currentUser.uid,
          user_email: currentUser.email,
        },
      };

      const orderResult = {
        success: true,
        order: {
          id: `order_${Date.now()}`,
          amount: amount,
          currency: currency,
        },
        amount: amount,
        currency: currency,
      };

      if (!orderResult.success) {
        throw new Error(orderResult.error);
      }

      setOrderDetails(orderResult.order);

      // Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
        amount: orderResult.amount,
        currency: orderResult.currency,
        name: 'Unschooling',
        description: `${selectedPlan.title} Plan - ${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} Subscription`,
        order_id: orderResult.order.id,
        prefill: {
          name: currentUser.displayName || 'User',
          email: currentUser.email,
          contact: currentUser.phoneNumber || '',
        },
        theme: {
          color: '#10b981',
        },
        handler: async (response) => {
          await handlePaymentSuccess(response);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Verify payment (simplified for demo)
      const isVerified = true; // In production, implement proper signature verification
      
      if (!isVerified) {
        throw new Error('Payment verification failed');
      }

      // Save subscription to Firestore
      const subscriptionData = {
        userId: currentUser.uid,
        planType: selectedPlan.title.toLowerCase(),
        billingCycle: billingCycle,
        amount: getPlanPricing(selectedPlan.title.toLowerCase(), billingCycle),
        currency: 'INR',
        paymentId: paymentData.razorpay_payment_id,
        orderId: paymentData.razorpay_order_id,
        signature: paymentData.razorpay_signature,
        status: 'active',
        startDate: new Date(),
        endDate: billingCycle === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Save to subscriptions collection
      await setDoc(doc(db, 'subscriptions', paymentData.razorpay_payment_id), subscriptionData);

      // Update user profile with subscription info
      await updateDoc(doc(db, 'users', currentUser.uid), {
        subscription: {
          planType: selectedPlan.title.toLowerCase(),
          billingCycle: billingCycle,
          status: 'active',
          startDate: new Date(),
          endDate: subscriptionData.endDate,
        },
        updatedAt: serverTimestamp(),
      });

      setSuccess(true);
      setLoading(false);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
        // Redirect to dashboard or show success message
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      console.error('Payment success handling error:', error);
      setError('Payment verification failed. Please contact support.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const amount = getPlanPricing(selectedPlan.title.toLowerCase(), billingCycle);
  const formattedAmount = formatAmount(amount);
  const yearlySavings = getYearlySavings(selectedPlan.title.toLowerCase());

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0,
          }}>
            Complete Your Subscription
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            ×
          </button>
        </div>

        {/* Plan Details */}
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
          }}>
            <span style={{ fontSize: '2rem', marginRight: '0.75rem' }}>
              {selectedPlan.icon}
            </span>
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0,
              }}>
                {selectedPlan.title} Plan
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0,
              }}>
                {selectedPlan.age}
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#10b981',
            }}>
              ₹{formattedAmount}
            </span>
            <span style={{
              fontSize: '0.875rem',
              color: '#6b7280',
            }}>
              {billingCycle === 'yearly' ? 'per year' : 'per month'}
            </span>
          </div>

          {billingCycle === 'yearly' && (
            <div style={{
              fontSize: '0.875rem',
              color: '#059669',
              backgroundColor: '#ecfdf5',
              padding: '0.5rem',
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              💰 Save ₹{RazorpayService.formatAmount(yearlySavings)} with yearly billing!
            </div>
          )}
        </div>

        {/* Features */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '0.75rem',
          }}>
            What's included:
          </h4>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            {selectedPlan.features.slice(0, 5).map((feature, index) => (
              <li key={index} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                color: '#374151',
              }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1rem',
            color: '#dc2626',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1rem',
            color: '#059669',
            fontSize: '0.875rem',
            textAlign: 'center',
          }}>
            🎉 Payment successful! Redirecting to dashboard...
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              flex: 2,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: loading ? '#9ca3af' : '#10b981',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Processing...' : `Pay ₹${formattedAmount}`}
          </button>
        </div>

        {/* Security Notice */}
        <div style={{
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#6b7280',
        }}>
          🔒 Secure payment powered by Razorpay
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
