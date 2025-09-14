import { useParams, Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import config from '../../config/config';
import BackButton from '../../components/ui/BackButton';
// import topicData from '../../data/topicsdata.json';

const DynamicTopicPage = () => {
  const { nicheSlug, topicSlug } = useParams();
  const location = useLocation();
  const [topicData, setTopicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    console.log('🔍 DynamicTopicPage: Loading data for nicheSlug:', nicheSlug, 'topicSlug:', topicSlug);
    console.log('🔍 DynamicTopicPage: API_BASE_URL:', config.API_BASE_URL);
    
    fetch(`${config.API_BASE_URL}/api/topics`)
      .then(res => {
        console.log('📊 Topics API response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('✅ Topics data loaded:', data.length, 'topics');
        console.log('🔍 Sample topic data:', data.slice(0, 2));
        setTopicData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching topics data:', err);
        setError('Failed to load topics data.');
        setLoading(false);
      });
  }, [nicheSlug, topicSlug]);

  // ✅ Safety checks on route params
  const decodedNiche = (nicheSlug || '').replace(/-/g, ' ').toLowerCase();
  const decodedTopic = (topicSlug || '').replace(/-/g, ' ').toLowerCase();
  
  // Add more robust debugging
  console.log('🔍 URL Decoding Debug:');
  console.log('  Original nicheSlug:', nicheSlug);
  console.log('  Original topicSlug:', topicSlug);
  console.log('  Decoded niche:', decodedNiche);
  console.log('  Decoded topic:', decodedTopic);
  
  console.log('🔍 DynamicTopicPage Debug Info:');
  console.log('  nicheSlug:', nicheSlug);
  console.log('  topicSlug:', topicSlug);
  console.log('  decodedNiche:', decodedNiche);
  console.log('  decodedTopic:', decodedTopic);

  // ✅ Preprocess dataset once
  const cleanData = Array.isArray(topicData)
    ? topicData.filter(item => item.Niche && item.Topic)
    : [];

  // ✅ Try finding a match
  console.log('🔍 Looking for topic match:');
  console.log('  Looking for niche:', decodedNiche);
  console.log('  Looking for topic:', decodedTopic);
  
  const foundTopic = cleanData.find(
    (item) => {
      const nicheMatch = item.Niche.toLowerCase() === decodedNiche;
      const topicMatch = item.Topic.toLowerCase() === decodedTopic;
      
      // Add more detailed logging for debugging
      console.log(`  Checking: "${item.Niche}" (${nicheMatch ? '✅' : '❌'}) "${item.Topic}" (${topicMatch ? '✅' : '❌'})`);
      
      // If exact match fails, try partial matching for better debugging
      if (!nicheMatch || !topicMatch) {
        console.log(`    Debug - Niche comparison: "${item.Niche.toLowerCase()}" vs "${decodedNiche}"`);
        console.log(`    Debug - Topic comparison: "${item.Topic.toLowerCase()}" vs "${decodedTopic}"`);
      }
      
      return nicheMatch && topicMatch;
    }
  );
  
  console.log('🔍 Found topic:', foundTopic ? 'YES' : 'NO');
  if (foundTopic) {
    console.log('📋 Found topic details:', {
      Topic: foundTopic.Topic,
      Age: foundTopic.Age,
      'Estimated Time': foundTopic['Estimated Time'],
      Hashtags: foundTopic.Hashtags
    });
  }

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
        <div style={{ marginBottom: '1rem' }}>🔄 Loading topic page...</div>
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

  if (!foundTopic) {
    console.error('❌ Topic not found:', { decodedNiche, decodedTopic });
    console.log('🔍 Available topics:', cleanData.map(t => ({ niche: t.Niche, topic: t.Topic })));
    
    // Try to find similar topics for better debugging
    const similarTopics = cleanData.filter(item => 
      item.Niche.toLowerCase().includes(decodedNiche) || 
      item.Topic.toLowerCase().includes(decodedTopic)
    );
    
    if (similarTopics.length > 0) {
      console.log('🔍 Similar topics found:', similarTopics.map(t => ({ niche: t.Niche, topic: t.Topic })));
    }
    
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
          <div style={{ marginBottom: '1rem' }}>❌ Topic Not Found</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            Could not find topic "{decodedTopic}" in niche "{decodedNiche}"
          </div>
          <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '1rem' }}>
            URL: /niche/{nicheSlug}/{topicSlug}
          </div>
          {similarTopics.length > 0 && (
            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '1rem' }}>
              Similar topics: {similarTopics.slice(0, 3).map(t => t.Topic).join(', ')}
            </div>
          )}
        </div>
      </div>
    );
  }



  const HeroSection = ({ topicData }) => {
    const wrapper = {
      backgroundColor: '#e0f2fe', // light sky blue
      height: '250px', // increased height
      borderRadius: '1rem',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    };
  
    const headingStyle = {
      fontSize: '3rem',
      fontWeight: '800',
      color: '#0c4a6e', // deep blue
      margin: 0,
    };
  
    return (
      <div style={wrapper}>
        <h1 style={headingStyle}>{topicData.Topic}</h1>
      </div>
    );
  };
  
  const DetailBarSection = ({ topicData }) => {
    const barWrapper = {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1.5rem',
      marginBottom: '2.5rem',
      alignItems: 'flex-start',
    };
  
    const sectionWrapper = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
    };
  
    const labelStyle = {
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '0.4rem',
    };
  
    const baseBox = {
      width: '100%',
      borderRadius: '0.75rem',
      padding: '0.75rem',
      fontSize: '0.95rem',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      minHeight: '4.5rem', // Ensure consistent height
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    };
  
    const ageBox = {
      ...baseBox,
      backgroundColor: '#fef9c3', // light yellow
    };
  
    const timeBox = {
      ...baseBox,
      backgroundColor: '#d1fae5', // light green
    };
  
    const tagBox = {
      ...baseBox,
      backgroundColor: '#e0f2fe', // light blue
      whiteSpace: 'pre-line',
      lineHeight: '1.4',
    };
  
    // Format tags: no double hashtags, one tag per line
    const formattedTags = Array.from(
      new Set(
        (topicData.Hashtags || '')
          .split(/[, ]+/)
          .map((tag) => tag.replace(/^#+/, '').trim())
          .filter(Boolean)
      )
    )
      .map((tag) => `#${tag}`)
      .join('\n');
  
    console.log('🔍 DetailBarSection - topicData.Age:', topicData.Age, 'Type:', typeof topicData.Age);
    
    return (
      <div style={barWrapper}>
        <div style={sectionWrapper}>
          <span style={labelStyle}>Age Group</span>
          <div style={ageBox}>{topicData.Age}</div>
        </div>
        <div style={sectionWrapper}>
          <span style={labelStyle}>Estimated Time</span>
          <div style={timeBox}>{topicData['Estimated Time']}</div>
        </div>
        <div style={sectionWrapper}>
          <span style={labelStyle}>Hashtags</span>
          <div style={tagBox}>{formattedTags}</div>
        </div>
      </div>
    );
  };
  
  const ObjectiveSection = ({ topicData }) => {
    const sectionWrapper = {
      marginBottom: '2rem',
    };
  
    const titleStyle = {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#334155',
      marginBottom: '0.6rem',
    };
  
    const boxStyle = {
      backgroundColor: '#e0f2fe', // light blue
      padding: '1.25rem',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      color: '#0f172a',
      lineHeight: '1.7',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    };
  
    return (
      <div style={sectionWrapper}>
        <h3 style={titleStyle}>Objective:</h3>
        <div style={boxStyle}>{topicData.Objective}</div>
      </div>
    );
  };
  
  
  const ExplanationSection = ({ topicData }) => {
    const sectionWrapper = {
      marginBottom: '2rem',
    };
  
    const titleStyle = {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#334155',
      marginBottom: '0.6rem',
    };
  
    const boxStyle = {
      backgroundColor: '#fef9c3', // light yellow
      padding: '1.25rem 1.75rem',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      color: '#0f172a',
      lineHeight: '1.7',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    };
  
    const formatContent = (text) => {
      // Break lines by bullet symbols or new lines
      return text
        .split(/\n|(?=^[•*-]\s)/gm)
        .filter(line => line.trim() !== '')
        .map((line, index) => (
          <p key={index} style={{ margin: '0 0 0.6rem 0' }}>
            {line.trim()}
          </p>
        ));
    };
  
    return (
      <div style={sectionWrapper}>
        <h3 style={titleStyle}>Explanation:</h3>
        <div style={boxStyle}>
          {formatContent(topicData.Explanation)}
        </div>
      </div>
    );
  };
  
  
  
  const ActivitiesSection = ({ topicData }) => {
    const containerStyle = {
      display: 'flex',
      width: '100%',
      overflowX: 'auto',
      scrollSnapType: 'x mandatory',
      WebkitOverflowScrolling: 'touch', // smooth scrolling on iOS
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none', // IE 10+
    };
  
    // Hide scrollbar for Chrome, Safari and Opera using CSS pseudo-element trick:
    const containerClass = {
      // We can't do this inline, so we'll add a style tag below for this.
    };
  
    const activityBoxStyle = {
      flexShrink: 0,
      width: '50%',
      minWidth: '50%',
      height: 'auto',
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      scrollSnapAlign: 'start',
      marginRight: '1rem',
    };
  
    const activityBoxStyle1 = {
      ...activityBoxStyle,
      backgroundColor: '#f0f9ff', // Light blue
      marginRight: '1rem',
    };
  
    const activityBoxStyle2 = {
      ...activityBoxStyle,
      backgroundColor: '#fff7ed', // Light orange
      marginRight: '0',
    };
  
    const mainHeaderStyle = {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#000000',
      marginBottom: '1.5rem',
    };
  
    const activityTitleStyle = {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#000000',
      marginBottom: '1.25rem',
      textAlign: 'center',
    };
  
    const sectionTitle = {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#000000',
      marginTop: '1rem',
      marginBottom: '0.3rem',
    };
  
    const paragraphStyle = {
      fontSize: '1rem',
      color: '#374151',
      lineHeight: '1.6',
      whiteSpace: 'pre-line',
    };
  
    const parseActivity = (activityString) => {
      if (!activityString) return null;
  
      // Robust section extraction for headings (handles whitespace and colon issues)
      const getSectionContent = (lines, heading, nextHeadings) => {
        const headingIndex = lines.findIndex(line => line.replace(/\s+/g, ' ').trim().toLowerCase().includes(heading.toLowerCase()));
        if (headingIndex === -1) return '';
        
        // Extract content from the same line after the heading
        const currentLine = lines[headingIndex];
        const headingLower = heading.toLowerCase();
        const headingStart = currentLine.toLowerCase().indexOf(headingLower);
        if (headingStart !== -1) {
          const contentAfterHeading = currentLine.substring(headingStart + heading.length).trim();
          if (contentAfterHeading) {
            return contentAfterHeading;
          }
        }
        
        // If no content on same line, look for next lines
        let endIndex = lines.length;
        for (const next of nextHeadings) {
          const nextIndex = lines.findIndex((line, idx) => idx > headingIndex && line.replace(/\s+/g, ' ').trim().toLowerCase().includes(next.toLowerCase()));
          if (nextIndex !== -1 && nextIndex < endIndex) endIndex = nextIndex;
        }
        return lines.slice(headingIndex + 1, endIndex).join('\n').trim();
      };

      const lines = activityString.split('\n').map(line => line.trim());
      const title = lines[0] || 'Activity';
      const materialsLine = lines.find(line => line.toLowerCase().startsWith('materials needed:'));
      let materials = '';
      if (materialsLine) {
        const colonIndex = materialsLine.indexOf(':');
        materials = materialsLine.slice(colonIndex + 1).trim();
      }
      const steps = getSectionContent(lines, 'Steps to Follow:', ['What Should Be Achieved:', 'What is Gained:']);
      const achieved = getSectionContent(lines, 'What Should Be Achieved:', ['What is Gained:']);
      const gained = getSectionContent(lines, 'What is Gained:', []);
      return { title, materials, steps, achieved, gained };
    };
  
    const activity1 = parseActivity(topicData['Activity 1']);
    const activity2 = parseActivity(topicData['Activity 2']);

    console.log("Raw Activity 1:", topicData['Activity 1']);
    console.log("Raw Activity 2:", topicData['Activity 2']);
    console.log("Parsed Activity 1:", activity1);
    console.log("Parsed Activity 2:", activity2);
    console.log("Activity 1 achieved section:", activity1?.achieved);
    console.log("Activity 2 achieved section:", activity2?.achieved);
  
    return (
      <>
        {/* Hide scrollbar styles */}
        <style>{`
          /* Hide scrollbar for Chrome, Safari and Opera */
          .activities-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
  
        <div>
          <h1 style={mainHeaderStyle}>Activities</h1>
  
          <div className="activities-container" style={containerStyle}>
            {activity1 && (
              <div style={activityBoxStyle1} key="activity1">
                <h2 style={activityTitleStyle}>{activity1.title}</h2>
  
                <h4 style={sectionTitle}>Materials Needed</h4>
                <p style={paragraphStyle}>{activity1.materials}</p>
  
                <h4 style={sectionTitle}>Steps to Follow</h4>
                <p style={paragraphStyle}>{activity1.steps}</p>
  
                <h4 style={sectionTitle}>What Should Be Achieved</h4>
                <p style={paragraphStyle}>{activity1.achieved || 'No data found'}</p>
  
                <h4 style={sectionTitle}>What is Gained</h4>
                <p style={paragraphStyle}>{activity1.gained}</p>
              </div>
            )}
  
            {activity2 && (
              <div style={activityBoxStyle2} key="activity2">
                <h2 style={activityTitleStyle}>{activity2.title}</h2>
  
                <h4 style={sectionTitle}>Materials Needed</h4>
                <p style={paragraphStyle}>{activity2.materials}</p>
  
                <h4 style={sectionTitle}>Steps to Follow</h4>
                <p style={paragraphStyle}>{activity2.steps}</p>
  
                <h4 style={sectionTitle}>What Should Be Achieved</h4>
                <p style={paragraphStyle}>{activity2.achieved || 'No data found'}</p>
  
                <h4 style={sectionTitle}>What is Gained</h4>
                <p style={paragraphStyle}>{activity2.gained}</p>
              </div>
            )}
          </div>
        </div>


      </>
    );
  };
  
  

  




return (
    <div
      style={{
        padding: '3rem 2rem',
        maxWidth: '1200px', // Increase the max width to use more horizontal space
        padding: '1rem 1rem', // Increase horizontal padding as needed
        margin: '0 auto',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Back Button */}
      <div style={{ marginBottom: '2rem' }}>
        <BackButton 
          from={location.state?.from || 'niches'}
          text={(() => {
            if (location.state?.from === 'weekly-plan') {
              return "← Back to Weekly Plan";
            } else if (location.state?.from === 'profile') {
              return "← Back to Profile";
            } else {
              return `← Back to ${decodedNiche.charAt(0).toUpperCase() + decodedNiche.slice(1)}`;
            }
          })()}
          variant="primary"
          size="medium"
        />
      </div>
      <HeroSection topicData={foundTopic} />
      <DetailBarSection topicData={foundTopic} />
      <ObjectiveSection topicData={foundTopic} />
      <ExplanationSection topicData={foundTopic} />
      <ActivitiesSection topicData={foundTopic} />
      <hr
        style={{
          height: '1px',
          backgroundColor: '#e5e7eb',
          margin: '2.5rem 0',
          border: 'none',
        }}
      />
    </div>
  );
};
export default DynamicTopicPage;
