import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const PersonalizationEngine = () => {
  const [user] = useAuthState(auth);
  const [personalizationData, setPersonalizationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (user) {
      loadPersonalizationData();
    }
  }, [user, selectedChild, selectedCategory]);

  const loadPersonalizationData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/personalization/engine?user_id=${user.uid}&child_id=${selectedChild}&category=${selectedCategory}`);
      
      if (!response.ok) {
        throw new Error('Failed to load personalization data');
      }

      const data = await response.json();
      setPersonalizationData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setPersonalizationData(getSamplePersonalizationData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSamplePersonalizationData = () => {
    return {
      childProfiles: [
        {
          childId: "child1",
          name: "Emma",
          age: 8,
          learningStyle: "visual",
          interests: ["science", "art", "reading"],
          strengths: ["problem-solving", "creativity", "attention-to-detail"],
          challenges: ["math", "focus"],
          currentLevel: "intermediate",
          preferredTime: "morning",
          attentionSpan: "medium",
          motivationFactors: ["achievements", "recognition", "fun"],
          personality: "curious",
          goals: ["improve math skills", "explore more science experiments"]
        },
        {
          childId: "child2",
          name: "Alex",
          age: 10,
          learningStyle: "kinesthetic",
          interests: ["math", "sports", "building"],
          strengths: ["logical-thinking", "physical-activity", "teamwork"],
          challenges: ["reading", "patience"],
          currentLevel: "advanced",
          preferredTime: "afternoon",
          attentionSpan: "short",
          motivationFactors: ["competition", "rewards", "challenges"],
          personality: "active",
          goals: ["master multiplication", "build more projects"]
        }
      ],
      adaptivePaths: [
        {
          pathId: "science_visual",
          title: "Visual Science Explorer",
          description: "Science activities designed for visual learners",
          category: "science",
          difficulty: "intermediate",
          estimatedDuration: "4 weeks",
          activities: [
            {
              activityId: "rainbow_milk",
              title: "Rainbow Milk Experiment",
              type: "experiment",
              difficulty: "beginner",
              duration: 20,
              visualElements: ["colorful", "step-by-step", "diagrams"],
              learningOutcomes: ["color-mixing", "surface-tension", "observation"]
            },
            {
              activityId: "solar_system_model",
              title: "Solar System Model",
              type: "project",
              difficulty: "intermediate",
              duration: 45,
              visualElements: ["3d-model", "charts", "illustrations"],
              learningOutcomes: ["planets", "scale", "space"]
            }
          ],
          progress: 65,
          completionRate: 85
        },
        {
          pathId: "math_kinesthetic",
          title: "Hands-On Math Master",
          description: "Math activities for kinesthetic learners",
          category: "math",
          difficulty: "advanced",
          estimatedDuration: "6 weeks",
          activities: [
            {
              activityId: "fraction_pizza",
              title: "Fraction Pizza Game",
              type: "game",
              difficulty: "intermediate",
              duration: 30,
              kinestheticElements: ["cutting", "moving", "building"],
              learningOutcomes: ["fractions", "division", "sharing"]
            },
            {
              activityId: "measurement_race",
              title: "Measurement Race",
              type: "activity",
              difficulty: "advanced",
              duration: 25,
              kinestheticElements: ["running", "measuring", "comparing"],
              learningOutcomes: ["measurement", "comparison", "estimation"]
            }
          ],
          progress: 40,
          completionRate: 78
        }
      ],
      recommendations: [
        {
          type: "activity",
          title: "Watercolor Galaxy",
          reason: "Matches your interest in art and visual learning style",
          confidence: 0.92,
          category: "art",
          estimatedEngagement: "high"
        },
        {
          type: "path",
          title: "Science Explorer Path",
          reason: "Based on your strong performance in science activities",
          confidence: 0.88,
          category: "science",
          estimatedEngagement: "high"
        },
        {
          type: "challenge",
          title: "Math Puzzle Challenge",
          reason: "Helps improve your math skills while keeping it fun",
          confidence: 0.75,
          category: "math",
          estimatedEngagement: "medium"
        }
      ],
      learningAnalytics: {
        engagementPatterns: {
          peakHours: ["9:00 AM", "2:00 PM", "4:00 PM"],
          preferredDuration: "25 minutes",
          breakFrequency: "every 30 minutes",
          difficultyPreference: "medium-to-hard"
        },
        performanceMetrics: {
          averageCompletionRate: 78.5,
          averageAccuracy: 82.3,
          improvementRate: 15.2,
          retentionRate: 85.7
        },
        behavioralInsights: {
          learningStyle: "visual-kinesthetic",
          motivationTriggers: ["achievements", "recognition", "fun"],
          frustrationPoints: ["repetitive tasks", "long instructions"],
          successFactors: ["immediate feedback", "visual aids", "hands-on activities"]
        }
      },
      adaptiveContent: {
        difficultyAdjustment: {
          currentLevel: "intermediate",
          adjustmentFactor: 1.2,
          nextLevelThreshold: 85,
          currentProgress: 72
        },
        contentPersonalization: {
          preferredFormat: "interactive",
          visualStyle: "colorful",
          instructionLength: "concise",
          feedbackType: "immediate"
        },
        pacingControl: {
          currentPace: "moderate",
          autoPause: true,
          breakReminders: true,
          sessionLength: 25
        }
      }
    };
  };

  const getLearningStyleColor = (style) => {
    switch (style) {
      case 'visual': return '#3b82f6';
      case 'auditory': return '#10b981';
      case 'kinesthetic': return '#f59e0b';
      case 'reading': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#10b981';
    if (confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
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

  const filterStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '14px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const progressBarStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  };

  const progressFillStyle = (percentage) => ({
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: '#10b981',
    transition: 'width 0.3s ease'
  });

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }}></div>
          Loading personalization data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{
          padding: '16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626'
        }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0', color: '#1e293b' }}>
          🎯 Personalization Engine
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          AI-powered adaptive learning paths tailored to each child
        </div>
      </div>

      {/* Filters */}
      <div style={filterStyle}>
        <select
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Children</option>
          {personalizationData?.childProfiles?.map(child => (
            <option key={child.childId} value={child.childId}>
              {child.name} (Age {child.age})
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Categories</option>
          <option value="science">Science</option>
          <option value="math">Math</option>
          <option value="art">Art</option>
          <option value="reading">Reading</option>
        </select>
      </div>

      {/* Child Profiles */}
      <div style={gridStyle}>
        {personalizationData?.childProfiles?.map((child, index) => (
          <div key={index} style={cardStyle}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
              👤 {child.name} (Age {child.age})
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Learning Style:</span>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: getLearningStyleColor(child.learningStyle),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {child.learningStyle}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                <strong>Interests:</strong> {child.interests.join(', ')}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                <strong>Strengths:</strong> {child.strengths.join(', ')}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                <strong>Challenges:</strong> {child.challenges.join(', ')}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <strong>Goals:</strong> {child.goals.join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adaptive Learning Paths */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          🛤️ Adaptive Learning Paths
        </h3>
        <div style={gridStyle}>
          {personalizationData?.adaptivePaths?.map((path, index) => (
            <div key={index} style={{
              padding: '16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                    {path.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    {path.description}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span style={{
                      padding: '2px 6px',
                      backgroundColor: getDifficultyColor(path.difficulty),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {path.difficulty}
                    </span>
                    <span style={{
                      padding: '2px 6px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {path.category}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {path.estimatedDuration}
                  </div>
                  <div style={{ fontSize: '12px', color: '#10b981' }}>
                    {path.completionRate}% completion
                  </div>
                </div>
              </div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(path.progress)}></div>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {path.progress}% complete
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          🤖 AI Recommendations
        </h3>
        {personalizationData?.recommendations?.map((rec, index) => (
          <div key={index} style={{
            padding: '16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                {rec.title}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                {rec.reason}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {rec.category}
                </span>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: rec.estimatedEngagement === 'high' ? '#10b981' : rec.estimatedEngagement === 'medium' ? '#f59e0b' : '#ef4444',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {rec.estimatedEngagement} engagement
                </span>
              </div>
            </div>
            <div style={{
              padding: '4px 8px',
              backgroundColor: getConfidenceColor(rec.confidence),
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {Math.round(rec.confidence * 100)}% confidence
            </div>
          </div>
        ))}
      </div>

      {/* Learning Analytics */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📊 Learning Analytics
          </h3>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
              Performance Metrics
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                  {personalizationData?.learningAnalytics?.performanceMetrics?.averageCompletionRate || 0}%
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Completion Rate</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {personalizationData?.learningAnalytics?.performanceMetrics?.averageAccuracy || 0}%
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Accuracy</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                  {personalizationData?.learningAnalytics?.performanceMetrics?.improvementRate || 0}%
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Improvement</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {personalizationData?.learningAnalytics?.performanceMetrics?.retentionRate || 0}%
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Retention</div>
              </div>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🎯 Adaptive Content
          </h3>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
              Difficulty Adjustment
            </div>
            <div style={progressBarStyle}>
              <div style={progressFillStyle(
                personalizationData?.adaptiveContent?.difficultyAdjustment?.currentProgress || 0
              )}></div>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Current: {personalizationData?.adaptiveContent?.difficultyAdjustment?.currentLevel || 'beginner'} 
              ({personalizationData?.adaptiveContent?.difficultyAdjustment?.currentProgress || 0}%)
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
              Content Personalization
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              <div>Format: {personalizationData?.adaptiveContent?.contentPersonalization?.preferredFormat || 'interactive'}</div>
              <div>Style: {personalizationData?.adaptiveContent?.contentPersonalization?.visualStyle || 'colorful'}</div>
              <div>Instructions: {personalizationData?.adaptiveContent?.contentPersonalization?.instructionLength || 'concise'}</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PersonalizationEngine;
