import React, { useEffect, useState, useRef } from 'react';
import { applyTextStyle } from '../../../styles/typography';
import { colorSystem } from '../../../styles/colors';

const HowItWorks = () => {
  const containerRef = useRef(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const ladderSteps = [
    {
      icon: '🌟',
      title: '1. Choose the Wonder',
      description: 'Pick a weekly theme or let our experts suggest one — based on your child\'s age, mood, or curiosity.',
      color: colorSystem.luxury.emerald[100],
    },
    {
      icon: '📦',
      title: '2. Get the Magic Box',
      description: 'We send playful kits filled with hands-on ideas, stories, and surprises straight to your doorstep.',
      color: colorSystem.luxury.sapphire[100],
    },
    {
      icon: '🧩',
      title: '3. Play When Ready',
      description: 'Open the box anytime — everything\'s designed to fit into your schedule, with no pressure.',
      color: colorSystem.luxury.purple[100],
    },
    {
      icon: '🌱',
      title: '4. Watch Them Bloom',
      description: 'Your child dives into joyful learning through guided play, daily wonders, and creative exploration.',
      color: colorSystem.luxury.rose[100],
    },
    {
      icon: '📊',
      title: '5. See the Spark Grow',
      description: 'Track your child\'s milestones and little wins in a personal growth dashboard made just for them.',
      color: colorSystem.luxury.amber[100],
    },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementHeight = rect.height;

        const scrollStart = windowHeight;
        const scrollEnd = windowHeight + elementHeight;

        const percent = Math.min(
          1,
          Math.max(0, (scrollEnd - rect.top) / (scrollEnd - scrollStart))
        );
        setScrollPercent(percent);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ladderStyles = {
    container: {
      background: `linear-gradient(135deg, ${colorSystem.background.primary} 0%, ${colorSystem.background.secondary} 100%)`,
      padding: '3rem 5vw',
      minHeight: 'auto',
      position: 'relative',
      overflow: 'hidden',
    },
    heading: {
      ...applyTextStyle('h2', false),
      textAlign: 'center',
      marginBottom: '2rem',
      color: colorSystem.text.primary,
      position: 'relative',
      zIndex: 2,
    },
    ladderWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      position: 'relative',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    // Removed ladder rail - no vertical line
    stepsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      position: 'relative',
      zIndex: 2,
    },
    stepRung: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1.5rem',
      padding: '1.5rem 2rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'translateY(0)',
      width: '500px',
      minHeight: '80px',
      // Staircase effect - each step is slightly offset
      marginLeft: '0px',
    },
    stepRungHover: {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    stepIcon: {
      fontSize: '3rem',
      marginRight: '1.5rem',
      padding: '0.8rem',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.9)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
    },
    stepContent: {
      flex: 1,
    },
    stepTitle: {
      ...applyTextStyle('h3', false),
      marginBottom: '0.5rem',
      color: colorSystem.text.primary,
      fontWeight: 700,
      fontSize: '1.2rem',
    },
    stepDescription: {
      ...applyTextStyle('body', false),
      color: colorSystem.text.secondary,
      lineHeight: 1.4,
      fontSize: '1rem',
    },
    // Removed ladder connector - no horizontal dashes
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 20%, ${colorSystem.luxury.amber[50]} 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, ${colorSystem.luxury.purple[50]} 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, ${colorSystem.luxury.emerald[50]} 0%, transparent 50%)
      `,
      opacity: 0.6,
      zIndex: 0,
    },
    // Mobile responsive styles
    mobileContainer: {
      padding: '2rem 2vw',
      minHeight: 'auto',
    },
    mobileStepRung: {
      width: '90vw',
      maxWidth: '400px',
      padding: '1.2rem 1.5rem',
      flexDirection: 'column',
      textAlign: 'center',
      gap: '0.6rem',
      minHeight: '70px',
    },
    // Removed mobile ladder rail
    mobileStepsContainer: {
      marginLeft: '4rem',
      gap: '1.5rem',
    },
    mobileStepIcon: {
      fontSize: '3rem',
      marginRight: '0',
      marginBottom: '0.6rem',
    },
    mobileHeading: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
    },
  };

  return (
    <div 
      ref={containerRef} 
      style={{
        ...ladderStyles.container,
        ...(isMobile ? ladderStyles.mobileContainer : {})
      }}
    >
      <div style={ladderStyles.backgroundPattern} />
      <h2 style={{
        ...ladderStyles.heading,
        ...(isMobile ? ladderStyles.mobileHeading : {})
      }}>
        How it Works
      </h2>
      <div style={ladderStyles.ladderWrapper}>
        <div style={{
          ...ladderStyles.stepsContainer,
          ...(isMobile ? ladderStyles.mobileStepsContainer : {})
        }}>
          {ladderSteps.map((step, index) => (
            <div
              key={index}
              style={{
                ...ladderStyles.stepRung,
                ...(isMobile ? ladderStyles.mobileStepRung : {}),
                background: step.color,
                // Create staircase effect - first step further left, others offset to the right
                marginLeft: !isMobile ? (index === 0 ? '-60px' : `${index * 20}px`) : '0px',
                transform: !isMobile ? (index === 0 ? 'translateX(-30px)' : `translateX(${index * 10}px)`) : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  Object.assign(e.currentTarget.style, ladderStyles.stepRungHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = `translateY(0) scale(1) translateX(${index * 10}px)`;
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                }
              }}
            >
              <div style={{
                ...ladderStyles.stepIcon,
                ...(isMobile ? ladderStyles.mobileStepIcon : {})
              }}>
                {step.icon}
              </div>
              <div style={ladderStyles.stepContent}>
                <h3 style={ladderStyles.stepTitle}>{step.title}</h3>
                <p style={ladderStyles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 