import React from 'react';
import { useEffect, useState } from 'react';


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
  
    const cardStyle = {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '1.5rem',
      boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    };
  
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
  
    const buttonStyle = {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#10b981',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      width: '100%',
    };
  
    const plans = [
      {
        icon: '🍼',
        title: 'Nurture',
        price: '₹499/mo',
        age: 'Ages 0–3 (Parent-Guided)',
        features: [
          'Weekly learning kits',
          'Simple daily activities',
          'Expert-curated experiences',
          'Full parental guidance',
          'Infant-safe materials',
        ],
      },
      {
        icon: '🌿',
        title: 'Grow',
        price: '₹799/mo',
        age: 'Ages 3–6 (Light Autonomy)',
        features: [
          'Creative kits + stories',
          'Track progress online',
          'Flexible scheduling',
          'Fun hands-on learning',
          'Early curiosity builder',
        ],
      },
      {
        icon: '🚀',
        title: 'Thrive',
        price: '₹999/mo',
        age: 'Ages 6–10+ (Independent)',
        features: [
          'Project-based learning',
          'Live sessions included',
          'All kits & materials',
          'Self-paced challenges',
          'Builds real-world skills',
        ],
      },
    ];
  
    return (
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Choose the Right Plan</h2>
        <p style={paragraphStyle}>
          Each plan is tailored for your child's unique age and learning stage. Our kits grow with your child,
          blending creativity, independence, and hands-on fun!
        </p>
        <div style={gridStyle}>
          {plans.map((plan, index) => (
            <div key={index} style={cardStyle}>
              <span style={emojiStyle}>{plan.icon}</span>
              <div style={planTitleStyle}>{plan.title}</div>
              <div style={priceStyle}>{plan.price}</div>
              <div style={ageStyle}>{plan.age}</div>
              <ul style={featureListStyle}>
                {plan.features.map((feat, idx) => (
                  <li key={idx}>• {feat}</li>
                ))}
              </ul>
              <button style={buttonStyle}>Choose {plan.title}</button>
            </div>
          ))}
        </div>
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