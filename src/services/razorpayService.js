// Razorpay Payment Service
// Note: Razorpay import commented out for now - uncomment when you have actual Razorpay keys
// import Razorpay from 'razorpay';

// Razorpay configuration
const razorpayConfig = {
  key_id: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Replace with your actual key
  key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET || 'your_secret_key', // Replace with your actual secret
};

// Initialize Razorpay instance (commented out for now)
// const razorpay = new Razorpay({
//   key_id: razorpayConfig.key_id,
//   key_secret: razorpayConfig.key_secret,
// });

// Plan pricing in paise (Razorpay uses smallest currency unit)
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

class RazorpayService {
  // Create a payment order
  static async createOrder(planType, billingCycle = 'monthly', userDetails) {
    try {
      const amount = PLAN_PRICING[planType][billingCycle];
      const currency = 'INR';
      
      const orderData = {
        amount: amount,
        currency: currency,
        receipt: `order_${Date.now()}_${planType}`,
        notes: {
          plan_type: planType,
          billing_cycle: billingCycle,
          user_id: userDetails.userId,
          user_email: userDetails.email,
        },
      };

      const order = await razorpay.orders.create(orderData);
      
      return {
        success: true,
        order: order,
        amount: amount,
        currency: currency,
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Verify payment signature
  static verifyPayment(paymentData) {
    try {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', razorpayConfig.key_secret);
      hmac.update(paymentData.razorpay_order_id + '|' + paymentData.razorpay_payment_id);
      const generatedSignature = hmac.digest('hex');
      
      return generatedSignature === paymentData.razorpay_signature;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }

  // Create subscription for recurring payments
  static async createSubscription(planType, billingCycle = 'monthly', userDetails) {
    try {
      const amount = PLAN_PRICING[planType][billingCycle];
      const interval = billingCycle === 'yearly' ? 12 : 1;
      const intervalUnit = 'month';
      
      const subscriptionData = {
        plan_id: `${planType}_${billingCycle}`, // You'll need to create plans in Razorpay dashboard
        customer_notify: 1,
        quantity: 1,
        total_count: billingCycle === 'yearly' ? 1 : 12, // 1 year or 12 months
        notes: {
          plan_type: planType,
          billing_cycle: billingCycle,
          user_id: userDetails.userId,
          user_email: userDetails.email,
        },
      };

      const subscription = await razorpay.subscriptions.create(subscriptionData);
      
      return {
        success: true,
        subscription: subscription,
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get plan pricing
  static getPlanPricing(planType, billingCycle = 'monthly') {
    return PLAN_PRICING[planType]?.[billingCycle] || 0;
  }

  // Format amount for display
  static formatAmount(amountInPaise) {
    return (amountInPaise / 100).toFixed(2);
  }

  // Get savings for yearly billing
  static getYearlySavings(planType) {
    const monthlyPrice = PLAN_PRICING[planType].monthly;
    const yearlyPrice = PLAN_PRICING[planType].yearly;
    const monthlyTotal = monthlyPrice * 12;
    const savings = monthlyTotal - yearlyPrice;
    return savings;
  }
}

export default RazorpayService;
