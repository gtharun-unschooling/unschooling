import React from 'react';
import UniversalBackButton from '../components/ui/UniversalBackButton';
import BackButtonDemo from '../components/ui/BackButtonDemo';

const BackButtonTestPage = () => {
  return (
    <div style={{ 
      padding: '2rem 5vw', 
      backgroundColor: '#fafbfc',
      minHeight: '100vh'
    }}>
      <UniversalBackButton text="← Back to Home" variant="luxury" />
      <BackButtonDemo />
    </div>
  );
};

export default BackButtonTestPage;
