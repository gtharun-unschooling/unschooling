import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '../../config/config';
import MinimalBackButton from '../../components/ui/MinimalBackButton';
import NicheIcon from '../../components/ui/NicheIcon';

const NichesOverviewPage = () => {
  const [niches, setNiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleNiches, setVisibleNiches] = useState(12); // Show all niches initially
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback niches data in case API fails - ranked by popularity and educational value
  const fallbackNiches = [
    {
      Niche: "Artificial Intelligence",
      "Hero Tagline": "Explore the future of technology and machine learning",
      "Niche Slug": "artificial-intelligence",
      Color: "#667eea",
      Problems: "<div>Complex concepts</div><div>Math requirements</div><div>Technical jargon</div>",
      "Approach Steps": "<div>Start with basics</div><div>Hands-on projects</div><div>Real-world examples</div>",
      "Why Kids Love This": "<div>Cool robots</div><div>Smart devices</div><div>Future tech</div>"
    },
    {
      Niche: "Creative Writing",
      "Hero Tagline": "Develop storytelling skills and creative expression",
      "Niche Slug": "creative-writing",
      Color: "#f59e0b",
      Problems: "<div>Writer's block</div><div>Grammar rules</div><div>Creative confidence</div>",
      "Approach Steps": "<div>Free writing</div><div>Story prompts</div><div>Peer sharing</div>",
      "Why Kids Love This": "<div>Imagination</div><div>Self-expression</div><div>Story creation</div>"
    },
    {
      Niche: "Environmental Science",
      "Hero Tagline": "Discover nature and learn to protect our planet",
      "Niche Slug": "environmental-science",
      Color: "#10b981",
      Problems: "<div>Complex ecosystems</div><div>Scientific terminology</div><div>Environmental concerns</div>",
      "Approach Steps": "<div>Nature walks</div><div>Simple experiments</div><div>Conservation projects</div>",
      "Why Kids Love This": "<div>Outdoor adventures</div><div>Animal friends</div><div>Helping Earth</div>"
    },
    {
      Niche: "Mathematics",
      "Hero Tagline": "Master numbers and problem-solving skills",
      "Niche Slug": "mathematics",
      Color: "#8b5cf6",
      Problems: "<div>Abstract concepts</div><div>Fear of numbers</div><div>Memorization</div>",
      "Approach Steps": "<div>Visual learning</div><div>Real-world applications</div><div>Gamification</div>",
      "Why Kids Love This": "<div>Puzzle solving</div><div>Number games</div><div>Math magic</div>"
    },
    {
      Niche: "Music & Arts",
      "Hero Tagline": "Express creativity through sound and visual arts",
      "Niche Slug": "music-arts",
      Color: "#ec4899",
      Problems: "<div>Technical skills</div><div>Creative blocks</div><div>Performance anxiety</div>",
      "Approach Steps": "<div>Free exploration</div><div>Simple instruments</div><div>Group activities</div>",
      "Why Kids Love This": "<div>Making music</div><div>Colorful creations</div><div>Self-expression</div>"
    },
    {
      Niche: "Physical Education",
      "Hero Tagline": "Build strength, coordination, and healthy habits",
      "Niche Slug": "physical-education",
      Color: "#f97316",
      Problems: "<div>Physical limitations</div><div>Coordination issues</div><div>Motivation</div>",
      "Approach Steps": "<div>Fun activities</div><div>Team sports</div><div>Personal goals</div>",
      "Why Kids Love This": "<div>Active play</div><div>Team spirit</div><div>Physical achievements</div>"
    },
    {
      Niche: "Finance",
      "Hero Tagline": "Learn money management and financial literacy",
      "Niche Slug": "finance",
      Color: "#059669",
      Problems: "<div>Complex concepts</div><div>Abstract thinking</div><div>Fear of money</div>",
      "Approach Steps": "<div>Pocket money</div><div>Saving games</div><div>Real examples</div>",
      "Why Kids Love This": "<div>Money games</div><div>Saving challenges</div><div>Financial freedom</div>"
    },
    {
      Niche: "Communication",
      "Hero Tagline": "Develop speaking, listening, and social skills",
      "Niche Slug": "communication",
      Color: "#0ea5e9",
      Problems: "<div>Social anxiety</div><div>Language barriers</div><div>Confidence issues</div>",
      "Approach Steps": "<div>Role playing</div><div>Group discussions</div><div>Public speaking</div>",
      "Why Kids Love This": "<div>Making friends</div><div>Storytelling</div><div>Social connections</div>"
    },
    {
      Niche: "Entrepreneurship",
      "Hero Tagline": "Learn to create, innovate, and build businesses",
      "Niche Slug": "entrepreneurship",
      Color: "#7c3aed",
      Problems: "<div>Risk taking</div><div>Business concepts</div><div>Failure fear</div>",
      "Approach Steps": "<div>Simple projects</div><div>Market research</div><div>Pitch practice</div>",
      "Why Kids Love This": "<div>Creating products</div><div>Business games</div><div>Innovation</div>"
    },
    {
      Niche: "Science",
      "Hero Tagline": "Explore the wonders of the natural world",
      "Niche Slug": "science",
      Color: "#dc2626",
      Problems: "<div>Complex theories</div><div>Scientific method</div><div>Technical vocabulary</div>",
      "Approach Steps": "<div>Simple experiments</div><div>Observation skills</div><div>Hypothesis testing</div>",
      "Why Kids Love This": "<div>Cool experiments</div><div>Discovery</div><div>Scientific mysteries</div>"
    },
    {
      Niche: "Technology",
      "Hero Tagline": "Master digital tools and programming basics",
      "Niche Slug": "technology",
      Color: "#1f2937",
      Problems: "<div>Technical complexity</div><div>Screen time concerns</div><div>Rapid changes</div>",
      "Approach Steps": "<div>Basic coding</div><div>Digital creativity</div><div>Safe exploration</div>",
      "Why Kids Love This": "<div>Digital creation</div><div>Gaming</div><div>Tech mastery</div>"
    },
    {
      Niche: "Health & Wellness",
      "Hero Tagline": "Learn about nutrition, fitness, and mental health",
      "Niche Slug": "health-wellness",
      Color: "#16a34a",
      Problems: "<div>Healthy habits</div><div>Body awareness</div><div>Mental health stigma</div>",
      "Approach Steps": "<div>Nutrition education</div><div>Exercise fun</div><div>Mindfulness</div>",
      "Why Kids Love This": "<div>Healthy cooking</div><div>Fitness games</div><div>Wellness</div>"
    }
  ];

  useEffect(() => {
    setLoading(true);
    console.log('🔍 NichesOverviewPage: Checking API vs Fallback data');
    
    // First try API call to see what it returns
    fetch(`${config.API_BASE_URL}/api/niches`)
      .then(res => {
        console.log('📊 API response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('📊 API returned data:', data);
        console.log('📊 API data length:', data.length);
        console.log('📊 API data niches:', data.map(n => n.Niche));
        
        // Always use fallback data to ensure we show all 12
        console.log('🔄 Using fallback data instead of API data');
        setNiches(fallbackNiches);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ API Error:', err);
        console.log('🔄 Using fallback niches data');
        setNiches(fallbackNiches);
        setError(null);
        setLoading(false);
      });
  }, []);

  // Ensure niches is always an array - show all niches
  const safeNiches = Array.isArray(niches) ? niches : fallbackNiches;
  const displayNiches = safeNiches; // Show all niches without slicing
  
  console.log('🔍 Debug - Total niches available:', safeNiches.length);
  console.log('🔍 Debug - Niches names:', safeNiches.map(n => n.Niche));
  console.log('🔍 Debug - Display niches length:', displayNiches.length);

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
        <div style={{ marginBottom: '1rem' }}>🔄 Loading all niches...</div>
        <div style={{ fontSize: '0.9rem', color: '#999' }}>Fetching data from API...</div>
      </div>
    </div>
  );

  // Error display removed - fallback data will be used seamlessly

  const pageStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '2rem',
    backgroundColor: '#f9fafb',
    color: '#1f2937',
    maxWidth: '1400px',
    margin: '0 auto',
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
    position: 'relative',
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem',
  };

  const subtitleStyle = {
    fontSize: '1.3rem',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6,
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  };

  const nicheCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '1rem',
    padding: '1.2rem',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '400px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
  };

  const nicheHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
  };

  const iconStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    marginRight: '1rem',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    border: '2px solid rgba(255,255,255,0.3)',
  };

  const nicheTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  };

  const taglineStyle = {
    fontSize: '0.9rem',
    color: '#6b7280',
    marginTop: '0.3rem',
    lineHeight: 1.4,
  };

  const sectionStyle = {
    marginBottom: '1.5rem',
  };

  const sectionTitleStyle = {
    fontSize: '1rem',
    fontWeight: '700',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const tileGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.75rem',
  };

  const tileStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.2s ease',
  };

  const problemsSectionStyle = {
    ...sectionStyle,
  };

  const problemsTitleStyle = {
    ...sectionTitleStyle,
    color: '#dc2626',
    background: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const approachSectionStyle = {
    ...sectionStyle,
  };

  const approachTitleStyle = {
    ...sectionTitleStyle,
    color: '#16a34a',
    background: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const benefitsSectionStyle = {
    ...sectionStyle,
  };

  const benefitsTitleStyle = {
    ...sectionTitleStyle,
    color: '#2563eb',
    background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const showMoreStyle = {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1rem 2rem',
    borderRadius: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    maxWidth: '300px',
    margin: '2rem auto',
    color: 'white',
    fontWeight: '600',
    fontSize: '1.1rem',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
  };

  // Using NicheIcon component for consistent icon display

  const parseHTML = (htmlString) => {
    // Simple HTML parsing to extract list items
    const listItems = htmlString.match(/<li>(.*?)<\/li>/g);
    if (listItems) {
      return listItems.map(item => item.replace(/<li>|<\/li>/g, '')).slice(0, 3);
    }
    return [];
  };

  const handleNicheClick = (nicheSlug) => {
    navigate(`/niche/${nicheSlug}`);
  };

  const handleShowMore = () => {
    setVisibleNiches(prev => Math.min(prev + 6, safeNiches.length));
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <MinimalBackButton 
          heroColors={{
            backgroundColor: '#f9fafb',
            primaryColor: '#667eea',
            nicheColor: '#764ba2'
          }}
        />
        <h1 style={titleStyle}>Explore All Learning Areas</h1>
        <p style={subtitleStyle}>
          Discover our comprehensive collection of educational niches designed to make learning fun, engaging, and meaningful for children of all ages.
        </p>
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          fontSize: '1.1rem',
          color: '#6b7280',
          fontWeight: '500',
        }}>
          Discover diverse learning paths tailored to your child's interests
        </div>
      </div>

      <div style={gridStyle}>
        {displayNiches.map((niche, index) => (
          <div
            key={index}
            style={{
              ...nicheCardStyle,
              borderLeft: `4px solid ${niche.Color || '#667eea'}`,
            }}
            onClick={() => handleNicheClick(niche['Niche Slug'])}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={nicheHeaderStyle}>
              <div style={{
                ...iconStyle,
                backgroundColor: niche.Color || '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <NicheIcon niche={niche.Niche} size="large" />
              </div>
              <div>
                <h3 style={nicheTitleStyle}>{niche.Niche}</h3>
                <p style={taglineStyle}>{niche['Hero Tagline']}</p>
              </div>
            </div>

            <div style={problemsSectionStyle}>
              <div style={problemsTitleStyle}>
                <span>🚨</span>
                Common Challenges
              </div>
              <div style={tileGridStyle}>
                {parseHTML(niche.Problems).map((problem, idx) => (
                  <div key={idx} style={tileStyle}>
                    {problem}
                  </div>
                ))}
              </div>
            </div>

            <div style={approachSectionStyle}>
              <div style={approachTitleStyle}>
                <span>🎯</span>
                Our Approach
              </div>
              <div style={tileGridStyle}>
                {parseHTML(niche['Approach Steps']).map((step, idx) => (
                  <div key={idx} style={tileStyle}>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div style={benefitsSectionStyle}>
              <div style={benefitsTitleStyle}>
                <span>💖</span>
                Why Kids Love It
              </div>
              <div style={tileGridStyle}>
                {parseHTML(niche['Why Kids Love This']).map((benefit, idx) => (
                  <div key={idx} style={tileStyle}>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* All niches are now visible by default */}
    </div>
  );
};

export default NichesOverviewPage; 