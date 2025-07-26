import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// import topicData from '../../data/topicsdata.json';

const DynamicTopicPage = () => {
  const { nicheName, topicSlug } = useParams();
  const [topicData, setTopicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/topics')
      .then(res => res.json())
      .then(data => {
        setTopicData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load topics data.');
        setLoading(false);
      });
  }, []);

  // ✅ Safety checks on route params
  const decodedNiche = (nicheName || '').replace(/-/g, ' ').toLowerCase();
  const decodedTopic = (topicSlug || '').replace(/-/g, ' ').toLowerCase();

  // ✅ Preprocess dataset once
  const cleanData = Array.isArray(topicData)
    ? topicData.filter(item => item.Niche && item.Topic)
    : [];

  // ✅ Try finding a match
  const foundTopic = cleanData.find(
    (item) =>
      item.Niche.toLowerCase() === decodedNiche &&
      item.Topic.toLowerCase() === decodedTopic
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!foundTopic) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'red' }}>
          Topic not found. Check if data matches route params.
        </h2>
        <pre>{JSON.stringify({ decodedNiche, decodedTopic }, null, 2)}</pre>
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
  
      const lines = activityString.split('\n').map(line => line.trim());
  
      const title = lines[0] || 'Activity';
  
      const materialsLine = lines.find(line => line.startsWith('Materials Needed:'));
      let materials = '';
      if (materialsLine) {
        const colonIndex = materialsLine.indexOf(':');
        materials = materialsLine.slice(colonIndex + 1).trim();
      }
  
      const headings = [
        'Steps to Follow:',
        'What Should Be Achieved:',
        'What is Gained:',
      ];
  
      const sections = {};
      headings.forEach((heading, i) => {
        const startIndex = lines.findIndex(line => line === heading);
        if (startIndex === -1) {
          sections[heading] = '';
          return;
        }
        let endIndex = lines.length;
        for (let j = i + 1; j < headings.length; j++) {
          const nextHeadingIndex = lines.findIndex(line => line === headings[j]);
          if (nextHeadingIndex !== -1 && nextHeadingIndex > startIndex) {
            endIndex = nextHeadingIndex;
            break;
          }
        }
        const contentLines = lines.slice(startIndex + 1, endIndex);
        sections[heading] = contentLines.join('\n').trim();
      });
  
      return {
        title,
        materials,
        steps: sections['Steps to Follow:'],
        achieved: sections['What Should Be Achieved:'],
        gained: sections['What is Gained:'],
      };
    };
  
    const activity1 = parseActivity(topicData['Activity 1']);
    const activity2 = parseActivity(topicData['Activity 2']);

    console.log("Parsed Activity 1:", activity1);
    console.log("Parsed Activity 2:", activity2);
  
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
                <p style={paragraphStyle}>{activity1.achieved}</p>
  
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
                <p style={paragraphStyle}>{activity2.achieved}</p>
  
                <h4 style={sectionTitle}>What is Gained</h4>
                <p style={paragraphStyle}>{activity2.gained}</p>
              </div>
            )}
          </div>
        </div>

            {/* Debug JSON output */}
    <pre style={{ whiteSpace: 'pre-wrap', background: '#f9fafb', padding: '1rem', marginTop: '2rem', borderRadius: '8px', fontSize: '0.85rem' }}>
      {JSON.stringify({ activity1, activity2 }, null, 2)}
    </pre>
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
