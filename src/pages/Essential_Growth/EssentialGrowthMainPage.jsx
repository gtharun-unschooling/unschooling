// src/pages/EssentialGrowth/EssentialGrowthMainPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Swiper, SwiperSlide } from 'swiper/react';
// import SwiperCore, { Navigation } from 'swiper';
import { Navigation } from 'swiper/modules';  // <--- Notice '/modules' here
import SimpleBackButton from '../../components/ui/SimpleBackButton';
import PlayCreativityActivities from '../../components/PlayCreativityActivities';

import 'swiper/css';
import 'swiper/css/navigation';

// SwiperCore.use([Navigation]);

// 🌱 Hero Section
const HeroSection = () => {
  const sectionStyle = {
    background: 'linear-gradient(to right, #d1fae5, #ecfdf5)',
    padding: '5vh 5vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  const containerStyle = {
    maxWidth: '1200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3rem',
    margin: '0 auto',
  };

  const headingStyle = {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#047857',
    marginBottom: '1rem',
  };

  const paragraphStyle = {
    fontSize: '1.25rem',
    lineHeight: '1.8',
    color: '#065f46',
    maxWidth: '700px',
  };

  const iconBox = {
    width: '16rem',
    height: '16rem',
    backgroundColor: '#a7f3d0',
    borderRadius: '9999px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    fontSize: '5rem',
    color: '#047857',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={{ alignSelf: 'flex-start', marginBottom: '2rem' }}>
          <SimpleBackButton size="medium" />
        </div>
        <div>
          <h1 style={headingStyle}>Essential Growth</h1>
          <p style={paragraphStyle}>
            Essential Growth is your child's beautiful journey of building skills, habits, and inner strengths.
            It's about growing with joy, curiosity, and confidence — one little step at a time.
          </p>
        </div>
        <div style={iconBox}>🌱</div>
      </div>
    </section>
  );
};




// 🌟 Growth Pillars Section
const GrowthPillarsSection = ({ onPlayCreativityClick, onCognitiveSkillsClick }) => {
    const sectionStyle = {
      padding: '5vh 5vw',
      backgroundColor: '#f9fafb',
    };
  
    const headingStyle = {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '3rem',
      textAlign: 'center',
    };
  
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
    };
  
    const tileStyle = (bgColor) => ({
      backgroundColor: bgColor,
      padding: '2rem',
      borderRadius: '1.5rem',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.3s ease',
      textAlign: 'center',
    });
  
    const iconStyle = {
      width: '96px',
      height: '96px',
      marginBottom: '1rem',
    };
  
    const titleStyle = {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
    };
  
    const descStyle = {
      fontSize: '0.95rem',
      color: '#374151',
    };
  
    const pillars = [
      { title: 'Play & Creativity', color: '#fce7f3', icon: 'paint-palette', desc: 'Fuel imagination and joyful exploration.' },
      { title: 'Cognitive Skills', color: '#dbeafe', icon: 'brainstorm', desc: 'Sharpen thinking, memory, and decisions.' },
      { title: 'Physical & Social Play', color: '#d1fae5', icon: 'teamwork', desc: 'Boost strength and social bonds through play.' },
      { title: 'Language & Speech', color: '#fef3c7', icon: 'speech-bubble', desc: 'Enhance communication and vocabulary skills.' },
      { title: 'Learning Tools', color: '#ede9fe', icon: 'books', desc: 'Introduce creative and critical learning tools.' },
      { title: 'Nature & Exploration', color: '#fee2e2', icon: 'compass', desc: 'Connect deeply with nature and discoveries.' },
      { title: 'Mindfulness & Well-being', color: '#e0e7ff', icon: 'lotus', desc: 'Foster inner calm, resilience, and balance.' },
      { title: 'Music & Rhythm', color: '#ccfbf1', icon: 'musical-notes', desc: 'Ignite creativity through sounds and movement.' },
      { title: 'Visual Arts', color: '#ffedd5', icon: 'paint-brush', desc: 'Develop expression and creative storytelling.' },
      { title: 'Science & Innovation', color: '#cffafe', icon: 'physics', desc: 'Spark curiosity through scientific exploration.' },
      { title: 'Emotional Intelligence', color: '#ecfccb', icon: 'mental-health', desc: 'Grow self-awareness and empathy skills.' },
      { title: 'Cultural Awareness', color: '#ffe4e6', icon: 'global-citizen', desc: 'Celebrate diversity and global understanding.' },
      { title: 'Teamwork & Leadership', color: '#e0f2fe', icon: 'leadership', desc: 'Build cooperation and inspiring leadership skills.' },
      { title: 'Problem Solving & Logic', color: '#fef9c3', icon: 'logic', desc: 'Tackle challenges with smart thinking.' },
      { title: 'Health & Fitness', color: '#fae8ff', icon: 'fitness', desc: 'Boost physical wellness and daily energy.' },
      { title: 'Social Skills', color: '#d1fae5', icon: 'group', desc: 'Strengthen connection, empathy, and respect.' },
      { title: 'Fine Motor Skills', color: '#ede9fe', icon: 'puzzle', desc: 'Refine precision and hand-eye coordination.' },
      { title: 'Memory & Recall', color: '#fef08a', icon: 'mind-map', desc: 'Enhance remembering and quick thinking.' },
    ];
  
    return (
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Our Growth Pillars</h2>
        <div style={gridStyle}>
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              style={{
                ...tileStyle(pillar.color),
                cursor: (pillar.title === 'Play & Creativity' || pillar.title === 'Cognitive Skills') ? 'pointer' : 'default',
                transition: (pillar.title === 'Play & Creativity' || pillar.title === 'Cognitive Skills') ? 'all 0.3s ease' : 'none'
              }}
              onClick={pillar.title === 'Play & Creativity' ? onPlayCreativityClick : 
                      pillar.title === 'Cognitive Skills' ? onCognitiveSkillsClick : undefined}
              onMouseEnter={(pillar.title === 'Play & Creativity' || pillar.title === 'Cognitive Skills') ? (e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
              } : undefined}
              onMouseLeave={(pillar.title === 'Play & Creativity' || pillar.title === 'Cognitive Skills') ? (e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
              } : undefined}
            >
              <img
                src={`https://img.icons8.com/color/96/${pillar.icon}.png`}
                alt={pillar.title}
                style={iconStyle}
              />
              <h3 style={titleStyle}>{pillar.title}</h3>
              <p style={descStyle}>{pillar.desc}</p>
              {(pillar.title === 'Play & Creativity' || pillar.title === 'Cognitive Skills') && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#3b82f6'
                }}>
                  Click to explore activities →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };


