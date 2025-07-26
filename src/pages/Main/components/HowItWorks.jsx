import React, { useEffect, useState, useRef } from 'react';

const HowItWorks = () => {
  const containerRef = useRef(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  
  const steps = [
    {
      icon: '🌟',
      title: '1. Choose the Wonder',
      description:
        'Pick a weekly theme or let our experts suggest one — based on your child\'s age, mood, or curiosity.',
    },
    {
      icon: '📦',
      title: '2. Get the Magic Box',
      description:
        'We send playful kits filled with hands-on ideas, stories, and surprises straight to your doorstep.',
    },
    {
      icon: '🧩',
      title: '3. Play When Ready',
      description:
        'Open the box anytime — everything\'s designed to fit into your schedule, with no pressure.',
    },
    {
      icon: '🌱',
      title: '4. Watch Them Bloom',
      description:
        'Your child dives into joyful learning through guided play, daily wonders, and creative exploration.',
    },
    {
      icon: '📊',
      title: '5. See the Spark Grow',
      description:
        'Track your child\'s milestones and little wins in a personal growth dashboard made just for them.',
    },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementHeight = rect.height;

        const scrollStart = windowHeight; // when it starts to appear
        const scrollEnd = windowHeight + elementHeight; // when it ends

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

  const timelineStyles = {
    container: {
      backgroundColor: '#f7f7f7',
      padding: '5vh 5vw',
    },
    heading: {
      textAlign: 'center',
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '3rem',
      color: '#333',
    },
    timelineWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      position: 'relative',
      paddingLeft: '3rem',
    },
    stepsColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      width: '65%',
      paddingRight: '3rem',
    },
    lineColumn: {
      position: 'relative',
      width: '35px',
      minHeight: '100%',
    },
    verticalLine: {
      position: 'absolute',
      left: '50%',
      top: 0,
      bottom: 0,
      width: '4px',
      backgroundColor: '#ccc',
      transform: 'translateX(-50%)',
      zIndex: 1,
    },
    brain: {
      position: 'absolute',
      transform: 'translate(-50%, 0)',
      fontSize: '4rem',
      transition: 'transform 0.2s ease-out, filter 0.2s ease-out',
      zIndex: 4,
      filter: `grayscale(${1 - scrollPercent})`,
    },
    stepBox: {
      backgroundColor: '#fdf6ec',
      borderRadius: '1rem',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      border: '4px solid #ccc',
      transition: 'border-color 0.3s ease',
      height: 'auto',
      width: '100%',
    },
    stepIcon: {
      fontSize: '2.5rem',
      marginBottom: '0.5rem',
    },
    stepTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '0.5rem',
    },
    stepDescription: {
      fontSize: '1rem',
      color: '#555',
      lineHeight: '1.4',
    },
  };

  return (
    <div ref={containerRef} style={timelineStyles.container}>
      <h2 style={timelineStyles.heading}>How it Works</h2>
      <div style={timelineStyles.timelineWrapper}>
        <div style={timelineStyles.stepsColumn}>
          {steps.map((step, index) => (
            <div
              key={index}
              style={timelineStyles.stepBox}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = '#FF6347')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = '#ccc')
              }
            >
              <div style={timelineStyles.stepIcon}>{step.icon}</div>
              <h3 style={timelineStyles.stepTitle}>{step.title}</h3>
              <p style={timelineStyles.stepDescription}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
        <div style={timelineStyles.lineColumn}>
          <div style={timelineStyles.verticalLine}></div>
          <div
            style={{
              ...timelineStyles.brain,
              filter: `grayscale(${1 - scrollPercent})`,
              transform: `translateY(${scrollPercent * containerRef.current?.offsetHeight * 0.78}px)`
            }}
          >
            🧠
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 