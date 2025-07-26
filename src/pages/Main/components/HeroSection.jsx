import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { colors, spacing, typography } from '../../../styles/designTokens';

const HeroSection = () => {
  const words = ['Boring', 'Outdated', 'Theoretical', 'Expensive'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive breakpoint detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const typingSpeed = isDeleting ? 40 : 80;
    const pauseTime = isDeleting ? 200 : 800;

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText((prev) => prev.slice(0, -1));
        if (displayText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
        if (displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes blink {
        0%, 100% { border-color: transparent; }
        50% { border-color: #000; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const getColorByWord = (word) => {
    switch (word) {
      case 'Boring': return colors.brand.red;
      case 'Outdated': return colors.brand.orange;
      case 'Theoretical': return colors.brand.teal;
      case 'Expensive': return colors.brand.blue;
      default: return colors.text.primary;
    }
  };

  const sectionStyle = {
    backgroundColor: colors.brand.lightBlue,
    minHeight: isMobile ? '100vh' : '100vh',
    padding: isMobile ? '1vh 4vw' : '2vh 2vw',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
  };

  const textRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMobile ? 'center' : 'flex-start',
    width: '100%',
    paddingLeft: isMobile ? '0' : '1vw',
    flexDirection: isMobile ? 'column' : 'row',
    textAlign: isMobile ? 'center' : 'left',
    gap: isMobile ? spacing.sm : 0,
  };

  const staticTextStyle = {
    fontSize: isMobile ? 'clamp(2rem, 6vw, 3rem)' : 'clamp(3rem, 8vw, 7rem)',
    fontWeight: typography.fontWeight.bold,
    marginRight: isMobile ? 0 : spacing.md,
    color: colors.text.primary,
    lineHeight: 1.2,
  };

  const animatedTextStyle = {
    fontSize: isMobile ? 'clamp(1.5rem, 5vw, 2.5rem)' : 'clamp(2rem, 6vw, 5rem)',
    fontWeight: typography.fontWeight.bold,
    minWidth: isMobile ? '8rem' : '10rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    borderRight: '2px solid #333',
    animation: 'blink 0.75s step-end infinite',
    textAlign: isMobile ? 'center' : 'left',
  };

  return (
    <section style={sectionStyle}>
      <Navbar />
      <div style={textRowStyle}>
        <div style={staticTextStyle}>Schooling is</div>
        <div 
          style={{
            ...animatedTextStyle,
            color: getColorByWord(words[currentWordIndex])
          }}
        >
          {displayText}
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 