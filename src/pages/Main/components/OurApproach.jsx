import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, Text, Card, Flex, Container, Section } from '../../../components/ui/StyledComponents';
import { colors, spacing, typography } from '../../../styles/designTokens';
import { applyTextStyle } from '../../../styles/typography';
import { colorSystem } from '../../../styles/colors';
import config from '../../../config/config';

const DEFAULT_ICON = '🌟';

// Complete icon mapping for all 63 niches
const getNicheIcon = (nicheTitle) => {
  const iconMap = {
    'Finance': '💰',
    'Communication': '💬',
    'AI': '🤖',
    'Entrepreneurship': '🚀',
    'Dance': '💃',
    'Music': '🎵',
    'Nature Exploration': '🌿',
    'Travel': '✈️',
    'Coding & Programming': '💻',
    'Civics & Government': '🏛️',
    'History': '📚',
    'Fashion & Styling': '👗',
    'Arts & Crafts': '🎨',
    'Behavioral Science': '🧠',
    'General Science': '🔬',
    'Sports': '⚽',
    'Design Thinking & Creativity': '💡',
    'Photography & Videography': '📸',
    'Trading & Investments': '📈',
    'Games & Recreational Skills': '🎮',
    'Mathematics': '🔢',
    'Creative & Academic Writing': '✍️',
    'Social Media Literacy': '📱',
    'Educational Apps': '📲',
    'Teaching & Pedagogy': '👨‍🏫',
    'Children\'s Books': '📖',
    'Public Speaking & Debate': '🎤',
    'Electronics': '⚡',
    'Electrical Engineering Basics': '🔌',
    'Law & Legal Education': '⚖️',
    'Emotional Intelligence': '❤️',
    'Culture & Heritage': '🏛️',
    'Food & Nutrition': '🍎',
    'Health & Hygiene': '🏥',
    'Human Biology': '🧬',
    'Physical Fitness': '💪',
    'Leadership & Team Building': '👥',
    'Internet of Things (IoT)': '🌐',
    'Automobiles & Engineering': '🚗',
    'Sustainability & Environment': '🌍',
    'Spirituality & Devotion': '🕊️',
    'Robotics': '🤖',
    'Space Exploration': '🚀',
    'Renewable Energy': '⚡',
    'Cybersecurity': '🔒',
    'Marine Biology': '🐠',
    'Architecture & Design': '🏗️',
    'Psychology': '🧠',
    'Filmmaking': '🎬',
    'Cryptocurrency & Blockchain': '₿',
    'Agriculture & Soil Science': '🌱',
    'Supply Chain & Logistics': '📦',
    'Aerospace & Flight Sciences': '✈️',
    'Smart Urban Living': '🏙️',
    'Media Production & Broadcasting': '📺',
    'Content Creation': '📝',
    'Product Design & User Experience (UX)': '🎨',
    'Emergency Response & Safety Skills': '🚨',
    'Construction & Structural Engineering': '🏗️',
    'Tools & Machines Literacy': '🔧',
    'Ayurveda & Natural Healing': '🌿',
    'Applied Chemistry & Materials': '🧪',
    'Fundamental Physics & Forces': '⚛️'
  };
  return iconMap[nicheTitle] || DEFAULT_ICON;
};

