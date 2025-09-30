import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import config from '../../config/config';
import MinimalBackButton from '../../components/ui/MinimalBackButton';
import NicheIcon from '../../components/ui/NicheIcon';

const DynamicNichePage = () => {
  const { nicheSlug } = useParams();
  const location = useLocation();
  const [topics, setTopics] = useState([]);
  const [niches, setNiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const LESSONS_PER_PAGE = 20; // Show 20 more topics when clicked
  const [visibleLessons, setVisibleLessons] = useState(20);

  useEffect(() => {
    setLoading(true);
    console.log('🔍 DynamicNichePage: Loading data for nicheSlug:', nicheSlug);
    console.log('🔍 DynamicNichePage: API_BASE_URL:', config.API_BASE_URL);
    
    // Try API first, fallback to local data
    Promise.all([
      fetch(`${config.API_BASE_URL}/api/topics`).then(res => {
        console.log('📊 Topics API response status:', res.status);
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('API not available');
        }
      }).catch(() => {
        console.log('🔄 Using local topics data as fallback');
        return fetch('/topicsdata.json').then(res => res.json());
      }),
      fetch(`${config.API_BASE_URL}/api/niches`).then(res => {
        console.log('📊 Niches API response status:', res.status);
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('API not available');
        }
      }).catch(() => {
        console.log('🔄 Using local niches data as fallback');
        return fetch('/nichesdata.json').then(res => res.json());
      })
    ])
      .then(([topicsData, nichesData]) => {
        console.log('✅ Data loaded successfully');
        console.log('📊 Topics count:', topicsData.length);
        console.log('📊 Niches count:', nichesData.length);
        setTopics(topicsData);
        setNiches(nichesData);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching data, using local fallback:', err);
        // Use local data as final fallback
        Promise.all([
          fetch('/topicsdata.json').then(res => res.json()),
          fetch('/nichesdata.json').then(res => res.json())
        ]).then(([topicsData, nichesData]) => {
          setTopics(topicsData);
          setNiches(nichesData);
          setLoading(false);
        }).catch(fallbackErr => {
          console.error('❌ Even fallback failed:', fallbackErr);
          setLoading(false);
        });
      });
  }, [nicheSlug]);

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: '#666'
    }}>
      <div>
        <div style={{ marginBottom: '1rem' }}>🔄 Loading {nicheSlug} page...</div>
        <div style={{ fontSize: '0.9rem', color: '#999' }}>Fetching data from API...</div>
      </div>
    </div>
  );
  if (error) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: '#e74c3c'
    }}>
      <div>
        <div style={{ marginBottom: '1rem' }}>❌ Error loading page</div>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>{error}</div>
      </div>
    </div>
  );
  
  if (!nicheSlug) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: '#e74c3c'
    }}>
      <div>❌ Error: No niche provided in the URL.</div>
    </div>
  );

  console.log('🔍 Looking for niche with slug:', nicheSlug);
  console.log('📊 Available niches:', niches.map(n => ({ name: n.Niche, slug: n['Niche Slug'] })));
  
  const nicheDetails = niches.find(n => n['Niche Slug'] === nicheSlug);
  if (!nicheDetails) {
    console.error('❌ No niche found for slug:', nicheSlug);
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#e74c3c'
      }}>
        <div>
          <div style={{ marginBottom: '1rem' }}>❌ Niche Not Found</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>No niche found for slug: {nicheSlug}</div>
        </div>
      </div>
    );
  }
  
  console.log('✅ Found niche details:', nicheDetails.Niche);
  console.log('🔍 Total topics loaded:', topics.length);
  console.log('🔍 Sample topics:', topics.slice(0, 3).map(t => ({ niche: t.Niche, topic: t.Topic })));
  console.log('🔍 Looking for topics with Niche ===', nicheDetails.Niche);
  
  const topicList = topics.filter(t => t.Niche === nicheDetails.Niche);
  console.log('✅ Filtered topics for', nicheDetails.Niche, ':', topicList.length);
  console.log('🔍 Sample filtered topics:', topicList.slice(0, 3).map(t => ({ topic: t.Topic, age: t.Age })));

  const {
    Niche,
    'Hero Tagline': heroTagline,
    'Sub heading': subheading,
    Problems: problemsHTML,
    'Approach Steps': approachHTML,
    'Why Kids Love This': whyKidsLoveHTML,
    Color: nicheColor,
    'Primary Color': primaryColor,
    'Secondary Color': secondaryColor,
    'Background Color': backgroundColor,
    Illustration: illustrationFile,
    Suggestion: suggestionText
  } = nicheDetails;

  const handleShowMore = () => setVisibleLessons(prev => prev + 20);

  const pageStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '2rem',
    backgroundColor: '#f9fafb',
    color: '#1f2937',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  };

  // ✅ COMPONENT SECTIONS


  const HeroSection = () => {
    const isMobile = window.innerWidth <= 768;
    
    // Determine text color based on background brightness
    const getTextColor = (bgColor) => {
      if (!bgColor) return '#ffffff';
      // Simple brightness check - if background is light, use dark text
      const hex = bgColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? '#1f2937' : '#ffffff';
    };
    
    const sectionStyle = {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      minHeight: isMobile ? '300px' : '400px',
      maxHeight: isMobile ? '500px' : '600px',
      width: '100%',
      background: `linear-gradient(135deg, ${backgroundColor || primaryColor} 0%, ${primaryColor} 100%)`,
      color: getTextColor(backgroundColor),
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '1rem',
      marginBottom: '2rem',
      boxShadow: `0 8px 32px ${nicheColor}30`,
    };
  
    const titleStyle = {
      position: 'absolute',
      top: '1.5rem', // Same vertical position as back button
      left: '7rem', // Moved to the right of the back button (2rem + 48px + 1rem)
      fontSize: '1.5rem',
      fontWeight: '700',
      color: getTextColor(backgroundColor),
      margin: 0,
      zIndex: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '0.5rem 1rem',
      borderRadius: '2rem',
      backdropFilter: 'blur(10px)',
    };
  
    const leftSectionStyle = {
      width: isMobile ? '100%' : '70%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: isMobile ? '1.5rem' : '2rem',
      boxSizing: 'border-box',
      minWidth: 0,
    };
  
    const rightSectionStyle = {
      width: isMobile ? '100%' : '30%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: isMobile ? '1.5rem' : '2rem',
      boxSizing: 'border-box',
      minWidth: 0,
    };
  
    const taglineStyle = {
      fontSize: isMobile ? '2rem' : '3rem',
      fontWeight: '800',
      color: getTextColor(backgroundColor),
      marginBottom: '1rem',
      lineHeight: 1.2,
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };
  
    const subheadingStyle = {
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: '500',
      color: getTextColor(backgroundColor),
      maxWidth: '500px',
      margin: '0 auto',
      lineHeight: 1.5,
      opacity: 0.9,
    };
  
    const iconContainerStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      padding: '2rem',
      backdropFilter: 'blur(10px)',
      boxShadow: `0 8px 32px ${nicheColor}40`,
    };
  
    return (
      <section style={sectionStyle}>
        <MinimalBackButton 
          heroColors={{
            backgroundColor: backgroundColor,
            primaryColor: primaryColor,
            nicheColor: nicheColor
          }}
        />
        <h2 style={titleStyle}>{`#${Niche}`}</h2>

        <div style={leftSectionStyle}>
          <div style={taglineStyle}>{heroTagline || `Explore ${Niche}`}</div>
        </div>

        <div style={rightSectionStyle}>
          <div style={iconContainerStyle}>
            <NicheIcon 
              niche={Niche} 
              size="xlarge"
              style={{
                fontSize: isMobile ? '4rem' : '6rem',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              }}
            />
          </div>
        </div>
      </section>
    );
  };
  
  
  
  
  
  
  

  const parseHTMLToList = (htmlString) => {
    // Extract list items from HTML
    const listItems = htmlString.match(/<li>(.*?)<\/li>/g);
    if (listItems) {
      return listItems.map(item => item.replace(/<li>|<\/li>/g, ''));
    }
    return [];
  };

  const ProblemSection = () => {
    const problems = parseHTMLToList(problemsHTML);
    
    // Icons for problem statements
    const problemIcons = ['🚫', '😴', '📚', '⏰', '🎯', '💭'];

    return (
      <section style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          color: primaryColor,
          marginBottom: '1.5rem',
        }}>
          🚨 Why Children Struggle With {Niche}
        </h2>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          {problems.map((problem, index) => (
            <div
              key={index}
              style={{
                backgroundColor: secondaryColor,
                padding: '0.8rem 1.2rem',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#1f2937',
                border: `1px solid ${primaryColor}40`,
                flex: '1',
                minWidth: '200px',
                maxWidth: '250px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{problemIcons[index] || '❌'}</span>
              <span>{problem}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const ApproachSection = () => {
    const approaches = parseHTMLToList(approachHTML);
    
    // Icons for approach statements
    const approachIcons = ['🎮', '🌍', '👨‍👩‍👧‍👦', '📦', '📊', '🎯', '💡', '🚀'];

    return (
      <section style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          color: primaryColor,
          marginBottom: '1.5rem',
        }}>
          🎯 The Unschooling Way
        </h2>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          {approaches.map((approach, index) => (
            <div
              key={index}
              style={{
                backgroundColor: secondaryColor,
                padding: '0.8rem 1.2rem',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                color: '#1f2937',
                border: `1px solid ${primaryColor}40`,
                flex: '1',
                minWidth: '200px',
                maxWidth: '250px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{approachIcons[index] || '✅'}</span>
              <span>{approach}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };


  const TopicsSection = () => {
    // Use the nicheSlug from the outer scope instead of calling useParams again
  
    const sectionStyle = {
      padding: '2rem 1rem',
    };
  
    const headingStyle = {
      fontSize: '2rem',
      fontWeight: '700',
      color: primaryColor,
      marginBottom: '2rem',
      textAlign: 'center',
    };
  
    const listWrapperStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
    };
  
    const topicRowStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '1rem 1.5rem',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
      fontSize: '1rem',
      fontWeight: '500',
      color: '#1f2937',
      textDecoration: 'none',
    };
  
    const numberStyle = {
      fontWeight: '700',
      color: primaryColor,
      width: '40px',
    };
  
    const topicNameStyle = {
      flexGrow: 1,
      padding: '0 1rem',
      color: '#111827',
    };
  
    const ageStyle = {
      fontStyle: 'italic',
      color: '#6b7280',
    };
  
    const buttonStyle = {
      display: 'block',
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${nicheColor} 100%)`,
      color: '#fff',
      border: 'none',
      borderRadius: '9999px',
      padding: '0.85rem 2rem',
      fontWeight: '700',
      fontSize: '1rem',
      cursor: 'pointer',
      margin: '2rem auto 0',
      boxShadow: `0 4px 16px ${nicheColor}40`,
    };
  
    return (
      <section style={sectionStyle}>
        <h2 style={headingStyle}>What Your Child Will Learn</h2>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '1.1rem',
          color: '#6b7280',
          fontWeight: '500',
        }}>
          Total {topicList.length} topics available
        </div>

        <div style={listWrapperStyle}>
            {topicList.slice(0, visibleLessons).map((topic, idx) => {
            if (!topic || !topic.Topic) return null;
            const topicSlug = topic.Topic.toLowerCase().replace(/\s+/g, '-');
                    return (
                <Link
                key={idx}
                to={`/niche/${nicheSlug}/${topicSlug}`} // use outer scope's `nicheSlug`
                state={{ from: 'niches' }}
                style={topicRowStyle}
              >
                <span style={numberStyle}>#{idx + 1}</span>
                <span style={topicNameStyle}>{topic.Topic}</span>
                <span style={ageStyle}>Age {topic.Age}</span>
                </Link>
            );
          })}
        </div>
  
        {visibleLessons < topicList.length && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={handleShowMore} style={buttonStyle}>
              Show More
            </button>
          </div>
        )}
      </section>
    );
  };
  
  const ImpactSection = () => {
    const impactItems = parseHTMLToList(whyKidsLoveHTML);
    
    // Icons for impact statements
    const impactIcons = ['🎉', '💪', '🌟', '🚀', '💡', '🏆', '✨', '🎯'];

    return (
      <section style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          color: primaryColor,
          marginBottom: '1.5rem',
        }}>
          🌟 Why Kids Love Learning This Way
        </h2>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          {impactItems.map((item, index) => (
            <div
              key={index}
              style={{
                background: `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor}20 100%)`,
                padding: '1rem 1.5rem',
                borderRadius: '1rem',
                fontSize: '1rem',
                color: '#1f2937',
                border: `2px solid ${primaryColor}60`,
                flex: '1',
                minWidth: '250px',
                maxWidth: '300px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                boxShadow: `0 4px 16px ${nicheColor}30`,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${nicheColor}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${nicheColor}30`;
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{impactIcons[index] || '🌟'}</span>
              <span style={{ fontWeight: '600' }}>{item}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Map suggestion terms to actual niche names
  const mapSuggestionToNiche = (suggestion) => {
    const suggestionMap = {
      // Direct matches
      'Entrepreneurship': 'Entrepreneurship',
      'Math in Real Life': 'Mathematics',
      'Storytelling': 'Communication',
      'Emotional Intelligence': 'Emotional Intelligence',
      'Group Play': 'Games & Recreational Skills',
      'Logic Building': 'Coding & Programming',
      'Digital Literacy': 'Social Media Literacy',
      'Future Careers': 'AI',
      'Creative Thinking': 'Design Thinking & Creativity',
      'Decision-Making': 'Leadership & Team Building',
      'Risk & Reward': 'Trading & Investments',
      'Physical Health': 'Physical Fitness',
      'Creativity': 'Arts & Crafts',
      'Body Awareness': 'Dance',
      'Expression': 'Music',
      'Rhythm': 'Music',
      'Ecology': 'Nature Exploration',
      'Observation': 'Nature Exploration',
      'Environmental Empathy': 'Sustainability & Environment',
      'Geography': 'Travel',
      'Culture': 'Culture & Heritage',
      'Curiosity': 'General Science',
      'Logic': 'Coding & Programming',
      'Digital Creation': 'Content Creation',
      'Future Skills': 'AI',
      'Justice': 'Law & Legal Education',
      'Leadership': 'Leadership & Team Building',
      'Critical Thinking': 'Psychology',
      'Civics & Government': 'Civics & Government',
      'Culture & Heritage': 'Culture & Heritage',
      'Travel': 'Travel',
      'Arts & Crafts': 'Arts & Crafts',
      'Communication': 'Communication',
      'Fashion & Styling': 'Fashion & Styling',
      'Design Thinking & Creativity': 'Design Thinking & Creativity',
      'Photography & Videography': 'Photography & Videography',
      'Psychology': 'Psychology',
      'Nature Exploration': 'Nature Exploration',
      'Applied Chemistry & Materials': 'Applied Chemistry & Materials',
      'Fundamental Physics & Forces': 'Fundamental Physics & Forces',
      'Physical Fitness': 'Physical Fitness',
      'Games & Recreational Skills': 'Games & Recreational Skills',
      'Product Design & User Experience (UX)': 'Product Design & User Experience (UX)',
      'Filmmaking': 'Filmmaking',
      'Content Creation': 'Content Creation',
      'Finance': 'Finance',
      'Mathematics': 'Mathematics',
      'Sports': 'Sports',
      'Trading & Investments': 'Trading & Investments',
      'General Science': 'General Science',
      'Children\'s Books': 'Children\'s Books',
      'Teaching & Pedagogy': 'Teaching & Pedagogy',
      'Educational Apps': 'Educational Apps',
      'Creative & Academic Writing': 'Creative & Academic Writing',
      'Public Speaking & Debate': 'Public Speaking & Debate',
      'Electronics': 'Electronics',
      'Electrical Engineering Basics': 'Electrical Engineering Basics',
      'Robotics': 'Robotics',
      'Renewable Energy': 'Renewable Energy',
      'Behavioral Science': 'Behavioral Science',
      'History': 'History',
      'Health & Hygiene': 'Health & Hygiene',
      'Human Biology': 'Human Biology',
      'Food & Nutrition': 'Food & Nutrition',
      'Space Exploration': 'Space Exploration',
      'Architecture & Design': 'Architecture & Design',
      'Internet of Things (IoT)': 'Internet of Things (IoT)',
      'Sustainability & Environment': 'Sustainability & Environment',
      'Social Media Literacy': 'Social Media Literacy',
      'Construction & Structural Engineering': 'Construction & Structural Engineering',
      'Tools & Machines Literacy': 'Tools & Machines Literacy',
      'Ayurveda & Natural Healing': 'Ayurveda & Natural Healing',
      'Aerospace & Flight Sciences': 'Aerospace & Flight Sciences',
      'Emergency Response & Safety Skills': 'Emergency Response & Safety Skills',
      'Cryptocurrency & Blockchain': 'Cryptocurrency & Blockchain',
      'Agriculture & Soil Science': 'Agriculture & Soil Science',
      'Supply Chain & Logistics': 'Supply Chain & Logistics',
      'Smart Urban Living': 'Smart Urban Living',
      'Media Production & Broadcasting': 'Media Production & Broadcasting',
      'Automobiles & Engineering': 'Automobiles & Engineering',
      'Marine Biology': 'Marine Biology',
      'Cybersecurity': 'Cybersecurity',
      'Spirituality & Devotion': 'Spirituality & Devotion',
      'Law & Legal Education': 'Law & Legal Education'
    };
    
    return suggestionMap[suggestion] || suggestion;
  };

  // Parse suggestion text to extract related niches
  const getRelatedNiches = (suggestionText) => {
    if (!suggestionText) return [];
    return suggestionText.split(',').map(item => item.trim()).filter(item => item.length > 0);
  };

  const relatedNiches = getRelatedNiches(suggestionText).map(mapSuggestionToNiche);

  const RelatedNichesSection = () => {
    if (relatedNiches.length === 0) return null;

    const handleNicheClick = (nicheName) => {
      const relatedNiche = niches.find(n => n.Niche === nicheName);
      if (relatedNiche && relatedNiche['Niche Slug']) {
        // Navigate with state to indicate this is from a related niche
        window.location.href = `/niche/${relatedNiche['Niche Slug']}?from=related-niche`;
      }
    };

    return (
      <section style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          color: primaryColor,
          marginBottom: '1.5rem',
        }}>
          🔗 Related Niches
        </h2>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          {relatedNiches.map((niche, index) => (
            <button
              key={index}
              onClick={() => handleNicheClick(niche)}
              style={{
                backgroundColor: primaryColor,
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 16px ${nicheColor}30`,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = nicheColor;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 8px 24px ${nicheColor}50`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = primaryColor;
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 4px 16px ${nicheColor}30`;
              }}
            >
              {niche}
            </button>
          ))}
        </div>
      </section>
    );
  };

  const CTASection = () => {

    const sectionStyle = {
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${nicheColor} 100%)`,
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.3rem',
      marginTop: '3rem',
      boxShadow: `0 8px 32px ${nicheColor}40`,
    };

    const buttonStyle = {
      marginTop: '1rem',
      backgroundColor: '#fff',
      color: primaryColor,
      fontWeight: '700',
      borderRadius: '9999px',
      padding: '0.8rem 3rem',
      fontSize: '1.1rem',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    };


    return (
      <section style={sectionStyle}>
        <p>{`Ready to Begin your journey with ${Niche}?`}</p>
        <button style={buttonStyle} onClick={() => alert('Redirect to Plans page')}>
          Get Started with a Free Week
        </button>
        <p style={{ marginTop: '0.8rem', fontSize: '0.9rem', fontWeight: '400', opacity: 0.85 }}>
          No commitment. Cancel anytime.
        </p>
        
      </section>
    );
  };

  // 🔚 FINAL PAGE RENDER
  return (
    <div style={pageStyle}>
      <HeroSection />
      <ProblemSection />
      <ApproachSection />
      <TopicsSection />
      <ImpactSection />
      <RelatedNichesSection />
      <CTASection />
    </div>
  );
};

export default DynamicNichePage;
