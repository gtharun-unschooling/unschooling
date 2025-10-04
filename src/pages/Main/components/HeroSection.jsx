import React, { useEffect, useState } from 'react';
import { colors, spacing, typography } from '../../../styles/designTokens';
import { applyTextStyle } from '../../../styles/typography';
import { colorSystem } from '../../../styles/colors';
import unifiedDesignSystem from '../../../styles/unifiedDesignSystem';

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
        50% { border-color: ${colorSystem.text.primary}; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const getColorByWord = (word) => {
    switch (word) {
      case 'Boring': return colorSystem.semantic.error[600];
      case 'Outdated': return colorSystem.semantic.warning[600];
      case 'Theoretical': return colorSystem.semantic.info[600];
      case 'Expensive': return colorSystem.primary[600];
      default: return colorSystem.text.primary;
    }
  };

  // ========================================
  // UNIFIED DESIGN SYSTEM STYLES
  // ========================================
  const heroVariant = unifiedDesignSystem.sectionVariants.hero;
  
  const desktopSectionStyle = {
    background: heroVariant.background,
    minHeight: '100vh',
    padding: '2vh 2vw',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const desktopTextRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: '1vw',
    flexDirection: 'row',
    textAlign: 'left',
    gap: 0,
  };

  const desktopStaticTextStyle = {
    ...applyTextStyle('h1', false),
    fontSize: 'clamp(3rem, 8vw, 7rem)',
    marginRight: spacing.md,
    color: heroVariant.textColor,
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
  };

  const desktopAnimatedTextStyle = {
    ...applyTextStyle('h1', false),
    fontSize: 'clamp(2rem, 6vw, 5rem)',
    minWidth: '10rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    borderRight: `2px solid ${heroVariant.textColor}`,
    animation: 'blink 0.75s step-end infinite',
    textAlign: 'left',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
  };

  // ========================================
  // MOBILE STYLES (below 768px)
  // ========================================
  const mobileSectionStyle = {
    backgroundColor: colors.brand.lightBlue,
    minHeight: '100vh',
    padding: '2vh 8vw', // Increased padding for better spacing
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
  };

  const mobileTextRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingLeft: '0',
    flexDirection: 'column',
    textAlign: 'center',
    gap: '1.5rem', // Increased gap between text elements
  };

  const mobileStaticTextStyle = {
    ...applyTextStyle('h1', true),
    fontSize: 'clamp(3.5rem, 9vw, 5rem)', // Significantly increased text size
    marginRight: 0,
    fontWeight: '700',
    lineHeight: '1.1',
  };

  const mobileAnimatedTextStyle = {
    ...applyTextStyle('h1', true),
    fontSize: 'clamp(3rem, 8vw, 4.5rem)', // Significantly increased animated text size
    minWidth: '10rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    borderRight: `3px solid ${colorSystem.text.primary}`, // Thicker cursor
    animation: 'blink 0.75s step-end infinite',
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: '1.1',
  };

  // ========================================
  // CONDITIONAL STYLES
  // ========================================
  const sectionStyle = isMobile ? mobileSectionStyle : desktopSectionStyle;
  const textRowStyle = isMobile ? mobileTextRowStyle : desktopTextRowStyle;
  const staticTextStyle = isMobile ? mobileStaticTextStyle : desktopStaticTextStyle;
  const animatedTextStyle = isMobile ? mobileAnimatedTextStyle : desktopAnimatedTextStyle;

  return (
    <section className="hero-section" style={sectionStyle}>
        {/* Background Pattern */}
        <div className="hero-pattern" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: heroVariant.pattern,
          pointerEvents: 'none'
        }}></div>
        
        <div className="hero-text-container" style={textRowStyle}>
          <div className="hero-static-text" style={staticTextStyle}>Schooling is</div>
          <div
            className="hero-animated-text"
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