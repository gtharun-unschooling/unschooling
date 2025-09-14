import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, Text, Card, Flex, Container, Section } from '../../../components/ui/StyledComponents';
import { colors, spacing, typography } from '../../../styles/designTokens';
import config from '../../../config/config';

const DEFAULT_ICON = '🌟';

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
              icon: DEFAULT_ICON, // You can customize this if you have icons in your data
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
        // Fallback to static file if API fails
        fetch('/nichesdata.json')
          .then(res => res.json())
          .then(data => {
            const mapped = data
              .filter(n => n.Niche && n.Niche.length > 0)
              .map(n => ({
                icon: DEFAULT_ICON,
                title: n.Niche,
                color: n.Color || '#8884d8',
                gradient: n["Primary Color"] && n["Secondary Color"] ? `linear-gradient(135deg, ${n["Primary Color"]} 0%, ${n["Secondary Color"]} 100%)` : '#f8fafc',
                slug: n["Niche Slug"] || n.Niche.toLowerCase().replace(/\s+/g, '-'),
              }));
            setNiches(mapped);
          })
          .catch(fallbackErr => {
            console.error('Fallback also failed:', fallbackErr);
            // Set empty array as last resort
            setNiches([]);
          });
      });
  }, []);

  // Ensure niches is always an array before using slice
  const safeNiches = Array.isArray(niches) ? niches : [];
  const displayNiches = safeNiches.slice(0, visibleNiches);

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
    backgroundColor: '#f8fafc',
    padding: isMobile ? `${spacing.xl} 0` : `${spacing['3xl']} 0`,
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
    fontSize: isMobile ? '1.8rem' : 'clamp(2.2rem, 4vw, 3rem)',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    marginBottom: isMobile ? spacing.sm : spacing.md,
    position: 'relative',
  };

  const sectionSubtitleStyle = {
    fontSize: isMobile ? '0.95rem' : 'clamp(1rem, 2vw, 1.2rem)',
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: isMobile ? '100%' : '500px',
    margin: '0 auto',
    marginBottom: isMobile ? spacing.lg : spacing['2xl'],
    lineHeight: 1.5,
    fontWeight: 500,
    padding: isMobile ? `0 ${spacing.md}` : 0,
  };

  const columnTitleStyle = {
    fontSize: isMobile ? '1.2rem' : 'clamp(1.4rem, 2.5vw, 1.8rem)',
    fontWeight: 700,
    color: colors.text.primary,
    marginBottom: isMobile ? spacing.md : spacing.lg,
    textAlign: 'center',
  };

  return (
    <Section style={sectionStyle}>
      <div style={backgroundPattern}></div>
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Flex direction="column" align="center" style={{ marginBottom: isMobile ? spacing.lg : spacing['2xl'] }}>
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
            direction={isMobile ? "column" : "row"}
            gap={isMobile ? spacing.lg : spacing['2xl']}
            style={{ 
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Niches Column */}
            <Flex direction="column" style={{ 
              flex: isMobile ? 'none' : '1 1 48%', 
              minWidth: isMobile ? '100%' : '280px',
              width: '100%'
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
                Total {safeNiches.length} learning areas available
              </Text>
              <Flex 
                direction="row" 
                wrap={true} 
                gap={isMobile ? spacing.md : spacing.lg}
                style={{ 
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  flexWrap: 'wrap',
                  maxWidth: '100%',
                }}
              >
                {displayNiches.map((niche, index) => (
                  <Card 
                    key={index} 
                    variant="elevated"
                    style={{
                      ...cardStyle,
                      flex: isMobile ? '1 1 80px' : '1 1 100px',
                      maxWidth: isMobile ? '90px' : '110px',
                      minHeight: isMobile ? '80px' : '100px',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      padding: isMobile ? spacing.sm : spacing.md,
                      borderRadius: isMobile ? '10px' : '14px',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1), 0 3px 8px rgba(0, 0, 0, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onClick={() => {
                      console.log('🎯 Clicked on niche:', niche.title, 'navigating to:', `/niche/${niche.slug}`);
                      navigate(`/niche/${niche.slug}`);
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15), 0 6px 15px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.querySelector('.card-bg').style.opacity = '0.15';
                        e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1), 0 3px 8px rgba(0, 0, 0, 0.06)';
                        e.currentTarget.querySelector('.card-bg').style.opacity = '0.08';
                        e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <div className="card-bg" style={cardBackground(niche.gradient)}></div>
                    
                    <div className="icon-container" style={iconContainerStyle(niche.color)}>
                      {niche.icon}
                    </div>
                    <Heading 
                      level={5} 
                      style={{
                        ...titleStyle,
                        textAlign: 'center',
                        marginTop: '0.4rem',
                        fontSize: isMobile ? '0.65rem' : '0.8rem',
                        fontWeight: 600,
                        color: colors.text.primary,
                        lineHeight: 1.2,
                      }}
                    >
                      {niche.title}
                    </Heading>
                  </Card>
                ))}
                {visibleNiches < safeNiches.length && (
                  <Card
                    key="show-more-tile"
                    variant="elevated"
                    style={{
                      ...cardStyle,
                      flex: isMobile ? '1 1 60px' : '1 1 80px',
                      maxWidth: isMobile ? '70px' : '90px',
                      minHeight: isMobile ? '60px' : '80px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      padding: isMobile ? spacing.xs : spacing.sm,
                      borderRadius: isMobile ? '10px' : '14px',
                      boxShadow: '0 6px 20px rgba(102,126,234,0.2), 0 3px 8px rgba(102,126,234,0.1)',
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
                  >
                    <div style={{ 
                      fontSize: '1.2rem', 
                      marginBottom: '0.2rem',
                      fontWeight: 300,
                      opacity: 0.9
                    }}>+</div>
                    <Heading level={5} style={{ 
                      ...titleStyle, 
                      color: '#fff',
                      textAlign: 'center',
                      fontSize: isMobile ? '0.55rem' : '0.65rem',
                      fontWeight: 600,
                      marginTop: '0.2rem',
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
              flex: isMobile ? 'none' : '1 1 48%', 
              minWidth: isMobile ? '100%' : '280px',
              width: '100%'
            }}>
              <Heading level={2} style={columnTitleStyle}>
                Essential Growth
              </Heading>
              <Flex 
                direction="row" 
                wrap={true} 
                gap={isMobile ? spacing.xs : spacing.sm}
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
                      flex: isMobile ? '1 1 80px' : '1 1 110px',
                      maxWidth: isMobile ? '90px' : '120px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      padding: isMobile ? spacing.sm : spacing.md,
                      borderRadius: isMobile ? '8px' : '12px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.currentTarget.querySelector('.card-bg').style.opacity = '0.12';
                        e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.currentTarget.querySelector('.card-bg').style.opacity = '0.08';
                        e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <div className="card-bg" style={cardBackground(growth.gradient)}></div>
                    <div className="icon-container" style={iconContainerStyle(growth.color)}>
                      {growth.icon}
                    </div>
                    <Heading 
                      level={5} 
                      style={titleStyle}
                    >
                      {growth.title}
                    </Heading>
                  </Card>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </div>
      </Container>
    </Section>
  );
};

export default OurApproach; 