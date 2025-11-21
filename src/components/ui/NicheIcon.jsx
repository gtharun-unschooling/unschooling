import React from 'react';

/**
 * NicheIcon Component - Displays 3D-style icons for different niches
 * 
 * Usage:
 * <NicheIcon niche="Artificial Intelligence" size="large" />
 * <NicheIcon niche="Creative Writing" size="small" />
 */

const NicheIcon = ({ niche, size = 'medium', className = '', style = {} }) => {
  // Map niche names to their corresponding emojis (all 63 niches from startup)
  const getNicheEmoji = (nicheName) => {
    const emojiMap = {
      // Core Business & Finance
      'Finance': '💰',
      'Communication': '💬',
      'AI': '🤖',
      'Entrepreneurship': '💼',
      'Trading & Investments': '📈',
      'Cryptocurrency & Blockchain': '₿',
      
      // Creative Arts & Expression
      'Dance': '💃',
      'Music': '🎵',
      'Fashion & Styling': '👗',
      'Arts & Crafts': '🎨',
      'Photography & Videography': '📸',
      'Filmmaking': '🎬',
      'Content Creation': '📝',
      'Media Production & Broadcasting': '📺',
      
      // Science & Technology
      'Nature Exploration': '🌿',
      'Coding & Programming': '💻',
      'Electronics': '⚡',
      'Electrical Engineering Basics': '🔌',
      'Robotics': '🤖',
      'Internet of Things (IoT)': '🌐',
      'Cybersecurity': '🔒',
      'Space Exploration': '🚀',
      'Renewable Energy': '⚡',
      'Marine Biology': '🐠',
      'Architecture & Design': '🏗️',
      'Aerospace & Flight Sciences': '✈️',
      'Applied Chemistry & Materials': '🧪',
      'Fundamental Physics & Forces': '⚛️',
      
      // Social Sciences & Humanities
      'Civics & Government': '🏛️',
      'History': '📜',
      'Law & Legal Education': '⚖️',
      'Psychology': '🧠',
      'Behavioral Science': '🔍',
      'Emotional Intelligence': '❤️',
      'Culture & Heritage': '🏺',
      'Spirituality & Devotion': '🕉️',
      
      // Health & Wellness
      'Food & Nutrition': '🍎',
      'Health & Hygiene': '🧼',
      'Human Biology': '🧬',
      'Physical Fitness': '💪',
      'Ayurveda & Natural Healing': '🌿',
      
      // Education & Skills
      'Mathematics': '📊',
      'Creative & Academic Writing': '✍️',
      'Social Media Literacy': '📱',
      'Educational Apps': '📚',
      'Teaching & Pedagogy': '👩‍🏫',
      'Children\'s Books': '📖',
      'Public Speaking & Debate': '🎤',
      
      // Physical Activities & Sports
      'Sports': '⚽',
      'Games & Recreational Skills': '🎮',
      'Leadership & Team Building': '👥',
      'Emergency Response & Safety Skills': '🚨',
      
      // Applied Sciences
      'General Science': '🔬',
      'Design Thinking & Creativity': '💡',
      'Product Design & User Experience (UX)': '🎯',
      'Construction & Structural Engineering': '🏗️',
      'Tools & Machines Literacy': '🔧',
      'Supply Chain & Logistics': '📦',
      'Smart Urban Living': '🏙️',
      
      // Specialized Fields
      'Travel': '✈️',
      'Automobiles & Engineering': '🚗',
      'Sustainability & Environment': '🌍',
      'Agriculture & Soil Science': '🌾',
    };
    return emojiMap[nicheName] || '📚';
  };

  // Map niche names to their corresponding icon files
  const getIconPath = (nicheName) => {
    const iconMap = {
      'Artificial Intelligence': '/media/niches/ai-icon.svg',
      'Creative Writing': '/media/niches/writing-icon.svg',
      'Environmental Science': '/media/niches/nature-icon.svg',
      'Mathematics': '/media/niches/math-icon.svg',
      'Music & Arts': '/media/niches/arts-icon.svg',
      'Physical Education': '/media/niches/sports-icon.svg',
      // Add more mappings as we create more icons
    };

    return iconMap[nicheName] || '/media/niches/default-icon.svg';
  };

  // Size configurations
  const sizeConfig = {
    small: { width: 48, height: 48 },
    medium: { width: 64, height: 64 },
    large: { width: 96, height: 96 },
    xlarge: { width: 120, height: 120 },
    huge: { width: 180, height: 180 },
    massive: { width: 300, height: 300 }
  };

  const iconSize = sizeConfig[size] || sizeConfig.medium;

  return (
    <div 
      className={`niche-icon ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${iconSize.width}px`,
        width: `${iconSize.width}px`,
        height: `${iconSize.height}px`,
        minWidth: `${iconSize.width}px`,
        minHeight: `${iconSize.height}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        lineHeight: '1',
        ...style
      }}
    >
      <span
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          transition: 'transform 0.3s ease',
          display: 'inline-block',
          fontSize: `${iconSize.width}px`,
          lineHeight: '1',
          width: `${iconSize.width}px`,
          height: `${iconSize.height}px`,
          maxWidth: 'none',
          maxHeight: 'none',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {getNicheEmoji(niche)}
      </span>
    </div>
  );
};

export default NicheIcon;
