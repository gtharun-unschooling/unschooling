import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BackButton from '../../components/ui/BackButton';
import PaymentModal from '../../components/payment/PaymentModal';


const HeroSection = () => {
    const sectionStyle = {
      width: '100%',
      padding: '8vh 5vw',
      background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
      textAlign: 'center',
      overflow: 'hidden',
    };
  
    const containerStyle = {
      maxWidth: '800px',
      margin: '0 auto',
      transition: 'opacity 1s ease, transform 1s ease',
    };
  
    const headlineStyle = {
      fontSize: '2.75rem',
      fontWeight: '700',
      color: '#3b0764',
      background: 'linear-gradient(90deg, #9333ea, #f59e0b)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      lineHeight: '1.4',
    };
  
    const [visible, setVisible] = useState(false);
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        setVisible(true);
      }, 100); // slight delay for effect
      return () => clearTimeout(timeout);
    }, []);
  
    const animatedStyle = {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
    };
  
    return (
      <section style={sectionStyle}>
        <div style={{ ...containerStyle, ...animatedStyle }}>
          <h1 style={headlineStyle}>
            Smart learning plans for every age — made simple, playful, and powerful.
          </h1>
        </div>
      </section>
    );
  };
  
  

// 🎯 Plan Comparison Section (Standalone Full Width Page Section)
const PlanSection = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const sectionStyle = {
      padding: '6vh 5vw',
      backgroundColor: '#f9fafb',
      textAlign: 'center',
    };
  
    const headingStyle = {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '1.5rem',
    };
  
    const paragraphStyle = {
      fontSize: '1.1rem',
      color: '#4b5563',
      maxWidth: '800px',
      margin: '0 auto 3rem',
      lineHeight: '1.8',
    };
  
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      maxWidth: '1100px',
      margin: '0 auto',
    };
  
    const cardStyle = (isPopular) => ({
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '1.5rem',
      boxShadow: isPopular ? '0 8px 25px rgba(16, 185, 129, 0.15)' : '0 6px 16px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: isPopular ? '2px solid #10b981' : '2px solid transparent',
      position: 'relative',
      transform: isPopular ? 'scale(1.05)' : 'scale(1)',
      transition: 'all 0.3s ease',
    });
  
    const emojiStyle = {
      fontSize: '2.75rem',
      marginBottom: '1rem',
    };
  
    const planTitleStyle = {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.5rem',
    };
  
    const priceStyle = {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#10b981',
      marginBottom: '0.3rem',
    };
  
    const ageStyle = {
      fontSize: '0.95rem',
      color: '#6b7280',
      marginBottom: '1.5rem',
    };
  
    const featureListStyle = {
      textAlign: 'left',
      fontSize: '0.95rem',
      lineHeight: '1.6',
      color: '#374151',
      marginBottom: '1.5rem',
    };
  
    const buttonStyle = (isPopular) => ({
      padding: '0.75rem 1.5rem',
      backgroundColor: isPopular ? '#059669' : '#10b981',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      width: '100%',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: isPopular ? '#047857' : '#059669',
        transform: 'translateY(-2px)',
      },
    });

    const popularBadgeStyle = {
      position: 'absolute',
      top: '-10px',
      right: '20px',
      backgroundColor: '#10b981',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
    };

    const originalPriceStyle = {
      fontSize: '0.9rem',
      color: '#9ca3af',
      textDecoration: 'line-through',
      marginRight: '0.5rem',
    };

    const discountStyle = {
      fontSize: '0.8rem',
      color: '#ef4444',
      fontWeight: '600',
      backgroundColor: '#fef2f2',
      padding: '0.2rem 0.5rem',
      borderRadius: '12px',
      marginLeft: '0.5rem',
    };
  
    const plans = [
      {
        icon: '🍼',
        title: 'Nurture',
        price: '₹499/mo',
        originalPrice: '₹699/mo',
        age: 'Ages 0–3 (Parent-Guided)',
        popular: false,
        features: [
          'Weekly learning kits (4 per month)',
          'Simple daily activities (15-20 min)',
          'Expert-curated experiences',
          'Full parental guidance & support',
          'Infant-safe materials & tools',
          'Progress tracking dashboard',
          'Parent community access',
          'Email support',
        ],
        benefits: [
          'Develops early motor skills',
          'Builds parent-child bonding',
          'Introduces basic concepts',
          'Safe exploration environment',
        ],
        kitContents: [
          'Age-appropriate toys',
          'Sensory materials',
          'Activity cards',
          'Parent guide',
        ],
      },
      {
        icon: '🌿',
        title: 'Grow',
        price: '₹799/mo',
        originalPrice: '₹999/mo',
        age: 'Ages 3–6 (Light Autonomy)',
        popular: true,
        features: [
          'Creative kits + interactive stories',
          'Track progress online',
          'Flexible scheduling',
          'Fun hands-on learning',
          'Early curiosity builder',
          'Monthly live sessions (2 per month)',
          'Parent-child activities',
          'Priority support',
          'Mobile app access',
        ],
        benefits: [
          'Enhances creativity & imagination',
          'Develops problem-solving skills',
          'Builds confidence & independence',
          'Prepares for school readiness',
        ],
        kitContents: [
          'Art & craft supplies',
          'Educational games',
          'Story books',
          'Activity worksheets',
          'Progress stickers',
        ],
      },
      {
        icon: '🚀',
        title: 'Thrive',
        price: '₹999/mo',
        originalPrice: '₹1299/mo',
        age: 'Ages 6–10+ (Independent)',
        popular: false,
        features: [
          'Project-based learning',
          'Live sessions included (4 per month)',
          'All kits & materials',
          'Self-paced challenges',
          'Builds real-world skills',
          'Mentor support',
          'Advanced progress tracking',
          'Community challenges',
          'Certificate programs',
        ],
        benefits: [
          'Develops critical thinking',
          'Builds real-world skills',
          'Encourages independence',
          'Prepares for future learning',
        ],
        kitContents: [
          'STEM project materials',
          'Coding tools',
          'Science experiments',
          'Advanced games',
          'Achievement badges',
        ],
      },
    ];
  
    const handlePlanSelect = (plan) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setSelectedPlan(plan);
      setShowPaymentModal(true);
    };

    const billingToggleStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2rem',
      gap: '1rem',
    };

    const toggleButtonStyle = (isActive) => ({
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '25px',
      backgroundColor: isActive ? '#10b981' : '#e5e7eb',
      color: isActive ? 'white' : '#6b7280',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    });

    return (
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Choose the Right Plan</h2>
        <p style={paragraphStyle}>
          Each plan is tailored for your child's unique age and learning stage. Our kits grow with your child,
          blending creativity, independence, and hands-on fun!
        </p>
        
        {/* Billing Cycle Toggle */}
        <div style={billingToggleStyle}>
          <button
            style={toggleButtonStyle(billingCycle === 'monthly')}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            style={toggleButtonStyle(billingCycle === 'yearly')}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly
            <span style={{ 
              fontSize: '0.75rem', 
              marginLeft: '0.5rem',
              backgroundColor: '#059669',
              color: 'white',
              padding: '0.2rem 0.5rem',
              borderRadius: '10px',
            }}>
              Save 17%
            </span>
          </button>
        </div>

        <div style={gridStyle}>
          {plans.map((plan, index) => (
            <div key={index} style={cardStyle(plan.popular)}>
              {plan.popular && (
                <div style={popularBadgeStyle}>Most Popular</div>
              )}
              <span style={emojiStyle}>{plan.icon}</span>
              <div style={planTitleStyle}>{plan.title}</div>
              
              {/* Dynamic Pricing */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <span style={originalPriceStyle}>{plan.originalPrice}</span>
                <span style={priceStyle}>
                  {billingCycle === 'yearly' 
                    ? `₹${Math.floor(parseInt(plan.price.replace('₹', '').replace('/mo', '')) * 10)}/yr`
                    : plan.price
                  }
                </span>
                <span style={discountStyle}>
                  {billingCycle === 'yearly' ? 'Save 17%' : 'Limited Time'}
                </span>
              </div>
              
              <div style={ageStyle}>{plan.age}</div>
              
              {/* Key Features */}
              <ul style={featureListStyle}>
                {plan.features.slice(0, 6).map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem', marginTop: '0.1rem' }}>✓</span>
                    <span style={{ fontSize: '0.9rem' }}>{feat}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                style={buttonStyle(plan.popular)}
                onClick={() => handlePlanSelect(plan)}
              >
                {currentUser ? `Choose ${plan.title}` : 'Login to Subscribe'}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPlan && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedPlan(null);
            }}
            selectedPlan={selectedPlan}
            billingCycle={billingCycle}
          />
        )}
      </section>
    );
  };
  
