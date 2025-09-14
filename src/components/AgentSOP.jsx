/**
 * Clean Agent SOP Component
 * Shows only: LLM Input/Output + Agent Input/Output
 * No generic information, only child-specific data
 */

import React from 'react';

const AgentSOP = ({ agentName, outputData, inputData }) => {
  if (!outputData) {
    return (
      <div style={{
        padding: '16px',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        No data available for {agentName}
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: '#ffffff'
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#374151',
        textTransform: 'capitalize'
      }}>
        {agentName.replace('Agent', ' Agent')}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* LLM Input/Output */}
        <div>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#dc2626',
            borderBottom: '1px solid #fecaca',
            paddingBottom: '4px'
          }}>
            🤖 LLM Input/Output
          </h4>
          
          {/* LLM Input */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Input:</div>
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              padding: '8px',
              fontSize: '0.8rem',
              color: '#991b1b',
              fontFamily: 'monospace'
            }}>
              {inputData ? JSON.stringify(inputData, null, 2) : 'No input data available'}
            </div>
          </div>

          {/* LLM Output */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Output:</div>
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              padding: '8px',
              fontSize: '0.8rem',
              color: '#991b1b',
              fontFamily: 'monospace',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(outputData, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Agent Input/Output */}
        <div>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#059669',
            borderBottom: '1px solid #bbf7d0',
            paddingBottom: '4px'
          }}>
            🎯 Agent Input/Output
          </h4>
          
          {/* Agent Input */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Input:</div>
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '4px',
              padding: '8px',
              fontSize: '0.8rem',
              color: '#166534',
              fontFamily: 'monospace',
              maxHeight: '100px',
              overflowY: 'auto'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {inputData ? JSON.stringify(inputData, null, 2) : 'No input data available'}
              </pre>
            </div>
          </div>

          {/* Agent Output */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Output:</div>
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '4px',
              padding: '8px',
              fontSize: '0.8rem',
              color: '#166534',
              fontFamily: 'monospace',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(outputData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSOP;