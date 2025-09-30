import React from 'react';

const FinalCTASection = () => {
  const ctaStyles = {
    container: {
      backgroundColor: '#fdf6ec',
      textAlign: 'center',
      padding: '6vh 4vw',
      borderTop: '2px solid #ddd',
    },
    heading: {
      fontSize: '2.8rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '1.5rem',
    },
    subtext: {
      fontSize: '1.25rem',
      color: '#555',
      maxWidth: '600px',
      margin: '0 auto 2.5rem',
    },
    button: {
      backgroundColor: '#FF6347',
      color: '#fff',
      border: 'none',
      padding: '1rem 2.5rem',
      fontSize: '1.1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
  };
  
  return (
    <section style={ctaStyles.container}>
      <h2 style={ctaStyles.heading}>Let's Rethink Learning Together</h2>
      <p style={ctaStyles.subtext}>
        Unschooling is the future. Your child leads. We guide.
      </p>
      <button style={ctaStyles.button}>Join the Movement</button>
    </section>
  );
};

export default FinalCTASection; 