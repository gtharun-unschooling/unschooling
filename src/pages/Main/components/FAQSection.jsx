import React, { useState } from 'react';
import { applyTextStyle } from '../../../styles/typography';
import { colorSystem } from '../../../styles/colors';

const FAQSection = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "How do I create a learning plan for my child?",
      answer: "To create a learning plan, go to the Child Profile page and fill out your child's information including age, interests, and learning style. The system will automatically generate a personalized 4-week learning plan based on your inputs."
    },
    {
      question: "Can I customize the learning topics?",
      answer: "Yes! You can browse through different niches and topics in the Explore section. You can also modify your child's interests in their profile to get different topic recommendations."
    },
    {
      question: "How do I track my child's progress?",
      answer: "Use the Progress Tracker to monitor your child's learning journey. It shows completed topics, time spent learning, and achievements earned. You can also view weekly reports in your dashboard."
    },
    {
      question: "What age groups is this platform designed for?",
      answer: "Our platform is designed for children ages 3-12. We offer age-appropriate content and activities that adapt to your child's developmental stage and learning level."
    },
    {
      question: "How often should my child use the platform?",
      answer: "We recommend 20-30 minutes of learning per day, 3-5 times per week. However, you can adjust this based on your child's attention span and schedule. The platform tracks daily goals and streaks to keep motivation high."
    },
    {
      question: "Can I use this platform offline?",
      answer: "Currently, the platform requires an internet connection for most features. However, you can download weekly plans and activities to use offline. We're working on expanding offline capabilities."
    }
  ];

  const styles = {
    section: {
      padding: '6rem 5vw',
      backgroundColor: colorSystem.background.secondary,
      maxWidth: '1200px',
      margin: '0 auto',
    },
    heading: {
      ...applyTextStyle('h2', false),
      textAlign: 'center',
      marginBottom: '3rem',
      color: colorSystem.text.primary,
    },
    faqContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    faqItem: {
      backgroundColor: '#ffffff',
      borderRadius: '1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      border: `1px solid ${colorSystem.border.light}`,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    },
    faqItemHover: {
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
      border: `1px solid ${colorSystem.border.medium}`,
    },
    questionButton: {
      width: '100%',
      padding: '1.5rem 2rem',
      border: 'none',
      backgroundColor: 'transparent',
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s ease',
    },
    questionText: {
      ...applyTextStyle('h5', false),
      color: colorSystem.text.primary,
      fontWeight: 600,
      margin: 0,
      flex: 1,
      paddingRight: '1rem',
    },
    expandIcon: {
      fontSize: '1.5rem',
      color: colorSystem.primary[600],
      transition: 'transform 0.3s ease',
      transform: 'rotate(0deg)',
    },
    expandIconOpen: {
      transform: 'rotate(180deg)',
    },
    answerContainer: {
      maxHeight: '0',
      overflow: 'hidden',
      transition: 'max-height 0.3s ease',
    },
    answerContainerOpen: {
      maxHeight: '500px',
    },
    answerText: {
      ...applyTextStyle('body', false),
      padding: '0 2rem 2rem 2rem',
      color: colorSystem.text.secondary,
      lineHeight: 1.6,
      margin: 0,
    },
    // Mobile responsive styles
    mobileSection: {
      padding: '4rem 4vw',
    },
    mobileHeading: {
      ...applyTextStyle('h2', true),
      marginBottom: '2rem',
    },
    mobileQuestionButton: {
      padding: '1.2rem 1.5rem',
    },
    mobileQuestionText: {
      ...applyTextStyle('h5', true),
      fontSize: '1rem',
    },
    mobileAnswerText: {
      ...applyTextStyle('body', true),
      padding: '0 1.5rem 1.5rem 1.5rem',
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section style={{
      ...styles.section,
      ...(isMobile ? styles.mobileSection : {})
    }}>
      <h2 style={{
        ...styles.heading,
        ...(isMobile ? styles.mobileHeading : {})
      }}>
        Frequently Asked Questions
      </h2>
      
      <div style={styles.faqContainer}>
        {faqData.map((faq, index) => (
          <div
            key={index}
            style={styles.faqItem}
            onMouseEnter={(e) => {
              if (!isMobile) {
                Object.assign(e.currentTarget.style, styles.faqItemHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                Object.assign(e.currentTarget.style, styles.faqItem);
              }
            }}
          >
            <button
              style={{
                ...styles.questionButton,
                ...(isMobile ? styles.mobileQuestionButton : {})
              }}
              onClick={() => toggleItem(index)}
            >
              <h3 style={{
                ...styles.questionText,
                ...(isMobile ? styles.mobileQuestionText : {})
              }}>
                {faq.question}
              </h3>
              <span style={{
                ...styles.expandIcon,
                ...(openItems[index] ? styles.expandIconOpen : {})
              }}>
                ▼
              </span>
            </button>
            
            <div style={{
              ...styles.answerContainer,
              ...(openItems[index] ? styles.answerContainerOpen : {})
            }}>
              <p style={{
                ...styles.answerText,
                ...(isMobile ? styles.mobileAnswerText : {})
              }}>
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
