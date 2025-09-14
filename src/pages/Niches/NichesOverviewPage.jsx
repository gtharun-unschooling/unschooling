import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';
import BackButton from '../../components/ui/BackButton';

const NichesOverviewPage = () => {
  const [niches, setNiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleNiches, setVisibleNiches] = useState(20); // Show first 20 niches
  const navigate = useNavigate();

  // Fallback niches data in case API fails
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
    }
  ];

  useEffect(() => {
    setLoading(true);
    console.log('🔍 NichesOverviewPage: Loading all niches');
    
    fetch(`${config.API_BASE_URL}/api/niches`)
      .then(res => {
        console.log('📊 Niches API response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('✅ Niches loaded successfully:', data);
        // Ensure data is an array
        if (Array.isArray(data) && data.length > 0) {
          setNiches(data);
        } else {
          console.warn('⚠️ API returned invalid data, using fallback niches');
          setNiches(fallbackNiches);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching niches:', err);
        console.log('🔄 Using fallback niches data');
        setNiches(fallbackNiches);
        setError('Using offline data - some features may be limited.');
        setLoading(false);
      });
  }, []);

  // Ensure niches is always an array before using slice
  const safeNiches = Array.isArray(niches) ? niches : fallbackNiches;
  const displayNiches = safeNiches.slice(0, visibleNiches);

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
        <div style={{ marginBottom: '1rem' }}>❌ Error loading niches</div>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>{error}</div>
      </div>
    </div>
  );

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
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  };

  const nicheCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
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
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  };

  const nicheTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  };

  const taglineStyle = {
    fontSize: '1rem',
    color: '#6b7280',
    marginTop: '0.5rem',
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
  };

  const approachSectionStyle = {
    ...sectionStyle,
  };

  const approachTitleStyle = {
    ...sectionTitleStyle,
    color: '#16a34a',
  };

  const benefitsSectionStyle = {
    ...sectionStyle,
  };

  const benefitsTitleStyle = {
    ...sectionTitleStyle,
    color: '#2563eb',
  };

  const showMoreStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '1.5rem',
    borderRadius: '1rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px dashed #d1d5db',
    maxWidth: '400px',
    margin: '0 auto',
  };

  const getNicheIcon = (nicheName) => {
    const icons = {
      'Finance': '💰',
      'Communication': '💬',
      'AI': '🤖',
      'Entrepreneurship': '💼',
      'Dance': '💃',
      'Music': '🎵',
      'Nature Exploration': '🌿',
      'Science': '🔬',
      'Art': '🎨',
      'Technology': '💻',
      'Health': '🏃‍♂️',
      'Environment': '🌍',
      'Cooking': '👨‍🍳',
      'Reading': '📚',
      'Math': '📊',
      'Sports': '⚽',
    };
    return icons[nicheName] || '📚';
  };

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
    setVisibleNiches(prev => Math.min(prev + 20, safeNiches.length));
  };

  return (
    <div style={pageStyle}>
      <div style={{ marginBottom: '2rem' }}>
        <BackButton 
          to="/" 
          text="Back to Home" 
          variant="colorful"
          size="medium"
        />
      </div>

      <div style={headerStyle}>
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
          Total {safeNiches.length} learning areas available
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
              }}>
                {getNicheIcon(niche.Niche)}
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

      {visibleNiches < safeNiches.length && (
        <div style={showMoreStyle} onClick={handleShowMore}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📚</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}>
            Show More Niches
          </div>

        </div>
      )}
    </div>
  );
};

export default NichesOverviewPage; 