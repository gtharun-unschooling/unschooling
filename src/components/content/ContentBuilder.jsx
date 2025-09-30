import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const ContentBuilder = () => {
  const [user] = useAuthState(auth);
  const [content, setContent] = useState({
    title: '',
    description: '',
    type: 'activity',
    difficulty: 'beginner',
    ageRange: '5-8',
    tags: [],
    mediaFiles: [],
    interactiveElements: [],
    estimatedDuration: 30
  });
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/content/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      } else {
        // Fallback to sample templates
        setTemplates(getSampleTemplates());
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates(getSampleTemplates());
    }
  };

  const getSampleTemplates = () => {
    return [
      {
        templateId: 'science_experiment',
        name: 'Science Experiment',
        category: 'Science',
        description: 'Template for hands-on science experiments',
        structure: {
          sections: ['Objective', 'Materials', 'Procedure', 'Observations', 'Conclusion'],
          interactiveElements: ['checklist', 'photo_upload', 'notes']
        }
      },
      {
        templateId: 'art_project',
        name: 'Art Project',
        category: 'Art',
        description: 'Template for creative art activities',
        structure: {
          sections: ['Inspiration', 'Materials', 'Steps', 'Gallery'],
          interactiveElements: ['image_gallery', 'video_upload', 'sharing']
        }
      },
      {
        templateId: 'reading_activity',
        name: 'Reading Activity',
        category: 'Language',
        description: 'Template for reading comprehension activities',
        structure: {
          sections: ['Reading Material', 'Questions', 'Discussion', 'Reflection'],
          interactiveElements: ['quiz', 'discussion_board', 'bookmark']
        }
      }
    ];
  };

  const handleInputChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagAdd = (tag) => {
    if (tag && !content.tags.includes(tag)) {
      setContent(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setContent(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTemplateSelect = (template) => {
    setContent(prev => ({
      ...prev,
      type: template.templateId.split('_')[0],
      interactiveElements: template.structure.interactiveElements
    }));
  };

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...content,
          generatedBy: user.uid
        })
      });

      if (response.ok) {
        const result = await response.json();
        setContent(prev => ({
          ...prev,
          ...result.generatedContent
        }));
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/content/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...content,
          createdBy: user.uid,
          createdAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert('Content saved successfully!');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  };

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '12px'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: 'white'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginRight: '10px'
  };

  const tagStyle = {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    borderRadius: '4px',
    fontSize: '12px',
    margin: '2px',
    cursor: 'pointer'
  };

  const templateCardStyle = {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '8px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0', color: '#1e293b' }}>
          🎨 Interactive Content Builder
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: previewMode ? '#6b7280' : '#10b981'
            }}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
          <button
            style={buttonStyle}
            onClick={saveContent}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </div>

      <div style={gridStyle}>
        {/* Content Creation Form */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>
            Content Details
          </h3>

          <input
            type="text"
            placeholder="Content Title"
            value={content.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Content Description"
            value={content.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <select
              value={content.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              style={selectStyle}
            >
              <option value="activity">Activity</option>
              <option value="lesson">Lesson</option>
              <option value="game">Game</option>
              <option value="experiment">Experiment</option>
              <option value="project">Project</option>
            </select>

            <select
              value={content.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
              style={selectStyle}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <select
              value={content.ageRange}
              onChange={(e) => handleInputChange('ageRange', e.target.value)}
              style={selectStyle}
            >
              <option value="3-5">Ages 3-5</option>
              <option value="5-8">Ages 5-8</option>
              <option value="8-12">Ages 8-12</option>
              <option value="12+">Ages 12+</option>
            </select>

            <input
              type="number"
              placeholder="Duration (minutes)"
              value={content.estimatedDuration}
              onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value))}
              style={inputStyle}
            />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Tags:
            </label>
            <div style={{ marginBottom: '8px' }}>
              {content.tags.map((tag, index) => (
                <span
                  key={index}
                  style={tagStyle}
                  onClick={() => handleTagRemove(tag)}
                >
                  {tag} ×
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTagAdd(e.target.value.trim());
                  e.target.value = '';
                }
              }}
              style={inputStyle}
            />
          </div>

          {/* AI Content Generation */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #0ea5e9',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>
              🤖 AI Content Generation
            </h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#0c4a6e' }}>
              Let AI help generate content based on your specifications
            </p>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: isGenerating ? '#9ca3af' : '#0ea5e9',
                cursor: isGenerating ? 'not-allowed' : 'pointer'
              }}
              onClick={generateContent}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
        </div>

        {/* Templates and Preview */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>
            Content Templates
          </h3>

          <div style={{ marginBottom: '20px' }}>
            {templates.map((template) => (
              <div
                key={template.templateId}
                style={templateCardStyle}
                onClick={() => handleTemplateSelect(template)}
              >
                <div style={{ fontWeight: '500', color: '#1e293b' }}>
                  {template.name}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {template.description}
                </div>
                <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '4px' }}>
                  Category: {template.category}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Elements */}
          <div>
            <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>
              Interactive Elements
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {content.interactiveElements.map((element, index) => (
                <span
                  key={index}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#f0fdf4',
                    color: '#059669',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  {element.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Mode */}
      {previewMode && (
        <div style={{ ...cardStyle, marginTop: '20px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>
            Content Preview
          </h3>
          <div style={{
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>
              {content.title || 'Untitled Content'}
            </h2>
            <p style={{ margin: '0 0 16px 0', color: '#64748b' }}>
              {content.description || 'No description provided'}
            </p>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                Type: {content.type}
              </span>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                Difficulty: {content.difficulty}
              </span>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                Age: {content.ageRange}
              </span>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                Duration: {content.estimatedDuration} min
              </span>
            </div>
            {content.tags.length > 0 && (
              <div>
                <strong style={{ color: '#1e293b' }}>Tags: </strong>
                {content.tags.map((tag, index) => (
                  <span key={index} style={tagStyle}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentBuilder;