// ✨ Why It Matters Section
const WhyItMattersSection = () => {
    const sectionStyle = {
      padding: '5vh 5vw',
      background: 'linear-gradient(to bottom, #ffffff, #f3f4f6)',
      textAlign: 'center',
    };
  
    const containerStyle = {
      maxWidth: '1000px',
      margin: '0 auto',
    };
  
    const headingStyle = {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '3rem',
    };
  
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '3rem',
    };
  
    const itemStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      textAlign: 'left',
    };
  
    const iconStyle = {
      fontSize: '3rem',
    };
  
    const textBlockStyle = {
      flex: 1,
    };
  
    const subHeadingStyle = {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
    };
  
    const paragraphStyle = {
      color: '#4b5563',
    };
  
    const isWideScreen = window.innerWidth >= 768;
    const extendedGridStyle = isWideScreen
      ? { ...gridStyle, gridTemplateColumns: '1fr 1fr' }
      : gridStyle;
  
    return (
      <section style={sectionStyle}>
        <div style={containerStyle}>
          <h2 style={headingStyle}>Why It Matters</h2>
          <div style={extendedGridStyle}>
            {[
              {
                icon: '🌟',
                title: 'Every child carries a spark.',
                text: 'A dream, a curiosity, a strength — ready to shine.',
              },
              {
                icon: '🛠️',
                title: "Growth doesn't happen by chance.",
                text: 'It needs the right tools, at the right time.',
              },
              {
                icon: '🚀',
                title: 'Empower fearless growth.',
                text: 'Essential Growth helps children think bravely, create freely, and connect deeply.',
              },
              {
                icon: '🌱',
                title: 'Small steps, lifelong impact.',
                text: 'Tiny seeds today bloom into strength, joy, and resilience tomorrow.',
              },
              {
                icon: '❤️',
                title: "Your child's journey starts with you.",
                text: "And every moment counts. Let's build their tomorrow today.",
                spanTwo: true,
              },
            ].map(({ icon, title, text, spanTwo }, index) => (
              <div
                key={index}
                style={{
                  ...itemStyle,
                  gridColumn: spanTwo && isWideScreen ? 'span 2' : undefined,
                  justifyContent: spanTwo && isWideScreen ? 'center' : 'flex-start',
                }}
              >
                <div style={iconStyle}>{icon}</div>
                <div style={textBlockStyle}>
                  <h3 style={subHeadingStyle}>{title}</h3>
                  <p style={paragraphStyle}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

// 🔍 How It Works Section
const HowItWorksSection = () => {
    const sectionStyle = {
      backgroundColor: '#f9fafb',
      padding: '4rem 1.5rem',
    };
  
    const containerStyle = {
      maxWidth: '1280px',
      margin: '0 auto',
    };
  
    const headingStyle = {
      fontSize: '2.5rem',
      fontWeight: '700',
      textAlign: 'center',
      color: '#047857', // primary color
      marginBottom: '3rem',
    };
  
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      textAlign: 'center',
    };
  
    const stepStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    };
  
    const iconContainer = {
      width: '4rem',
      height: '4rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#d1fae5',
      borderRadius: '9999px',
      marginBottom: '1rem',
    };
  
    const iconStyle = {
      fontSize: '1.5rem',
      color: '#047857',
    };
  
    const titleStyle = {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#047857',
      marginBottom: '0.5rem',
    };
  
    const descStyle = {
      color: '#4b5563',
      fontSize: '0.875rem',
    };
  
    const steps = [
      {
        icon: '🎯',
        title: 'Define Goals',
        desc: 'Pick the skills your child will focus on each week.',
      },
      {
        icon: '📦',
        title: 'Receive Kits',
        desc: 'Get curated kits full of fun, hands-on activities.',
      },
      {
        icon: '🎲',
        title: 'Engage & Explore',
        desc: 'Enjoy active, playful learning every day at home.',
      },
      {
        icon: '🏆',
        title: 'Celebrate Wins',
        desc: 'Track achievements and celebrate every milestone!',
      },
    ];
  
    return (
      <section style={sectionStyle}>
        <div style={containerStyle}>
          <h2 style={headingStyle}>How It Works</h2>
          <div style={gridStyle}>
            {steps.map((step, index) => (
              <div key={index} style={stepStyle}>
                <div style={iconContainer}>
                  <span style={iconStyle}>{step.icon}</span>
                </div>
                <h3 style={titleStyle}>{step.title}</h3>
                <p style={descStyle}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
// 🎁 What You Get Section (Static version with inline styles)
const WhatYouGetSection = () => {
    const sectionStyle = {
      backgroundColor: '#fff',
      padding: '4rem 2rem',
    };
  
    const containerStyle = {
      maxWidth: '1120px',
      margin: '0 auto',
      textAlign: 'center',
    };
  
    const headingStyle = {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#047857',
      marginBottom: '2rem',
    };
  
    const scrollContainer = {
      display: 'flex',
      overflowX: 'auto',
      gap: '1rem', // decreased gap
      scrollSnapType: 'x mandatory',
      paddingBottom: '1rem',
  
      // Hide scrollbar for WebKit browsers
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none', // IE 10+
    };
  
    // Hide scrollbar for WebKit browsers
    const scrollContainerWrapper = {
      overflow: 'hidden',
    };
  
    const tileStyle = {
      flex: '0 0 33.33%', // 3 tiles visible
      scrollSnapAlign: 'start',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'grab',
      height: '230px', // increased height
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      borderRadius: '0.75rem',
    };
  
    const tileHoverStyle = {
      transform: 'scale(1.05)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
      zIndex: 10,
    };
  
    const imageStyle = {
      width: '100%',
      maxWidth: '280px',
      height: '180px', // increased height
      objectFit: 'cover',
      borderRadius: '0.75rem',
      marginBottom: '0.75rem',
    };
  
    const titleStyle = {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#047857',
      userSelect: 'none',
    };
  
    const items = [
      { title: 'Books', image: 'https://via.placeholder.com/280x180?text=Books' },
      { title: 'Toys', image: 'https://via.placeholder.com/280x180?text=Toys' },
      { title: 'Activities', image: 'https://via.placeholder.com/280x180?text=Activities' },
      { title: 'Kits', image: 'https://via.placeholder.com/280x180?text=Kits' },
      { title: 'Games', image: 'https://via.placeholder.com/280x180?text=Games' },
      { title: 'Puzzles', image: 'https://via.placeholder.com/280x180?text=Puzzles' },
      { title: 'DIY Activities', image: 'https://via.placeholder.com/280x180?text=DIY+Activities' },
      { title: 'Creative Crafts', image: 'https://via.placeholder.com/280x180?text=Creative+Crafts' },
      { title: 'Learning Tools', image: 'https://via.placeholder.com/280x180?text=Learning+Tools' },
    ];
  
    // React state to track hovered tile
    const [hoveredIndex, setHoveredIndex] = React.useState(null);
  
    return (
      <section style={sectionStyle}>
        <div style={containerStyle}>
          <h2 style={headingStyle}>What You Get</h2>
          <div style={scrollContainerWrapper}>
            <div
              style={scrollContainer}
              // Hide scrollbar in inline styles via CSS below
              className="no-scrollbar"
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    ...tileStyle,
                    ...(hoveredIndex === index ? tileHoverStyle : {}),
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <img src={item.image} alt={item.title} style={imageStyle} />
                  <div style={titleStyle}>{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Extra CSS for scrollbar hiding (needed for WebKit) */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </section>
    );
  };
  
  
// 🎯 Final Call To Action Section
const FinalCallToAction = () => {
    const sectionStyle = {
      padding: '5rem 2rem',
      background: 'linear-gradient(to right, #bbf7d0, #bfdbfe)',
      textAlign: 'center',
    };
  
    const containerStyle = {
      maxWidth: '768px',
      margin: '0 auto',
    };
  
    const headingStyle = {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      color: '#166534',
    };
  
    const buttonStyle = {
      padding: '1rem 2.5rem',
      backgroundColor: '#16a34a',
      color: '#fff',
      borderRadius: '9999px',
      fontSize: '1.125rem',
      fontWeight: '600',
      textDecoration: 'none',
      display: 'inline-block',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    };
  
    const buttonHoverStyle = {
      backgroundColor: '#15803d',
    };
  
    // Optional: simple hover effect using React useState
    const [hover, setHover] = React.useState(false);
  
    return (
      <section style={sectionStyle}>
        <div style={containerStyle}>
          <h2 style={headingStyle}>Begin Your Essential Growth Journey Today</h2>
          <a
            href="https://unschooling.in/plans"
            style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Explore Now
          </a>
        </div>
      </section>
    );
  };
  
  
  
  // ✅ Main Page that combines all sections
  const EssentialGrowthMainPage = () => {
    const navigate = useNavigate();

    const handlePlayCreativityClick = () => {
      navigate('/essential-growth/play-creativity');
    };

    const handleCognitiveSkillsClick = () => {
      navigate('/essential-growth/cognitive-skills');
    };

    return (
      <div>
        <HeroSection />
        <GrowthPillarsSection onPlayCreativityClick={handlePlayCreativityClick} onCognitiveSkillsClick={handleCognitiveSkillsClick} />
        <WhyItMattersSection />
        <HowItWorksSection />
        <PlayCreativitySection onPlayCreativityClick={handlePlayCreativityClick} />
        <WhatYouGetSection />
        <FinalCallToAction />
      </div>
    );
  };

// 🎨 Play & Creativity Section
const PlayCreativitySection = ({ onPlayCreativityClick }) => {
  const sectionStyle = {
    padding: '6vh 5vw',
    backgroundColor: '#fce7f3',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#be185d',
    marginBottom: '2rem',
  };

  const descriptionStyle = {
    fontSize: '1.25rem',
    color: '#6b7280',
    marginBottom: '3rem',
    maxWidth: '600px',
    margin: '0 auto 3rem auto',
  };

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  };

  const statCardStyle = {
    backgroundColor: '#fef7ff',
    borderRadius: '0.75rem',
    padding: '2rem',
    border: '1px solid #e879f9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  };

  const statNumberStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#be185d',
    marginBottom: '0.5rem',
  };

  const statLabelStyle = {
    color: '#6b7280',
    fontWeight: '600',
  };

  const buttonStyle = {
    padding: '1rem 2rem',
    backgroundColor: '#be185d',
    color: '#fff',
    border: 'none',
    borderRadius: '2rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(190, 24, 93, 0.3)',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={headingStyle}>🎨 Play & Creativity</h2>
        <p style={descriptionStyle}>
          Fuel imagination and joyful exploration through hands-on activities and creative expression
        </p>
        
        <div style={statsStyle}>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>40+</div>
            <div style={statLabelStyle}>Activities</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>8</div>
            <div style={statLabelStyle}>Categories</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>2</div>
            <div style={statLabelStyle}>Age Groups</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>∞</div>
            <div style={statLabelStyle}>Creativity</div>
          </div>
        </div>

        <button 
          style={buttonStyle}
          onClick={onPlayCreativityClick}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(190, 24, 93, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(190, 24, 93, 0.3)';
          }}
        >
          Explore All Activities →
        </button>
      </div>
    </section>
  );
};



export default EssentialGrowthMainPage;

