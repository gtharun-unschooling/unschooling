import React from 'react';
import MinimalBackButton from '../components/ui/UniversalBackButton';
import BackButtonDemo from '../components/ui/BackButtonDemo';

const BackButtonTestPage = () => {
  return (
    <div style={{ 
      padding: '2rem 5vw', 
      backgroundColor: '#fafbfc',
      minHeight: '100vh'
    }}>
      <MinimalBackButton text="← Back to Home"  />
      <BackButtonDemo />
    </div>
  );
};

export default BackButtonTestPage;
