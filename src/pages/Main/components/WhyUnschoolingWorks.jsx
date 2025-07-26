import React from 'react';

const icons = [
  '🎯', // Personalized Learning
  '🛠️', // Real-Life Skills
  '👨‍👩‍👧‍👦', // Family Bonding
  '🔍', // Curiosity-Driven
  '🎨', // Creativity
  '⏳', // Self-Paced
  '��', // Flexible
];

// Add a unique gradient or color for each card
const cardGradients = [
  'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', // orange-yellow
  'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)', // green-blue
  'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)', // orange-pink
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', // teal-purple
  'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)', // pink-purple
  'linear-gradient(135deg, #00c3ff 0%, #ffff1c 100%)', // blue-yellow
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // green-cyan
];

const WhyUnschoolingWorks = () => {
  const sectionStyle = {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0c3fc 100%)',
    position: 'relative',
    padding: '5vh 0',
    minHeight: '50vh',
    overflow: 'hidden',
  };

  const headingStyle = {
    fontSize: '2.2rem',
    fontWeight: 900,
    textAlign: 'center',
    marginBottom: '2.2rem',
    background: 'linear-gradient(90deg, #6a4c93 0%, #00b4d8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '0.02em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    animation: 'fadeInDown 1s',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.2rem',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 2vw',
    animation: 'fadeInUp 1.2s',
  };

  const cardStyle = idx => ({
    position: 'relative',
    borderRadius: '1rem',
    background: cardGradients[idx],
    boxShadow: '0 4px 16px 0 rgba(106,76,147,0.10)',
    border: '1.5px solid rgba(106,76,147,0.10)',
    backdropFilter: 'blur(8px)',
    padding: '1.2rem 1rem 1rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s',
    cursor: 'pointer',
    minHeight: '140px',
    maxWidth: '210px',
    margin: '0 auto',
    overflow: 'hidden',
    color: '#fff',
  });

  const cardHoverStyle = {
    transform: 'translateY(-5px) scale(1.045)',
    boxShadow: '0 8px 32px 0 rgba(0,180,216,0.18)',
    border: '2px solid #fff',
  };

  const iconStyle = {
    fontSize: '1.7rem',
    marginBottom: '0.5rem',
    filter: 'drop-shadow(0 1px 4px #e0c3fc)',
    animation: 'popIn 0.7s',
  };

  const tileTitle = {
    fontSize: '1.05rem',
    fontWeight: 700,
    marginBottom: '0.2rem',
    textAlign: 'center',
    letterSpacing: '0.01em',
    color: '#fff',
    textShadow: '0 1px 4px rgba(0,0,0,0.08)',
  };

  const tileDescription = {
    fontSize: '0.92rem',
    lineHeight: '1.45',
    color: '#f8fafc',
    textAlign: 'center',
    fontWeight: 500,
    textShadow: '0 1px 4px rgba(0,0,0,0.08)',
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

  // Responsive: stack cards on mobile
  const responsiveStyle = `
    @media (max-width: 700px) {
      .why-unschooling-grid { grid-template-columns: 1fr 1fr !important; }
      .why-unschooling-card { min-height: 110px !important; max-width: 95vw !important; }
      .why-unschooling-heading { font-size: 1.2rem !important; }
    }
    @media (max-width: 480px) {
      .why-unschooling-grid { grid-template-columns: 1fr !important; }
      .why-unschooling-card { min-height: 100px !important; }
    }
  `;

  React.useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styleSheet + responsiveStyle;
    document.head.appendChild(styleTag);
    return () => { document.head.removeChild(styleTag); };
  }, []);

  return (
    <section style={sectionStyle}>
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
            <div style={iconStyle}>{icons[index]}</div>
            <h3 style={tileTitle}>{tile.title}</h3>
            <p style={tileDescription}>{tile.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyUnschoolingWorks; 