// Premium luxury background colors for each niche
const getNicheBackgroundColor = (nicheTitle) => {
  const colorMap = {
    'Finance': colorSystem.luxury.emerald[50], // Very light emerald
    'Communication': colorSystem.luxury.purple[50], // Very light purple
    'AI': colorSystem.luxury.sapphire[50], // Very light sapphire
    'Entrepreneurship': colorSystem.luxury.amber[50], // Very light amber
    'Dance': colorSystem.luxury.rose[50], // Very light rose
    'Music': colorSystem.luxury.teal[50], // Very light teal
    'Nature Exploration': colorSystem.luxury.emerald[100], // Light emerald
    'Travel': colorSystem.luxury.sapphire[100], // Light sapphire
    'Coding & Programming': colorSystem.luxury.indigo[50], // Very light indigo
    'Civics & Government': colorSystem.luxury.coral[50], // Very light coral
    'History': colorSystem.luxury.purple[100], // Light purple
    'Fashion & Styling': colorSystem.luxury.rose[100], // Light rose
    'Arts & Crafts': colorSystem.luxury.coral[50], // Very light coral
    'Behavioral Science': colorSystem.neutral[50], // Very light gray
    'General Science': colorSystem.luxury.teal[100], // Light teal
    'Sports': colorSystem.luxury.amber[100], // Light amber
    'Design Thinking & Creativity': colorSystem.luxury.purple[100], // Light purple
    'Photography & Videography': colorSystem.luxury.sapphire[100], // Light sapphire
    'Trading & Investments': colorSystem.luxury.emerald[100], // Light emerald
    'Games & Recreational Skills': colorSystem.luxury.indigo[100], // Light indigo
    'Mathematics': colorSystem.luxury.amber[50], // Very light amber
    'Creative & Academic Writing': colorSystem.luxury.teal[50], // Very light teal
    'Social Media Literacy': colorSystem.luxury.rose[100], // Light rose
    'Educational Apps': colorSystem.luxury.sapphire[50], // Very light sapphire
    'Teaching & Pedagogy': colorSystem.primary[50], // Very light navy
    'Children\'s Books': colorSystem.luxury.coral[100], // Light coral
    'Public Speaking & Debate': colorSystem.luxury.purple[50], // Very light purple
    'Electronics': colorSystem.luxury.indigo[100], // Light indigo
    'Electrical Engineering Basics': colorSystem.luxury.sapphire[50], // Very light sapphire
    'Law & Legal Education': colorSystem.luxury.rose[50], // Very light rose
    'Emotional Intelligence': colorSystem.luxury.purple[100], // Light purple
    'Culture & Heritage': colorSystem.luxury.amber[50], // Very light amber
    'Food & Nutrition': colorSystem.luxury.emerald[50], // Very light emerald
    'Health & Hygiene': colorSystem.luxury.teal[100], // Light teal
    'Human Biology': colorSystem.luxury.emerald[100], // Light emerald
    'Physical Fitness': colorSystem.luxury.coral[100], // Light coral
    'Leadership & Team Building': colorSystem.luxury.indigo[50], // Very light indigo
    'Internet of Things (IoT)': colorSystem.luxury.sapphire[50], // Very light sapphire
    'Automobiles & Engineering': colorSystem.neutral[100], // Light gray
    'Sustainability & Environment': colorSystem.luxury.emerald[100], // Light emerald
    'Spirituality & Devotion': colorSystem.luxury.amber[100], // Light amber
    'Robotics': colorSystem.luxury.indigo[100], // Light indigo
    'Space Exploration': colorSystem.luxury.sapphire[100], // Light sapphire
    'Renewable Energy': colorSystem.luxury.amber[50], // Very light amber
    'Cybersecurity': colorSystem.luxury.rose[100], // Light rose
    'Marine Biology': colorSystem.luxury.emerald[100], // Light emerald
    'Architecture & Design': colorSystem.luxury.coral[100], // Light coral
    'Psychology': colorSystem.neutral[100], // Light gray
    'Filmmaking': colorSystem.luxury.sapphire[50], // Very light sapphire
    'Cryptocurrency & Blockchain': colorSystem.luxury.amber[100], // Light amber
    'Agriculture & Soil Science': colorSystem.luxury.emerald[50], // Very light emerald
    'Supply Chain & Logistics': colorSystem.luxury.purple[100], // Light purple
    'Aerospace & Flight Sciences': colorSystem.luxury.teal[100], // Light teal
    'Smart Urban Living': colorSystem.primary[100], // Light navy
    'Media Production & Broadcasting': colorSystem.luxury.rose[50], // Very light rose
    'Content Creation': colorSystem.luxury.coral[50], // Very light coral
    'Product Design & User Experience (UX)': colorSystem.luxury.amber[100], // Light amber
    'Emergency Response & Safety Skills': colorSystem.luxury.rose[50], // Very light rose
    'Construction & Structural Engineering': colorSystem.neutral[50], // Very light gray
    'Tools & Machines Literacy': colorSystem.luxury.indigo[50], // Very light indigo
    'Ayurveda & Natural Healing': colorSystem.luxury.emerald[50], // Very light emerald
    'Applied Chemistry & Materials': colorSystem.luxury.teal[100], // Light teal
    'Fundamental Physics & Forces': colorSystem.luxury.sapphire[50] // Very light sapphire
  };
  return colorMap[nicheTitle] || colorSystem.neutral[50]; // Default very light gray
};