// 🎯 Kit Usage & Return Flow Section
const KitFlowSection = () => {
    const sectionStyle = {
      padding: '6vh 5vw',
      backgroundColor: '#fff7ed',
      textAlign: 'center',
    };
  
    const headingStyle = {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#7c2d12',
      marginBottom: '2rem',
    };
  
    const paragraphStyle = {
      fontSize: '1.1rem',
      color: '#78350f',
      maxWidth: '700px',
      margin: '0 auto 3rem',
      lineHeight: '1.7',
    };
  
    const itemGridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      maxWidth: '1000px',
      margin: '0 auto',
    };
  
    const cardStyle = {
      backgroundColor: '#fde68a',
      padding: '1.5rem',
      borderRadius: '1.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'transform 0.3s ease',
    };
  
    const iconStyle = {
      fontSize: '2.25rem',
      marginBottom: '0.75rem',
    };
  
    const titleStyle = {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#7c2d12',
      textAlign: 'center',
    };
  
    const steps = [
      { icon: '📬', title: 'Kit Delivered to Your Doorstep' },
      { icon: '🎉', title: 'Explore, Play & Learn at Your Pace' },
      { icon: '♻️', title: 'We Collect Reusables with the Next Delivery' },
    ];
  
    return (
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Once You Get the Kit...</h2>
        <p style={paragraphStyle}>
          Enjoy the activities, explore the surprises, and don’t worry about the clutter — we’ll pick up any returnable items when we drop off your next kit.
        </p>
        <div style={itemGridStyle}>
          {steps.map((step, index) => (
            <div key={index} style={cardStyle}>
              <div style={iconStyle}>{step.icon}</div>
              <div style={titleStyle}>{step.title}</div>
            </div>
          ))}
        </div>
      </section>
    );
  };
  

  // ✅ Main Page that combines all sections
  const PlansMainPage = () => {
    return (
      <div>
        {/* Back Button */}
        <div style={{ 
          position: 'fixed', 
          top: '2rem', 
          left: '2rem', 
          zIndex: 1000,
          padding: '1rem'
        }}>
                         <BackButton 
                 to="/" 
                 text="Back to Home" 
                 variant="colorful"
                 size="medium"
               />
        </div>
        <HeroSection />
        <PlanSection />
        <KitFlowSection />
        {/* <WeeklyKitSection />
        <TrackGrowthSection />
        <CTASection />  */}
      </div>
    );
  };
  
  export default PlansMainPage;