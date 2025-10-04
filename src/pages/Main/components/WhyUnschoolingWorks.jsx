import React from 'react';
import { applyTextStyle } from '../../../styles/typography';
import { colorSystem } from '../../../styles/colors';

const icons = [
  '🎯', // Personalized Learning
  '🛠️', // Real-Life Skills
  '👨‍👩‍👧‍👦', // Family Bonding
  '🔍', // Curiosity-Driven
  '🎨', // Creativity
  '⏳', // Self-Paced
  '��', // Flexible
];

// Professional background colors using the color system
const cardBackgrounds = [
  colorSystem.background.accent,      // Very light blue
  colorSystem.semantic.success[50],   // Very light green
  colorSystem.semantic.warning[50],   // Very light yellow
  colorSystem.primary[50],            // Very light blue
  colorSystem.secondary[50],          // Very light yellow
  colorSystem.semantic.success[50],   // Very light green
  colorSystem.background.secondary,   // Very light gray
];

const WhyUnschoolingWorks = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sectionStyle = {
    background: '#fafbfc',
    position: 'relative',
    padding: '3rem 0',
    minHeight: 'auto',
    overflow: 'hidden',
  };

  const headingStyle = {
    ...applyTextStyle('h2', isMobile),
    textAlign: 'center',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    animation: 'fadeInDown 1s',
  };

  const gridStyle = {
    display: 'flex',
    gap: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    animation: 'fadeInUp 1.2s',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    scrollbarWidth: 'thin',
    scrollbarColor: '#cbd5e1 transparent',
  };

  // Define unique premium background colors for each tile
  const getTileBackgroundColor = (idx) => {
    const colors = [
      colorSystem.luxury.emerald[50],   // Very light emerald
      colorSystem.luxury.purple[50],    // Very light purple
      colorSystem.luxury.sapphire[50],  // Very light sapphire
      colorSystem.luxury.rose[50],      // Very light rose
      colorSystem.luxury.amber[50],     // Very light amber
      colorSystem.luxury.teal[50],      // Very light teal
      colorSystem.luxury.indigo[50],    // Very light indigo
    ];
    return colors[idx % colors.length];
  };

  const cardStyle = idx => ({
    position: 'relative',
    borderRadius: '1rem',
    background: getTileBackgroundColor(idx),
    boxShadow: `0 4px 12px 0 rgba(0, 0, 0, 0.08)`,
    border: `1px solid ${colorSystem.border.light}`,
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '280px',
    width: '280px',
    flex: '0 0 auto',
    overflow: 'hidden',
    color: colorSystem.text.secondary,
  });

  const cardHoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 20px 0 rgba(0, 0, 0, 0.12)`,
    border: `1px solid ${colorSystem.border.medium}`,
  };

  const iconStyle = {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    filter: 'none',
    animation: 'popIn 0.7s',
  };

  const tileTitle = {
    ...applyTextStyle('h5', isMobile),
    marginBottom: '1rem',
    textAlign: 'center',
    fontWeight: 600,
    lineHeight: 1.3,
    color: colorSystem.text.primary,
    fontSize: '1.1rem',
  };

  const tileDescription = {
    ...applyTextStyle('body', isMobile),
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.6,
    opacity: 0.85,
    color: colorSystem.text.tertiary,
    fontSize: isMobile ? '0.9rem' : '1rem',
  };

  const tiles = [
    {
      title: 'Personalized Learning',
      description: 'Tailored education paths that adapt to each learner\'s strengths and interests.',
    },
    {
      title: 'Real-Life Skills',
      description: 'Focus on practical abilities that prepare learners for everyday challenges.',
    },
    {
      title: 'Family Bonding',
      description: 'Strengthening relationships through shared learning experiences.',
    },
    {
      title: 'Curiosity-Driven Activities',
      description: 'Encouraging exploration and discovery based on individual interests.',
    },
    {
      title: 'Creativity Over Curriculum',
      description: 'Prioritizing creative expression over rigid academic structures.',
    },
    {
      title: 'Self-Paced Learning',
      description: 'Allowing learners to progress at their own comfortable speed.',
    },
    {
      title: 'Flexible Learning Environment',
      description: 'Adapting the learning space to fit diverse needs and preferences.',
    },
  ];

  // Animations
  const styleSheet = `
    @keyframes fadeInDown {
      0% { opacity: 0; transform: translateY(-30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.7); }
      100% { opacity: 1; transform: scale(1); }
    }
  `;

  // Responsive: horizontal scroll layout
  const responsiveStyle = `
    .why-unschooling-grid::-webkit-scrollbar {
      height: 6px;
    }
    .why-unschooling-grid::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    .why-unschooling-grid::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    .why-unschooling-grid::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    
    @media (max-width: 768px) {
      .why-unschooling-grid { 
        gap: 1rem !important;
        padding: 0 1rem !important;
      }
      .why-unschooling-card { 
        height: 240px !important; 
        width: 240px !important;
        padding: 1.5rem 1rem !important;
      }
      .why-unschooling-heading { font-size: 1.4rem !important; }
    }
    @media (max-width: 480px) {
      .why-unschooling-grid { 
        gap: 0.75rem !important;
        padding: 0 0.5rem !important;
      }
      .why-unschooling-card { 
        height: 200px !important; 
        width: 200px !important;
        padding: 1.25rem 0.75rem !important;
      }
    }
  `;

  React.useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styleSheet + responsiveStyle;
    document.head.appendChild(styleTag);
    return () => { document.head.removeChild(styleTag); };
  }, []);

  return (
    <section className="why-unschooling-section" style={sectionStyle}>
      <h2 style={headingStyle} className="why-unschooling-heading">
        <span role="img" aria-label="spark">✨</span> Why Unschooling Works <span role="img" aria-label="spark">✨</span>
      </h2>
      <div style={gridStyle} className="why-unschooling-grid">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className="why-unschooling-card"
            style={cardStyle(index)}
            onMouseEnter={e => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle(index))}
          >
            <h3 style={{
              ...tileTitle,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{icons[index]}</span>
              {tile.title}
            </h3>
            <p style={tileDescription}>{tile.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyUnschoolingWorks; 