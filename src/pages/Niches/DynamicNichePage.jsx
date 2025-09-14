import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import config from '../../config/config';
import BackButton from '../../components/ui/BackButton';
// import topics from '../../data/topicsdata.json';
// import niches from '../../data/nichesdata.json';

const DynamicNichePage = () => {
  const { nicheSlug } = useParams();
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
    
    Promise.all([
      fetch(`${config.API_BASE_URL}/api/topics`).then(res => {
        console.log('📊 Topics API response status:', res.status);
        return res.json();
      }),
      fetch(`${config.API_BASE_URL}/api/niches`).then(res => {
        console.log('📊 Niches API response status:', res.status);
        return res.json();
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
        console.error('❌ Error fetching data:', err);
        setError('Failed to load data.');
        setLoading(false);
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
    
    const sectionStyle = {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      minHeight: isMobile ? '300px' : '400px',
      maxHeight: isMobile ? '500px' : '600px',
      width: '100%',
      backgroundColor: backgroundColor || '#1f2937',
      color: nicheDetails['Primary Color'],
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '1rem',
      marginBottom: '2rem',
    };
  
    const titleStyle = {
      position: 'absolute',
      top: '1.5rem',
      left: '2rem',
      fontSize: '1.5rem',
      fontWeight: '700',
      color: nicheDetails['Primary Color'],
      margin: 0,
      zIndex: 2,
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
      color: nicheDetails['Primary Color'],
      marginBottom: '1rem',
      lineHeight: 1.2,
    };
  
    const subheadingStyle = {
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: '500',
      color: nicheDetails['Secondary Color'],
      maxWidth: '500px',
      margin: '0 auto',
      lineHeight: 1.5,
    };
  
    const imageStyle = {
      width: '100%',
      maxWidth: isMobile ? '200px' : '320px',
      height: 'auto',
      objectFit: 'contain',
      borderRadius: '1rem',
      boxShadow: `0 4px 16px ${nicheColor}30`,
    };
  
    return (
      <section style={sectionStyle}>
        <h2 style={titleStyle}>{`#${Niche}`}</h2>
  
        <div style={leftSectionStyle}>
          <div style={taglineStyle}>{heroTagline || `Explore ${Niche}`}</div>
          {nicheDetails['Sub heading'] && (
            <p style={subheadingStyle}>{nicheDetails['Sub heading']}</p>
          )}
        </div>
  
        <div style={rightSectionStyle}>
          {illustrationFile && (
            <img
              src={`/images/${illustrationFile}`}
              alt={`${Niche} illustration`}
              style={imageStyle}
              loading="lazy"
            />
          )}
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
    const headingStyle = {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: nicheColor,
      marginBottom: '2rem',
      textAlign: 'center',
      position: 'relative',
    };
    const contentStyle = {
      fontSize: '1.2rem',
      lineHeight: '1.8',
      color: '#374151',
      marginBottom: '3rem',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '1rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    };
    const tileGridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem',
    };
    const getTileStyle = (index) => ({
      backgroundColor: ['#fef3c7', '#fee2e2', '#f3e8ff', '#ecfdf5', '#fef7cd', '#fce7f3'][index % 6],
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
      border: `2px solid ${['#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'][index % 6]}30`,
      position: 'relative',
      transition: 'all 0.3s ease',
    });

    const problems = parseHTMLToList(problemsHTML);

    return (
      <section style={{ textAlign: 'center', padding: '3rem 0' }}>
        <div style={{
          position: 'relative',
          marginBottom: '3rem',
        }}>
          <h2 style={headingStyle}>
            <span style={{
              backgroundColor: nicheColor,
              color: 'white',
              padding: '0.5rem 2rem',
              borderRadius: '2rem',
              fontSize: '1.5rem',
              fontWeight: '700',
              display: 'inline-block',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            }}>
              🚨 Why Children Struggle With {Niche}
            </span>
          </h2>
        </div>
        
        <div style={contentStyle}>
          <div style={tileGridStyle}>
            {problems.map((problem, index) => (
              <div
                key={index}
                style={getTileStyle(index)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '2rem',
                  fontWeight: '700',
                }}>
                  ⭐
                </div>
                <div style={{ 
                  marginTop: '1rem', 
                  fontSize: '1rem', 
                  color: '#374151',
                  lineHeight: 1.6,
                }}>
                  {problem}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const ApproachSection = () => {
    const headingStyle = {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: nicheColor,
      marginBottom: '2rem',
      textAlign: 'center',
    };
    const contentStyle = {
      fontSize: '1.2rem',
      lineHeight: '1.8',
      color: '#374151',
      marginBottom: '3rem',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '1rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    };
    const tileGridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem',
    };
    const getTileStyle = (index) => ({
      backgroundColor: ['#d1fae5', '#dbeafe', '#f3e8ff', '#fef3c7', '#fee2e2', '#fce7f3'][index % 6],
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
      border: `2px solid ${['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'][index % 6]}30`,
      position: 'relative',
      transition: 'all 0.3s ease',
    });

    const approaches = parseHTMLToList(approachHTML);

    return (
      <section style={{ textAlign: 'center', padding: '3rem 0' }}>
        <div style={{
          position: 'relative',
          marginBottom: '3rem',
        }}>
          <h2 style={headingStyle}>
            <span style={{
              background: `linear-gradient(135deg, ${nicheColor} 0%, ${nicheColor}dd 100%)`,
              color: 'white',
              padding: '0.5rem 2rem',
              borderRadius: '2rem',
              fontSize: '1.5rem',
              fontWeight: '700',
              display: 'inline-block',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
            }}>
              🎯 The Unschooling Way
            </span>
          </h2>
        </div>
        
        <div style={contentStyle}>
          <div style={tileGridStyle}>
            {approaches.map((approach, index) => (
              <div
                key={index}
                style={getTileStyle(index)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '2rem',
                  fontWeight: '700',
                }}>
                  ✅
                </div>
                <div style={{ 
                  marginTop: '1rem', 
                  fontSize: '1rem', 
                  color: '#374151',
                  lineHeight: 1.6,
                }}>
                  {approach}
                </div>
              </div>
            ))}
          </div>
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
      color: nicheColor,
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
      color: nicheColor,
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
      backgroundColor: nicheColor,
      color: '#fff',
      border: 'none',
      borderRadius: '9999px',
      padding: '0.85rem 2rem',
      fontWeight: '700',
      fontSize: '1rem',
      cursor: 'pointer',
      margin: '2rem auto 0',
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
    const headingStyle = {
      fontSize: '2rem',
      fontWeight: '700',
      color: nicheColor,
      marginBottom: '1rem',
      textAlign: 'center',
    };
    const listStyle = {
      listStyleType: 'disc',
      paddingLeft: '1.2rem',
      fontSize: '1.1rem',
      color: '#374151',
      maxWidth: '650px',
      marginBottom: '3rem',
      margin: '0 auto',
    };

    return (
      <section style={{ textAlign: 'center' }}>
        <h2 style={headingStyle}>Why Kids Love Learning This Way</h2>
        <ul style={listStyle} dangerouslySetInnerHTML={{ __html: whyKidsLoveHTML }} />
      </section>
    );
  };

  const CTASection = () => {
    const sectionStyle = {
      backgroundColor: nicheColor,
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.3rem',
      marginTop: '3rem',
    };
    const buttonStyle = {
      marginTop: '1rem',
      backgroundColor: '#fff',
      color: nicheColor,
      fontWeight: '700',
      borderRadius: '9999px',
      padding: '0.8rem 3rem',
      fontSize: '1.1rem',
      border: 'none',
      cursor: 'pointer',
    };

    return (
      <section style={sectionStyle}>
        <p>{suggestionText || `Ready to Begin your journey with ${Niche}?`}</p>
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
      <div style={{ marginBottom: '2rem' }}>
        <BackButton 
          to="/" 
          text="Back to Home" 
          variant={nicheSlug || "colorful"}
          size="medium"
        />
      </div>
      <HeroSection />
      <ProblemSection />
      <ApproachSection />
      <TopicsSection />
      <ImpactSection />
      <CTASection />
    </div>
  );
};

export default DynamicNichePage;
