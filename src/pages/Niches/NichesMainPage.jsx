// 📄 Niches Page (React - Inline Styles with Carousel & Sections)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import config from '../../config/config';
import NicheIcon from '../../components/ui/NicheIcon';
import MinimalBackButton from '../../components/ui/MinimalBackButton';



// 🧭 Hero Section for Niches Page
const HeroSection = () => {
    const sectionStyle = {
      background: 'linear-gradient(to right, #e0f2fe, #f0f9ff)',
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
      color: '#0369a1',
      marginBottom: '1rem',
    };
  
    const paragraphStyle = {
      fontSize: '1.25rem',
      lineHeight: '1.8',
      color: '#0c4a6e',
      maxWidth: '700px',
    };
  
    const iconBox = {
      width: '16rem',
      height: '16rem',
      backgroundColor: '#bae6fd',
      borderRadius: '9999px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      fontSize: '5rem',
      color: '#0369a1',
    };
  
    return (
      <section style={sectionStyle}>
        <MinimalBackButton 
          heroColors={{
            backgroundColor: '#e0f2fe',
            primaryColor: '#0369a1',
            nicheColor: '#0c4a6e'
          }}
        />
        <div style={containerStyle}>
          <div>
            <h1 style={headingStyle}>Niches</h1>
            <p style={paragraphStyle}>
              Discover exciting paths your child can explore — from creativity to technology, nature to leadership. 
              Niches help them find what they love and build unique strengths.
            </p>
          </div>
          <div style={iconBox}>🧭</div>
        </div>
      </section>
    );
  };

// 🧭 Niches Grid Section with Modals

