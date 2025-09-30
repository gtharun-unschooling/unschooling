import React, { useState } from 'react';
import MinimalBackButton from '../components/ui/MinimalBackButton';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "What is Unschooling?",
      answer: "Unschooling is a personalized learning approach that focuses on your child's natural curiosity and interests. Instead of rigid curricula, we provide hands-on activities, real-world experiences, and child-led exploration across 63+ different niches."
    },
    {
      question: "How does the learning kit work?",
      answer: "Each week, we deliver a curated learning kit to your doorstep containing activities, materials, and guides tailored to your child's interests and age. The kits include everything needed for hands-on learning experiences."
    },
    {
      question: "What age groups do you serve?",
      answer: "Our programs are designed for children ages 3-12, with age-appropriate activities and materials. We adapt our content to match your child's developmental stage and learning pace."
    },
    {
      question: "How much does it cost?",
      answer: "Our pricing is flexible and transparent. We offer different plans to fit your family's needs and budget. Check our pricing page for detailed information about our subscription options."
    },
    {
      question: "Can I customize the learning experience?",
      answer: "Absolutely! We work with you to understand your child's interests, learning style, and goals. Our platform adapts to provide personalized recommendations and activities."
    },
    {
      question: "What if my child doesn't like an activity?",
      answer: "No problem! We encourage exploration and understand that not every activity will resonate. Our platform learns from your child's preferences and adjusts future recommendations accordingly."
    },
    {
      question: "How do you ensure safety?",
      answer: "Safety is our top priority. All activities are designed with child safety in mind, materials are non-toxic and age-appropriate, and we provide clear safety guidelines for each activity."
    },
    {
      question: "Can I track my child's progress?",
      answer: "Yes! Our progress dashboard shows your child's learning journey, completed activities, interests discovered, and growth areas. You can see how your child is developing across different skills and niches."
    },
    {
      question: "What if I need to pause or cancel?",
      answer: "You can pause or cancel your subscription at any time with no penalties. We understand that family needs change, and we're here to support you through your learning journey."
    },
    {
      question: "Do you offer support for parents?",
      answer: "Yes! We provide resources, guides, and support to help parents understand and facilitate their child's learning. Our team is always available to answer questions and provide guidance."
    }
  ];

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    position: 'relative'
  };

  const contentContainerStyle = {
    padding: '2rem',
    paddingTop: '5rem' // Add top padding to account for back button
  };

  const contentStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 1rem 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#64748b',
    margin: '0'
  };

  const faqItemStyle = {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    marginBottom: '1rem',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  };

  const questionStyle = {
    background: '#f8fafc',
    padding: '1.5rem',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    border: 'none',
    width: '100%',
    transition: 'all 0.3s ease'
  };

  const answerStyle = {
    padding: '1.5rem',
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#475569',
    background: '#ffffff'
  };

  const iconStyle = {
    fontSize: '1.2rem',
    transition: 'transform 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <MinimalBackButton 
        heroColors={{
          backgroundColor: '#f8fafc',
          primaryColor: '#667eea',
          nicheColor: '#764ba2'
        }}
      />
      
      <div style={contentContainerStyle}>
        <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Frequently Asked Questions</h1>
          <p style={subtitleStyle}>
            Find answers to common questions about our unschooling approach and learning kits
          </p>
        </div>

        <div>
          {faqData.map((item, index) => (
            <div key={index} style={faqItemStyle}>
              <button
                style={questionStyle}
                onClick={() => toggleItem(index)}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f8fafc';
                }}
              >
                <span>{item.question}</span>
                <span 
                  style={{
                    ...iconStyle,
                    transform: openItems[index] ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                >
                  ▼
                </span>
              </button>
              
              {openItems[index] && (
                <div style={answerStyle}>
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
