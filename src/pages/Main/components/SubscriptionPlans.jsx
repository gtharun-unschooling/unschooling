import React from 'react';
import { Link } from 'react-router-dom';

const SubscriptionPlans = () => {
  const planData = [
    {
      name: "Nurture",
      icon: "🍼",
      price: "₹499/mo",
      features: [
        "Ages 0–3 (Parent-Guided)",
        "Weekly learning kits",
        "Simple daily activities",
        "Expert-curated experiences",
      ],
    },
    {
      name: "Grow",
      icon: "🌿",
      price: "₹799/mo",
      features: [
        "Ages 3–6 (Light Autonomy)",
        "Creative kits + stories",
        "Track progress online",
        "Flexible scheduling",
      ],
    },
    {
      name: "Thrive",
      icon: "🚀",
      price: "₹999/mo",
      features: [
        "Ages 6–10+ (Independent)",
        "Project-based learning",
        "Live sessions included",
        "All kits & materials",
      ],
    },
  ];
  
  const planStyles = {
    section: {
      padding: '6vh 5vw',
      backgroundColor: '#f5f8fa',
      textAlign: 'center',
    },
    heading: {
      fontSize: '2.8rem',
      marginBottom: '3rem',
      color: '#222',
      fontWeight: 'bold',
    },
    plansWrapper: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '2rem',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '1rem',
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
      padding: '2rem',
      width: '280px',
      flex: '0 1 auto',
      transition: 'transform 0.3s ease',
    },
    icon: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
    },
    planName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '0.5rem',
    },
    price: {
      fontSize: '1.2rem',
      color: '#666',
      marginBottom: '1rem',
    },
    featuresList: {
      textAlign: 'left',
      paddingLeft: '1rem',
      marginBottom: '1.5rem',
      color: '#555',
      fontSize: '1rem',
    },
    featureItem: {
      marginBottom: '0.5rem',
    },
    ctaBtn: {
      padding: '0.7rem 1.2rem',
      borderRadius: '5px',
      backgroundColor: '#FF6347',
      color: '#fff',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    compareLink: {
      marginTop: '2rem',
      display: 'block',
      color: '#0077cc',
      textDecoration: 'underline',
      fontSize: '1rem',
      cursor: 'pointer',
    },
  };
  
  return (
    <section style={planStyles.section}>
      <h2 style={planStyles.heading}>Plans for Every Family</h2>
      <div style={planStyles.plansWrapper}>
        {planData.map((plan, index) => (
          <div key={index} style={planStyles.card}>
            <div style={planStyles.icon}>{plan.icon}</div>
            <div style={planStyles.planName}>{plan.name}</div>
            <div style={planStyles.price}>{plan.price}</div>
            <ul style={planStyles.featuresList}>
              {plan.features.map((feature, i) => (
                <li key={i} style={planStyles.featureItem}>✔ {feature}</li>
              ))}
            </ul>
            <Link to="/plans" style={planStyles.ctaBtn}>Know More</Link>
          </div>
        ))}
      </div>
      <Link to="/plans" style={planStyles.compareLink}>See Full Comparison</Link>
    </section>
  );
};

export default SubscriptionPlans; 