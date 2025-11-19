import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SimpleBackButton from '../../components/ui/SimpleBackButton';
import PaymentModal from '../../components/payment/PaymentModal';

// Simple SVG icon for plans – consistent, large icon without background
const PlanSvgIcon = ({ background, icon, gradientId }) => {
  return (
    <svg
      width={96}
      height={96}
      viewBox="0 0 96 96"
      aria-hidden="true"
    >
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="42"
        fill="#111827"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      >
        {icon}
      </text>
    </svg>
  );
};

// Simple SVG icon for kit-flow steps – large emoji without background
const StepSvgIcon = ({ icon }) => {
  return (
    <svg
      width={84}
      height={84}
      viewBox="0 0 84 84"
      aria-hidden="true"
    >
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="40"
        fill="#7c2d12"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      >
        {icon}
      </text>
    </svg>
  );
};


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
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <SimpleBackButton size="medium" />
          </div>
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
    // For now, all plans are simple duration-based subscriptions with a single upfront price.
    const [billingCycle] = useState('duration');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const sectionStyle = {
      padding: '5vh 5vw',
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
  
    const iconWrapperStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginBottom: '1.25rem',
    };
  
    const planTitleStyle = {
      fontSize: '1.6rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.6rem',
    };

    const priceStyle = {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#10b981',
      marginBottom: '0.35rem',
    };

    const durationStyle = {
      fontSize: '0.95rem',
      color: '#6b7280',
      marginBottom: '0.75rem',
    };

    const positioningStyle = {
      fontSize: '0.95rem',
      color: '#4b5563',
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

    const plans = [
      {
        icon: '⭐',
        gradientId: 'plan-icon-step-starter',
        colors: ['#6366f1', '#8b5cf6'],
        title: 'Step Starter',
        price: '₹999',
        duration: '1 month',
        positioning: 'Perfect if you want to try your child’s first curiosity kit.',
        popular: false,
        features: [
          '1 personalized curiosity kit based on your child’s interests',
          '5–7 hands-on activities with all core materials included',
          'Designed for independent, screen-free exploration',
          'Guides written so children can follow without teaching',
        ],
      },
      {
        icon: '🌱',
        gradientId: 'plan-icon-path-explorer',
        colors: ['#22c55e', '#16a34a'],
        title: 'Path Explorer',
        price: '₹2,699',
        duration: '3 months',
        positioning: 'Best for building a steady monthly exploration habit.',
        popular: true,
        features: [
          '3 months of curated curiosity kits (one box every month)',
          'Activities that gradually build skills and confidence',
          'Better value than trying one month at a time',
          'Ideal for parents who want to “test the lifestyle” properly',
        ],
      },
      {
        icon: '🚀',
        gradientId: 'plan-icon-life-learner',
        colors: ['#f97316', '#ea580c'],
        title: 'Life Learner',
        price: '₹4,999',
        duration: '6 months',
        positioning: 'For families committed to long-term, self-driven learning.',
        popular: false,
        features: [
          '6 months of ongoing curiosity kits for continuous growth',
          'Mix of creativity, logic, cultural and physical skill activities',
          'Best overall value per month',
          'Builds a deep habit of independent exploration at home',
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

    return (
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Choose how long you want your child’s curiosity journey</h2>
        <p style={paragraphStyle}>
          One simple learning model. Three duration options. Every plan sends a personalized curiosity kit
          each month, designed so your child can explore and learn independently — no online classes, no teaching sessions.
        </p>

        <div style={gridStyle}>
          {plans.map((plan, index) => (
            <div key={index} style={cardStyle(plan.popular)}>
              {plan.popular && (
                <div style={popularBadgeStyle}>Most Popular</div>
              )}
              <div style={iconWrapperStyle}>
                <PlanSvgIcon
                  background={plan.colors}
                  icon={plan.icon}
                  gradientId={plan.gradientId}
                />
              </div>
              <div style={planTitleStyle}>{plan.title}</div>
              <div style={priceStyle}>{plan.price}</div>
              <div style={durationStyle}>{plan.duration}</div>
              <div style={positioningStyle}>{plan.positioning}</div>

              {/* Key features */}
              <ul style={featureListStyle}>
                {plan.features.map((feat, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: '0.85rem',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '22px',
                        height: '22px',
                        minWidth: '22px',
                        borderRadius: '999px',
                        backgroundColor: '#dcfce7',
                        color: '#16a34a',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        marginRight: '1.4rem', // extra space between tick and text
                        marginTop: '0.1rem',
                      }}
                    >
                      ✓
                    </span>
                    <span
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                      }}
                    >
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button 
                style={buttonStyle(plan.popular)}
                onClick={() => handlePlanSelect(plan)}
              >
                {currentUser ? `Choose ${plan.title}` : 'Login to subscribe'}
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
      padding: '5vh 5vw',
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
      marginBottom: '1.75rem',
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
              <div style={iconStyle}>
                <StepSvgIcon icon={step.icon} />
              </div>
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