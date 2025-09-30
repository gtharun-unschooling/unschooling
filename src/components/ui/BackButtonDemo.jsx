import React from 'react';
import UniversalBackButton from './UniversalBackButton';
import { colorSystem } from '../../styles/colors';

const BackButtonDemo = () => {
  const containerStyle = {
    padding: '2rem',
    backgroundColor: colorSystem.background.secondary,
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const sectionStyle = {
    marginBottom: '3rem',
    padding: '2rem',
    backgroundColor: colorSystem.background.primary,
    borderRadius: '1rem',
    boxShadow: `0 4px 12px ${colorSystem.shadow.light}`,
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: colorSystem.text.primary,
    marginBottom: '1rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  };

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <h1 style={titleStyle}>Universal Back Button Demo</h1>
        <p style={{ color: colorSystem.text.secondary, marginBottom: '2rem' }}>
          Various styles and sizes of the universal back button component
        </p>

        <div style={gridStyle}>
          <div>
            <h3 style={{ ...titleStyle, fontSize: '1.2rem' }}>Primary Variant</h3>
            <UniversalBackButton variant="primary" />
          </div>

          <div>
            <h3 style={{ ...titleStyle, fontSize: '1.2rem' }}>Secondary Variant</h3>
            <UniversalBackButton variant="secondary" />
          </div>

          <div>
            <h3 style={{ ...titleStyle, fontSize: '1.2rem' }}>Ghost Variant</h3>
            <UniversalBackButton variant="ghost" />
          </div>

          <div>
            <h3 style={{ ...titleStyle, fontSize: '1.2rem' }}>Luxury Variant</h3>
            <UniversalBackButton variant="luxury" />
          </div>

          <div>
            <h3 style={{ ...titleStyle, fontSize: '1.2rem' }}>Custom Text</h3>
            <UniversalBackButton text="← Go Back" variant="primary" />
          </div>

          <div>
            <h3 style={{ ...titleStyle, fontSize: '1.2rem' }}>No Icon</h3>
            <UniversalBackButton showIcon={false} variant="secondary" />
          </div>

          <div>
            <h3 style={{ ...titleStyle, fontSize: '1.2rem' }}>Small Size</h3>
            <UniversalBackButton size="small" variant="primary" />
          </div>

          <div>
            <h3 style={{ ...titleStyle, fontSize: '1.2rem' }}>Large Size</h3>
            <UniversalBackButton size="large" variant="luxury" />
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={titleStyle}>Usage Examples</h2>
        <div style={{ color: colorSystem.text.secondary }}>
          <p><strong>Basic Usage:</strong></p>
          <code style={{ 
            backgroundColor: colorSystem.neutral[100], 
            padding: '0.5rem', 
            borderRadius: '4px',
            display: 'block',
            marginBottom: '1rem'
          }}>
            {`<UniversalBackButton />`}
          </code>

          <p><strong>With Custom Text:</strong></p>
          <code style={{ 
            backgroundColor: colorSystem.neutral[100], 
            padding: '0.5rem', 
            borderRadius: '4px',
            display: 'block',
            marginBottom: '1rem'
          }}>
            {`<UniversalBackButton text="← Previous Page" variant="luxury" />`}
          </code>

          <p><strong>Custom Click Handler:</strong></p>
          <code style={{ 
            backgroundColor: colorSystem.neutral[100], 
            padding: '0.5rem', 
            borderRadius: '4px',
            display: 'block',
            marginBottom: '1rem'
          }}>
            {`<UniversalBackButton customOnClick={() => window.history.back()} />`}
          </code>
        </div>
      </div>
    </div>
  );
};

export default BackButtonDemo;