const NichesGridSection = () => {
  const [selectedNiche, setSelectedNiche] = useState(null);
  const [niches, setNiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleNiches, setVisibleNiches] = useState(() => {
    // Get saved count from localStorage, default to 6 if first visit
    const saved = localStorage.getItem('nichesVisibleCount');
    return saved ? parseInt(saved) : 6;
  });
  const navigate = useNavigate();

  // Fallback niches data in case API fails - 12 niches with vibrant colors
  const fallbackNiches = [
    {
      Niche: "Artificial Intelligence",
      "Sub heading": "Explore the future of technology and machine learning",
      "Niche Slug": "artificial-intelligence",
      Illustration: "/website/niches/ai.png",
      Color: "#667eea"
    },
    {
      Niche: "Creative Writing",
      "Sub heading": "Develop storytelling skills and creative expression",
      "Niche Slug": "creative-writing",
      Illustration: "/website/niches/writing.png",
      Color: "#f59e0b"
    },
    {
      Niche: "Environmental Science",
      "Sub heading": "Learn about nature, sustainability, and our planet",
      "Niche Slug": "environmental-science",
      Illustration: "/website/niches/nature.png",
      Color: "#10b981"
    },
    {
      Niche: "Mathematics",
      "Sub heading": "Discover the beauty of numbers and problem-solving",
      "Niche Slug": "mathematics",
      Illustration: "/website/niches/math.png",
      Color: "#8b5cf6"
    },
    {
      Niche: "Music & Arts",
      "Sub heading": "Express creativity through sound and visual arts",
      "Niche Slug": "music-arts",
      Illustration: "/website/niches/arts.png",
      Color: "#ec4899"
    },
    {
      Niche: "Physical Education",
      "Sub heading": "Build strength, coordination, and healthy habits",
      "Niche Slug": "physical-education",
      Illustration: "/website/niches/sports.png",
      Color: "#f97316"
    },
    {
      Niche: "Finance",
      "Sub heading": "Learn money management and financial literacy",
      "Niche Slug": "finance",
      Illustration: "/website/niches/finance.png",
      Color: "#059669"
    },
    {
      Niche: "Communication",
      "Sub heading": "Develop speaking, listening, and social skills",
      "Niche Slug": "communication",
      Illustration: "/website/niches/communication.png",
      Color: "#0ea5e9"
    },
    {
      Niche: "Entrepreneurship",
      "Sub heading": "Learn to create, innovate, and build businesses",
      "Niche Slug": "entrepreneurship",
      Illustration: "/website/niches/entrepreneurship.png",
      Color: "#7c3aed"
    },
    {
      Niche: "Science",
      "Sub heading": "Explore the wonders of the natural world",
      "Niche Slug": "science",
      Illustration: "/website/niches/science.png",
      Color: "#dc2626"
    },
    {
      Niche: "Technology",
      "Sub heading": "Master digital tools and programming basics",
      "Niche Slug": "technology",
      Illustration: "/website/niches/technology.png",
      Color: "#1f2937"
    },
    {
      Niche: "Health & Wellness",
      "Sub heading": "Learn about nutrition, fitness, and mental health",
      "Niche Slug": "health-wellness",
      Illustration: "/website/niches/health.png",
      Color: "#16a34a"
    }
  ];

  useEffect(() => {
    setLoading(true);
    console.log('🔍 NichesGridSection: Loading ALL niches from nichesdata.json');
    
    // Load ALL niches from the actual data file
    fetch('/nichesdata.json')
      .then(res => {
        console.log('📊 Niches data response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('✅ ALL niches loaded successfully:', data.length, 'niches');
        console.log('📝 Available niches:', data.map(n => n.Niche));
        setNiches(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching niches data:', err);
        console.log('🔄 Using fallback niches data');
        setNiches(fallbackNiches);
        setError(null);
        setLoading(false);
      });
  }, []);

  // Ensure niches is always an array - show initial 6, then all on "Show More"
  const safeNiches = Array.isArray(niches) ? niches : fallbackNiches;
  const displayNiches = safeNiches.slice(0, visibleNiches); // Show limited niches initially

  const sectionStyle = {
    padding: '5vh 5vw',
    backgroundColor: '#f0fdf4',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#065f46',
    textAlign: 'center',
    marginBottom: '2.5rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    justifyItems: 'center',
  };

  const tileStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '1.25rem',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    textAlign: 'center',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '280px',
    cursor: 'pointer',
  };

  const imageStyle = {
    width: '80px',
    height: '80px',
    marginBottom: '1rem',
    borderRadius: '0.75rem',
    objectFit: 'cover',
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#047857',
    marginBottom: '0.5rem',
  };

  const descStyle = {
    fontSize: '0.95rem',
    color: '#374151',
    minHeight: '3.5rem',
  };

  const loadMoreButtonStyle = {
    marginTop: '3rem',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '1rem 2.5rem',
    backgroundColor: '#047857',
    color: 'white',
    border: 'none',
    borderRadius: '999px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(4, 120, 87, 0.3)',
  };

  const handleLoadMore = () => {
    setVisibleNiches(prev => {
      // Show all remaining niches at once
      const newCount = safeNiches.length;
      // Save to localStorage so it persists across visits
      localStorage.setItem('nichesVisibleCount', newCount.toString());
      return newCount;
    });
  };

  const handleShowLess = () => {
    setVisibleNiches(prev => {
      // Show only first 12 niches
      const newCount = 12;
      // Save to localStorage so it persists across visits
      localStorage.setItem('nichesVisibleCount', newCount.toString());
      return newCount;
    });
  };

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Loading niches...</p>
    </div>
  );

  return (
    <section style={sectionStyle}>
      <h2 style={headingStyle}>Top Niches to Explore</h2>
      
      {error && (
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderRadius: '8px',
          border: '1px solid #f59e0b'
        }}>
          {error}
        </div>
      )}
      
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        fontSize: '1.1rem',
        color: '#6b7280',
        fontWeight: '500',
      }}>
        Discover diverse learning paths tailored to your child's interests
      </div>
      
      <div style={gridStyle}>
        {displayNiches.map((niche, index) => (
          <div
            key={index}
            style={tileStyle}
            onClick={() => navigate(`/niche/${niche['Niche Slug'] || niche.Niche.toLowerCase().replace(/\s+/g, '-')}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
            }}
          >
            {/* Niche Icon */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: '1rem',
              height: '80px'
            }}>
              <NicheIcon niche={niche.Niche || niche.title} size="large" />
            </div>
            <h3 style={titleStyle}>{niche.Niche || niche.title}</h3>
            <p style={descStyle}>{niche['Sub heading'] || niche.desc}</p>
          </div>
        ))}
      </div>
      
      {visibleNiches < safeNiches.length ? (
        <button 
          style={loadMoreButtonStyle}
          onClick={handleLoadMore}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#065f46';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(4, 120, 87, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#047857';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(4, 120, 87, 0.3)';
          }}
        >
          Show More
        </button>
      ) : (
        <button 
          style={{
            ...loadMoreButtonStyle,
            backgroundColor: '#dc2626',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
          }}
          onClick={handleShowLess}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#b91c1c';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(185, 28, 28, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#dc2626';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
          }}
        >
          Show Less
        </button>
      )}
    </section>
  );
};
  

// 🎯 Why This Niche Matters Section (Standalone for Niches Page)
const WhyThisNicheMatters = () => {
    const sectionStyle = {
      padding: '6vh 5vw',
      backgroundColor: '#f0fdf4',
      textAlign: 'center',
    };
  
    const headingStyle = {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#065f46',
      marginBottom: '1.5rem',
    };
  
    const paragraphStyle = {
      fontSize: '1.15rem',
      color: '#064e3b',
      maxWidth: '800px',
      margin: '0 auto 3rem',
      lineHeight: '1.8',
    };
  
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      maxWidth: '1000px',
      margin: '0 auto',
    };
  
    const iconCardStyle = {
      backgroundColor: '#d1fae5',
      padding: '1.5rem',
      borderRadius: '1.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    };
  
    const emojiStyle = {
      fontSize: '2.5rem',
      marginBottom: '1rem',
    };
  
    const benefitTitleStyle = {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#065f46',
    };
  
    const benefits = [
      { icon: '🌈', title: 'Ignites Creativity' },
      { icon: '🧠', title: 'Builds Focus & Patience' },
      { icon: '💬', title: 'Enables Expression' },
      { icon: '✋', title: 'Enhances Motor Skills' },
    ];

    return (
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Why This Niche Matters</h2>
        <p style={paragraphStyle}>
          Each niche is designed to spark a child’s natural interests through hands-on, real-world learning.
          These focused topics go beyond textbooks to nurture creativity, expression, problem-solving, and curiosity — 
          helping children develop useful life skills while having fun and staying engaged.
        </p>
        <div style={gridStyle}>
          {benefits.map((benefit, index) => (
            <div key={index} style={iconCardStyle}>
              <span style={emojiStyle}>{benefit.icon}</span>
              <span style={benefitTitleStyle}>{benefit.title}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
const WeeklyKitSection = () => {
    const sectionStyle = {
      maxWidth: '800px',
      margin: '3rem auto',
      padding: '2rem',
      backgroundColor: '#f5efe6', // warm beige
      borderRadius: '1rem',
      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#003049', // deep navy-ish text
    };
  
    const headingStyle = {
      fontSize: '2.5rem',
      fontWeight: '600',
      marginBottom: '2rem',
      color: '#003049',
      textAlign: 'center',
    };
  
    const iconsGridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '2rem',
      marginBottom: '3rem',
      textAlign: 'center',
      color: '#d77e82', // muted coral
    };
  
    const iconItemStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    };
  
    const iconEmojiStyle = {
      fontSize: '3.5rem',
      marginBottom: '0.5rem',
    };
  
    const iconLabelStyle = {
      fontSize: '1rem',
      fontWeight: '500',
    };
  
    const carouselStyle = {
      display: 'flex',
      overflowX: 'auto',
      gap: '1.5rem',
      paddingBottom: '0.5rem',
      scrollbarWidth: 'thin',
      scrollbarColor: '#8aa29e #f5efe6',
    };
  
    const weeklyCardStyle = {
      minWidth: '220px',
      backgroundColor: '#ffffff',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
      flexShrink: 0,
    };
  
    const weekTitleStyle = {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#003049',
      marginBottom: '0.5rem',
    };
  
    const weekDescStyle = {
      fontSize: '1rem',
      color: '#374151', // charcoal gray
    };
  
    const icons = [
      { id: 1, label: 'Printable sheets', icon: '📄' },
      { id: 2, label: 'AI video lesson', icon: '🎥' },
      { id: 3, label: 'Surprise task', icon: '🎁' },
      { id: 4, label: 'Parental guidance', icon: '👨‍👩‍👧‍👦' },
      { id: 5, label: 'Achievement badge', icon: '🏅' },
    ];
  
    const weeklyPreviews = [
      { week: 'Week 1', description: 'Introduction to the theme & printable activities' },
      { week: 'Week 2', description: 'AI video lesson & guided tasks' },
      { week: 'Week 3', description: 'Surprise task & parental support materials' },
      { week: 'Week 4', description: 'Achievement badge & review session' },
    ];
  
    return (
      <section aria-label="What’s Inside the Weekly Kit" style={sectionStyle}>
        <h2 style={headingStyle}>What’s Inside the Weekly Kit</h2>
  
        <div style={iconsGridStyle}>
          {icons.map(({ id, label, icon }) => (
            <div key={id} style={iconItemStyle} role="img" aria-label={label} title={label}>
              <div style={iconEmojiStyle}>{icon}</div>
              <span style={iconLabelStyle}>{label}</span>
            </div>
          ))}
        </div>
  
        <div style={carouselStyle} role="list" aria-label="Weekly Kit Preview Carousel">
          {weeklyPreviews.map(({ week, description }, index) => (
            <div key={index} role="listitem" style={weeklyCardStyle}>
              <h3 style={weekTitleStyle}>{week}</h3>
              <p style={weekDescStyle}>{description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  const TrackGrowthSection = () => {
    const sectionStyle = {
      maxWidth: '800px',
      margin: '3rem auto',
      padding: '2rem',
      backgroundColor: '#e7f0f2', // soft muted teal background
      borderRadius: '1rem',
      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#003049', // deep navy text
    };
  
    const headingStyle = {
      fontSize: '2.5rem',
      fontWeight: '600',
      marginBottom: '2rem',
      textAlign: 'center',
      color: '#003049',
    };
  
    const listStyle = {
      listStyle: 'none',
      padding: 0,
      fontSize: '1.25rem',
      lineHeight: '1.8',
      color: '#374151', // charcoal gray
      display: 'grid',
      gridTemplateColumns: '1fr',
      rowGap: '1rem',
    };
  
    const listItemStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    };
  
    const iconStyle = {
      fontSize: '2rem',
      color: '#d77e82', // muted coral
    };
  
    return (
      <section aria-label="Track Growth with Insights" style={sectionStyle}>
        <h2 style={headingStyle}>Track Growth with Insights</h2>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            <span style={iconStyle} role="img" aria-label="Progress Bars">📊</span>
            Progress bars per week
          </li>
          <li style={listItemStyle}>
            <span style={iconStyle} role="img" aria-label="Portfolio">📁</span>
            Portfolio of creations
          </li>
          <li style={listItemStyle}>
            <span style={iconStyle} role="img" aria-label="Skills Improved">🧩</span>
            Skills improved
          </li>
          <li style={listItemStyle}>
            <span style={iconStyle} role="img" aria-label="Smart Suggestions">📝</span>
            Smart suggestions for next niche
          </li>
        </ul>
      </section>
    );
  };
  
  const CTASection = () => {
    const sectionStyle = {
      maxWidth: '700px',
      margin: '4rem auto',
      padding: '2rem 2.5rem',
      backgroundColor: '#f5efe6', // warm beige
      borderRadius: '1rem',
      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
      textAlign: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#003049',
    };
  
    const headingStyle = {
      fontSize: '2.8rem',
      fontWeight: '700',
      marginBottom: '2rem',
    };
  
    const formStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      marginBottom: '2rem',
    };
  
    const selectStyle = {
      padding: '0.75rem 1rem',
      fontSize: '1.1rem',
      borderRadius: '0.5rem',
      border: '1.5px solid #d77e82',
      outline: 'none',
      color: '#003049',
    };
  
    const inputStyle = {
      padding: '0.75rem 1rem',
      fontSize: '1.1rem',
      borderRadius: '0.5rem',
      border: '1.5px solid #d77e82',
      outline: 'none',
      color: '#003049',
    };
  
    const buttonStyle = {
      padding: '1rem 2rem',
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#fff',
      backgroundColor: '#d77e82', // muted coral
      border: 'none',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(215,126,130,0.6)',
      transition: 'background-color 0.3s ease',
    };
  
    const buttonHover = {
      backgroundColor: '#b56468',
    };
  
    const assuranceStyle = {
      marginTop: '1.5rem',
      fontSize: '1rem',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    };
  
    const assuranceIconStyle = {
      fontSize: '1.3rem',
      color: '#8aa29e', // muted teal
    };
  
    // We can add a simple state hover effect on the button using React hooks if you want, but for simplicity here, it's static
  
    return (
      <section aria-label="Start Now Call to Action" style={sectionStyle}>
        <h2 style={headingStyle}>Start Now</h2>
        <form style={formStyle} onSubmit={e => e.preventDefault()}>
          <select style={selectStyle} aria-label="Choose Plan" defaultValue="">
            <option value="" disabled>Choose Plan</option>
            <option value="free-trial">Free Trial</option>
            <option value="one-week">One Week</option>
            <option value="full-month">Full Month</option>
          </select>
          <input
            type="date"
            aria-label="Select Start Date"
            style={inputStyle}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          <button type="submit" style={buttonStyle}>Get My Kit</button>
        </form>
        <div style={assuranceStyle}>
          <span style={assuranceIconStyle} role="img" aria-label="Guarantee Badge">🛡️</span>
          <span>Satisfaction guarantee, pause/cancel anytime</span>
        </div>
      </section>
    );
  };
  


  // ✅ Main Page that combines all sections
  const NichesMainPage = () => {
    const location = useLocation();
    
    return (
      <div>
        <HeroSection />
        <NichesGridSection />
        <WhyThisNicheMatters />
        <WeeklyKitSection />
        <TrackGrowthSection />
        {/* <CTASection /> - Removed Start Now section */}
      </div>
    );
  };
  
  export default NichesMainPage;