import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
// import topics from '../../data/topicsdata.json';
// import niches from '../../data/nichesdata.json';

const DynamicNichePage = () => {
  const { nicheSlug } = useParams();
  const [topics, setTopics] = useState([]);
  const [niches, setNiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/topics').then(res => res.json()),
      fetch('/api/niches').then(res => res.json())
    ])
      .then(([topicsData, nichesData]) => {
        setTopics(topicsData);
        setNiches(nichesData);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load data.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!nicheSlug) return <p>Error: No niche provided in the URL.</p>;

  const nicheDetails = niches.find(n => n['Niche Slug'] === nicheSlug);
  if (!nicheDetails) return <p>Error: No niche found for slug: {nicheSlug}</p>;

  const topicList = topics.filter(t => t.Niche === nicheDetails.Niche);

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

  const LESSONS_PER_PAGE = 10;
  const [visibleLessons, setVisibleLessons] = useState(LESSONS_PER_PAGE);
  const handleShowMore = () => setVisibleLessons(prev => prev + LESSONS_PER_PAGE);

  const pageStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '3rem 5vw',
    backgroundColor: '#f9fafb',
    color: '#1f2937',
    // maxWidth: '1200px',
    margin: 'auto',
  };

  // ✅ COMPONENT SECTIONS


  const HeroSection = () => {
    const sectionStyle = {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      width: '100vw',
      backgroundColor: backgroundColor || '#1f2937',
      color: nicheDetails['Primary Color'],
      position: 'relative',
      overflow: 'hidden',
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
      width: '70%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 2rem',
      boxSizing: 'border-box',
    };
  
    const rightSectionStyle = {
      width: '30%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: '2rem',
      boxSizing: 'border-box',
    };
  
    const taglineStyle = {
      fontSize: '3rem',
      fontWeight: '800',
      color: nicheDetails['Primary Color'],
      marginBottom: '1rem',
    };
  
    const subheadingStyle = {
      fontSize: '1rem',
      fontWeight: '500',
      color: nicheDetails['Secondary Color'],
      maxWidth: '500px',
      margin: '0 auto',
    };
  
    const imageStyle = {
      width: '100%',
      maxWidth: '320px',
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
  
  
  
  
  
  
  

  const ProblemSection = () => {
    const headingStyle = {
      fontSize: '2rem',
      fontWeight: '700',
      color: nicheColor,
      marginBottom: '1rem',
    };
    const contentStyle = {
      fontSize: '1.1rem',
      lineHeight: '1.7',
      color: '#4b5563',
      marginBottom: '3rem',
      maxWidth: '800px',
    };

    return (
      <section>
        <h2 style={headingStyle}>Why Children Struggle With {Niche}</h2>
        <div style={contentStyle} dangerouslySetInnerHTML={{ __html: problemsHTML }} />
        <p style={{ ...contentStyle, textAlign: 'center', fontStyle: 'italic' }}>
          This is why most adults regret not learning it earlier. So we created an approach that actually works…
        </p>
      </section>
    );
  };

  const ApproachSection = () => {
    const headingStyle = {
      fontSize: '2rem',
      fontWeight: '700',
      color: nicheColor,
      marginBottom: '1rem',
    };
    const contentStyle = {
      fontSize: '1.1rem',
      lineHeight: '1.7',
      color: '#4b5563',
      marginBottom: '3rem',
      maxWidth: '800px',
    };

    return (
      <section>
        <h2 style={headingStyle}>The Unschooling Way</h2>
        <div style={contentStyle} dangerouslySetInnerHTML={{ __html: approachHTML }} />
      </section>
    );
  };


  const TopicsSection = () => {
    const { nicheSlug } = useParams(); // get the current niche from the URL
    // const nicheSlug = nicheName.toLowerCase().replace(/\s+/g, '-');
  
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
        <div style={listWrapperStyle}>
            {topicList.slice(0, visibleLessons).map((topic, idx) => {
            if (!topic || !topic.Topic) return null;
            const topicSlug = topic.Topic.toLowerCase().replace(/\s+/g, '-');
                    return (
                <Link
                key={idx}
                to={`/niche/${nicheSlug}/${topicSlug}`} // use outer scope's `nicheSlug`
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
          <button onClick={handleShowMore} style={buttonStyle}>Show More</button>
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
    };
    const listStyle = {
      listStyleType: 'disc',
      paddingLeft: '1.2rem',
      fontSize: '1.1rem',
      color: '#374151',
      maxWidth: '650px',
      marginBottom: '3rem',
    };

    return (
      <section>
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