// Premium luxury background colors for Essential Growth items
const getEssentialGrowthBackgroundColor = (growthTitle) => {
  const colorMap = {
    'Cognitive Development': colorSystem.luxury.sapphire[50],     // Very light sapphire
    'Physical Growth': colorSystem.luxury.emerald[50],           // Very light emerald
    'Emotional Intelligence': colorSystem.luxury.rose[50],       // Very light rose
    'Social Skills': colorSystem.luxury.purple[50],              // Very light purple
    'Creativity': colorSystem.luxury.amber[50],                  // Very light amber
    'Critical Thinking': colorSystem.luxury.indigo[50],          // Very light indigo
    'Focus & Attention': colorSystem.luxury.teal[50],            // Very light teal
    'Confidence Building': colorSystem.luxury.coral[50],         // Very light coral
    'Problem Solving': colorSystem.luxury.emerald[100],          // Light emerald
    'Resilience': colorSystem.luxury.purple[100],                // Light purple
  };
  return colorMap[growthTitle] || colorSystem.neutral[50]; // Default very light gray
};

const OurApproach = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  // Change visibleNiches to be a number, not boolean
  const [visibleNiches, setVisibleNiches] = useState(9);
  const [niches, setNiches] = useState([]);
  const navigate = useNavigate();

  // Responsive breakpoint detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch niches from API
  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/niches`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Ensure data is an array
        if (Array.isArray(data) && data.length > 0) {
          // Map the data to the expected structure
          const mapped = data
            .filter(n => n.Niche && n.Niche.length > 0)
            .map(n => ({
              icon: getNicheIcon(n.Niche), // Use specific icon for each niche
              title: n.Niche,
              color: n.Color || '#8884d8',
              gradient: n["Primary Color"] && n["Secondary Color"] ? `linear-gradient(135deg, ${n["Primary Color"]} 0%, ${n["Secondary Color"]} 100%)` : '#f8fafc',
              slug: n["Niche Slug"] || n.Niche.toLowerCase().replace(/\s+/g, '-'),
            }));
          setNiches(mapped);
        } else {
          throw new Error('API returned invalid data');
        }
      })
      .catch(err => {
        console.error('Error fetching niches:', err);
        console.log('🔄 Trying fallback to static file...');
        // Fallback to static file if API fails
        fetch('/nichesdata.json')
          .then(res => {
            console.log('📁 Fallback response status:', res.status);
            return res.json();
          })
          .then(data => {
            console.log('📁 Fallback data received:', data?.length || 0, 'items');
            const mapped = data
              .filter(n => n.Niche && n.Niche.length > 0)
              .map(n => ({
                icon: getNicheIcon(n.Niche), // Use specific icon for each niche
                title: n.Niche,
                color: n.Color || '#8884d8',
                gradient: n["Primary Color"] && n["Secondary Color"] ? `linear-gradient(135deg, ${n["Primary Color"]} 0%, ${n["Secondary Color"]} 100%)` : '#f8fafc',
                slug: n["Niche Slug"] || n.Niche.toLowerCase().replace(/\s+/g, '-'),
              }));
            console.log('✅ Niches mapped from fallback:', mapped.length);
            setNiches(mapped);
          })
          .catch(fallbackErr => {
            console.error('❌ Fallback also failed:', fallbackErr);
            // Set empty array as last resort
            setNiches([]);
          });
      });
  }, []);

  // Ensure niches is always an array before using slice
  const safeNiches = Array.isArray(niches) ? niches : [];
  const displayNiches = safeNiches.slice(0, visibleNiches);
  
  // Debug logging
  console.log('🔍 Niches state:', {
    niches: niches?.length || 0,
    safeNiches: safeNiches?.length || 0,
    displayNiches: displayNiches?.length || 0,
    visibleNiches
  });

  useEffect(() => {
    setVisibleNiches(9); // Always reset on mount
  }, []);

  const essentialGrowth = [
    {
      icon: '🧠',
      title: 'Cognitive Development',
      color: '#9B59B6',
      gradient: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)'
    },
    {
      icon: '💪',
      title: 'Physical Growth',
      color: '#E74C3C',
      gradient: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)'
    },
    {
      icon: '❤️',
      title: 'Emotional Intelligence',
      color: '#F39C12',
      gradient: 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)'
    },
    {
      icon: '🤝',
      title: 'Social Skills',
      color: '#3498DB',
      gradient: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)'
    },
    {
      icon: '🎨',
      title: 'Creativity',
      color: '#E91E63',
      gradient: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)'
    },
    {
      icon: '🔍',
      title: 'Critical Thinking',
      color: '#2ECC71',
      gradient: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)'
    },
    {
      icon: '🎯',
      title: 'Focus & Attention',
      color: '#F1C40F',
      gradient: 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)'
    },
    {
      icon: '🌟',
      title: 'Confidence Building',
      color: '#1ABC9C',
      gradient: 'linear-gradient(135deg, #1ABC9C 0%, #16A085 100%)'
    },
    {
      icon: '🧩',
      title: 'Problem Solving',
      color: '#8E44AD',
      gradient: 'linear-gradient(135deg, #8E44AD 0%, #9B59B6 100%)'
    },
    {
      icon: '🌱',
      title: 'Resilience',
      color: '#27AE60',
      gradient: 'linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)'
    }
  ];

  // Main description for Our Approach
  const shortDescription = "Where passion meets purpose. We blend specialized learning with essential growth to unlock every child's potential.";
  const fullDescription = shortDescription + ' Our unique approach combines hands-on projects, real-world skills, and a nurturing environment to help every child discover their strengths and passions. With guidance from experts and a focus on holistic development, we ensure that learning is joyful, meaningful, and tailored to each child.';

  const sectionStyle = {
    backgroundColor: colorSystem.background.secondary,
    padding: isMobile ? `${spacing.lg} 0` : `${spacing.xl} 0`,
    position: 'relative',
    overflow: 'hidden',
  };

  const backgroundPattern = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.08) 0%, transparent 50%)',
    pointerEvents: 'none',
  };

  const mainContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: isMobile ? '16px' : '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    padding: isMobile ? spacing.lg : spacing['3xl'],
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  };

  const containerBackground = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
    borderRadius: isMobile ? '16px' : '24px',
  };

  const cardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    '&:hover': {
      transform: isMobile ? 'none' : 'translateY(-4px) scale(1.02)',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
    },
  };

  const cardBackground = (gradient) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: gradient,
    opacity: 0.08,
    transition: 'opacity 0.3s ease',
  });

  const iconContainerStyle = (color) => ({
    width: isMobile ? '45px' : '55px',
    height: isMobile ? '45px' : '55px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isMobile ? '1.4rem' : '1.6rem',
    marginBottom: isMobile ? spacing.sm : spacing.md,
    boxShadow: `0 6px 20px ${color}50, 0 2px 8px ${color}30`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    zIndex: 2,
  });

  const titleStyle = {
    fontSize: isMobile ? '0.8rem' : 'clamp(0.9rem, 1.8vw, 1.1rem)',
    fontWeight: 600,
    color: colors.text.primary,
    marginBottom: 0,
    position: 'relative',
    zIndex: 2,
    lineHeight: 1.3,
  };

  const sectionTitleStyle = {
    ...applyTextStyle('h2', isMobile),
    textAlign: 'center',
    marginBottom: isMobile ? spacing.sm : spacing.md,
    position: 'relative',
  };

  const sectionSubtitleStyle = {
    ...applyTextStyle('lead', isMobile),
    textAlign: 'center',
    maxWidth: isMobile ? '100%' : '500px',
    margin: '0 auto',
    marginBottom: isMobile ? spacing.md : spacing.lg,
    padding: isMobile ? `0 ${spacing.md}` : 0,
  };

  const columnTitleStyle = {
    ...applyTextStyle('h4', isMobile),
    marginBottom: isMobile ? spacing.md : spacing.lg,
    textAlign: 'center',
  };

  return (
    <Section style={sectionStyle}>
      <div style={backgroundPattern}></div>
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Flex direction="column" align="center" style={{ marginBottom: isMobile ? spacing.md : spacing.lg }}>
          <Heading 
            level={1} 
            style={sectionTitleStyle}
          >
            Our Approach
          </Heading>
          <Text 
            variant="body" 
            style={sectionSubtitleStyle}
          >
            Where passion meets purpose. We blend specialized learning with essential growth to unlock every child's potential.
          </Text>
        </Flex>
        {/* Main Container Box */}
        <div style={mainContainerStyle}>
          <div style={containerBackground}></div>
          {/* Responsive Layout */}
          <Flex 
            direction="column"
            gap={isMobile ? spacing.lg : spacing.xl}
            style={{ 
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Niches Column */}
            <Flex direction="column" style={{ 
              width: '100%',
              maxWidth: '100%'
            }}>
              <Heading level={2} style={columnTitleStyle}>
                Niches
              </Heading>
              <Text 
                style={{
                  textAlign: 'center',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  color: '#6b7280',
                  fontWeight: '500',
                }}
              >
                Various niches available - choose what interests your child
              </Text>
              <Flex 
                direction="row" 
                wrap={true} 
                gap={isMobile ? spacing.sm : spacing.md}
                style={{ 
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  flexWrap: 'wrap',
                  maxWidth: '100%',
                }}
              >
                {displayNiches.length === 0 ? (
                  <div style={{ 
                    gridColumn: '1 / -1', 
                    textAlign: 'center', 
                    padding: '2rem',
                    color: '#666'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
                    <div>Loading niches...</div>
                  </div>
                ) : (
                  displayNiches.map((niche, index) => (
                  <Card 
                    key={index} 
                    variant="elevated"
                    style={{
                      ...cardStyle,
                      // Fixed consistent size for all niche boxes
                      width: isMobile ? '90px' : '110px',
                      height: isMobile ? '110px' : '130px',
                      flex: '0 0 auto', // Don't grow or shrink
                      backgroundColor: getNicheBackgroundColor(niche.title),
                      padding: isMobile ? '12px' : '16px',
                      borderRadius: '16px',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => {
                      console.log('🎯 Clicked on niche:', niche.title, 'navigating to:', `/niche/${niche.slug}`);
                      navigate(`/niche/${niche.slug}`);
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = 'translateY(-6px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.18), 0 8px 20px rgba(0, 0, 0, 0.12)';
                        e.currentTarget.querySelector('.card-bg').style.opacity = '0.2';
                        e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)';
                        e.currentTarget.querySelector('.card-bg').style.opacity = '0.08';
                        e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <div className="card-bg" style={cardBackground(niche.gradient)}></div>
                    
                    <div className="icon-container" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: isMobile ? '40px' : '50px',
                      height: isMobile ? '40px' : '50px',
                      borderRadius: '50%',
                      marginBottom: '8px',
                      transition: 'transform 0.3s ease',
                      fontSize: isMobile ? '24px' : '28px',
                    }}>
                      {niche.icon}
                    </div>
                    <Heading 
                      level={5} 
                      style={{
                        textAlign: 'center',
                        fontSize: isMobile ? '0.7rem' : '0.8rem',
                        fontWeight: 600,
                        color: colors.text.primary,
                        lineHeight: 1.2,
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      {niche.title}
                    </Heading>
                  </Card>
                ))
                )}
                {visibleNiches < safeNiches.length && (
                  <Card
                    key="show-more-tile"
                    variant="elevated"
                    style={{
                      // Same fixed size as other niche boxes
                      width: isMobile ? '90px' : '110px',
                      height: isMobile ? '110px' : '130px',
                      flex: '0 0 auto',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      padding: isMobile ? '12px' : '16px',
                      borderRadius: '16px',
                      boxShadow: '0 8px 25px rgba(102,126,234,0.25), 0 4px 12px rgba(102,126,234,0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onClick={() => setVisibleNiches(prev => Math.min(prev + 20, safeNiches.length))}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = 'translateY(-6px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 16px 40px rgba(102,126,234,0.35), 0 8px 20px rgba(102,126,234,0.25)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(102,126,234,0.25), 0 4px 12px rgba(102,126,234,0.15)';
                      }
                    }}
                  >
                    <div style={{ 
                      fontSize: isMobile ? '32px' : '36px', 
                      marginBottom: '8px',
                      fontWeight: 300,
                      opacity: 0.9
                    }}>+</div>
                    <Heading level={5} style={{ 
                      color: '#fff',
                      textAlign: 'center',
                      fontSize: isMobile ? '0.7rem' : '0.8rem',
                      fontWeight: 600,
                      margin: 0,
                      padding: 0,
                      lineHeight: 1.2,
                    }}>
                      More
                    </Heading>
                  </Card>
                )}
              </Flex>
              {safeNiches.length > 9 && (
                <button
                  style={{
                    margin: isMobile ? '1rem auto' : '1.5rem auto',
                    display: 'block',
                    padding: '0.5rem 1.2rem',
                    fontSize: '1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: '#764ba2',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(118,75,162,0.15)',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => navigate('/niche')}
                >
                  Explore more
                </button>
              )}
            </Flex>

            {/* Essential Growth Column */}
            <Flex direction="column" style={{ 
              width: '100%',
              maxWidth: '100%'
            }}>
              <Heading level={2} style={columnTitleStyle}>
                Essential Growth
              </Heading>
              <Flex 
                direction="row" 
                wrap={true} 
                gap={isMobile ? spacing.xs : spacing.xs}
                style={{ 
                  justifyContent: 'center',
                  alignItems: 'stretch',
                }}
              >
                {essentialGrowth.map((growth, index) => (
                  <Card 
                    key={index} 
                    variant="elevated"
                    style={{
                      ...cardStyle,
                      // Fixed consistent size for all essential growth boxes
                      width: isMobile ? '90px' : '110px',
                      height: isMobile ? '110px' : '130px',
                      flex: '0 0 auto', // Don't grow or shrink
                      backgroundColor: getEssentialGrowthBackgroundColor(growth.title),
                      padding: isMobile ? '12px' : '16px',
                      borderRadius: '16px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = 'translateY(-6px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.18), 0 8px 20px rgba(0, 0, 0, 0.12)';
                        e.currentTarget.querySelector('.card-bg').style.opacity = '0.2';
                        e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)';
                        e.currentTarget.querySelector('.card-bg').style.opacity = '0.08';
                        e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <div className="card-bg" style={cardBackground(growth.gradient)}></div>
                    
                    <div className="icon-container" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: isMobile ? '40px' : '50px',
                      height: isMobile ? '40px' : '50px',
                      borderRadius: '50%',
                      marginBottom: '8px',
                      transition: 'transform 0.3s ease',
                      fontSize: isMobile ? '24px' : '28px',
                    }}>
                      {growth.icon}
                    </div>
                    <Heading 
                      level={5} 
                      style={{
                        textAlign: 'center',
                        fontSize: isMobile ? '0.75rem' : '0.85rem',
                        fontWeight: 500,
                        color: '#374151',
                        lineHeight: 1.3,
                        margin: 0,
                        padding: 0,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {growth.title}
                    </Heading>
                  </Card>
                ))}
              </Flex>
              
              {/* Explore More button for Essential Growth */}
              <button
                style={{
                  margin: isMobile ? '1rem auto' : '1.5rem auto',
                  display: 'block',
                  padding: '0.5rem 1.2rem',
                  fontSize: '1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: colorSystem.primary[500],
                  color: colorSystem.text.inverse,
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: `0 2px 8px ${colorSystem.shadow.colored}`,
                  transition: 'background 0.2s',
                }}
                onClick={() => window.location.href = '/essential-growth'}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colorSystem.primary[600];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colorSystem.primary[500];
                }}
              >
                Explore Essential Growth
              </button>
            </Flex>
          </Flex>
        </div>
      </Container>
    </Section>
  );
};

export default OurApproach; 