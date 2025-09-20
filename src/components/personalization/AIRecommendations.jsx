import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const AIRecommendations = () => {
  const [user] = useAuthState(auth);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user, selectedChild, selectedType, selectedCategory]);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/personalization/ai-recommendations?user_id=${user.uid}&child_id=${selectedChild}&type=${selectedType}&category=${selectedCategory}`);
      
      if (!response.ok) {
        throw new Error('Failed to load AI recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setRecommendations(getSampleRecommendations());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleRecommendations = () => {
    return [
      {
        recommendationId: "rec_001",
        type: "activity",
        title: "Watercolor Galaxy",
        description: "Create a beautiful galaxy painting using watercolors and salt",
        category: "art",
        difficulty: "beginner",
        estimatedDuration: 45,
        confidence: 0.92,
        reason: "Matches your interest in art and visual learning style",
        estimatedEngagement: "high",
        childId: "child1",
        childName: "Emma",
        learningStyle: "visual",
        interests: ["art", "science"],
        strengths: ["creativity", "attention-to-detail"],
        challenges: ["focus"],
        prerequisites: [],
        learningOutcomes: ["watercolor-techniques", "color-blending", "creativity"],
        materials: ["watercolors", "salt", "paper", "brushes"],
        tags: ["art", "painting", "space", "watercolor"],
        createdAt: "2024-01-22T10:30:00Z",
        expiresAt: "2024-01-29T10:30:00Z"
      },
      {
        recommendationId: "rec_002",
        type: "path",
        title: "Science Explorer Path",
        description: "A comprehensive science learning path designed for visual learners",
        category: "science",
        difficulty: "intermediate",
        estimatedDuration: 120,
        confidence: 0.88,
        reason: "Based on your strong performance in science activities and visual learning preference",
        estimatedEngagement: "high",
        childId: "child1",
        childName: "Emma",
        learningStyle: "visual",
        interests: ["science", "experiments"],
        strengths: ["problem-solving", "observation"],
        challenges: ["math"],
        prerequisites: ["basic-science-knowledge"],
        learningOutcomes: ["scientific-method", "experimentation", "observation-skills"],
        activities: [
          "Rainbow Milk Experiment",
          "Solar System Model",
          "Plant Growth Tracking"
        ],
        tags: ["science", "experiments", "visual", "intermediate"],
        createdAt: "2024-01-22T09:15:00Z",
        expiresAt: "2024-01-29T09:15:00Z"
      },
      {
        recommendationId: "rec_003",
        type: "challenge",
        title: "Math Puzzle Challenge",
        description: "Solve fun math puzzles to improve your problem-solving skills",
        category: "math",
        difficulty: "intermediate",
        estimatedDuration: 30,
        confidence: 0.75,
        reason: "Helps improve your math skills while keeping it fun and engaging",
        estimatedEngagement: "medium",
        childId: "child1",
        childName: "Emma",
        learningStyle: "visual",
        interests: ["puzzles", "problem-solving"],
        strengths: ["logical-thinking"],
        challenges: ["math"],
        prerequisites: ["basic-math-skills"],
        learningOutcomes: ["problem-solving", "logical-thinking", "math-skills"],
        materials: ["puzzle-sheets", "pencils", "calculator"],
        tags: ["math", "puzzles", "problem-solving", "challenge"],
        createdAt: "2024-01-22T08:45:00Z",
        expiresAt: "2024-01-29T08:45:00Z"
      },
      {
        recommendationId: "rec_004",
        type: "activity",
        title: "Fraction Pizza Game",
        description: "Learn fractions by cutting and sharing pizza",
        category: "math",
        difficulty: "intermediate",
        estimatedDuration: 30,
        confidence: 0.85,
        reason: "Perfect for your kinesthetic learning style and interest in hands-on activities",
        estimatedEngagement: "high",
        childId: "child2",
        childName: "Alex",
        learningStyle: "kinesthetic",
        interests: ["math", "games", "food"],
        strengths: ["logical-thinking", "physical-activity"],
        challenges: ["patience"],
        prerequisites: ["basic-fraction-knowledge"],
        learningOutcomes: ["fractions", "division", "sharing"],
        materials: ["pizza-dough", "toppings", "knife", "cutting-board"],
        tags: ["math", "fractions", "kinesthetic", "food"],
        createdAt: "2024-01-22T11:20:00Z",
        expiresAt: "2024-01-29T11:20:00Z"
      },
      {
        recommendationId: "rec_005",
        type: "path",
        title: "Hands-On Math Master",
        description: "Interactive math activities for kinesthetic learners",
        category: "math",
        difficulty: "advanced",
        estimatedDuration: 180,
        confidence: 0.82,
        reason: "Matches your kinesthetic learning style and advanced math level",
        estimatedEngagement: "high",
        childId: "child2",
        childName: "Alex",
        learningStyle: "kinesthetic",
        interests: ["math", "building", "sports"],
        strengths: ["logical-thinking", "physical-activity"],
        challenges: ["reading"],
        prerequisites: ["intermediate-math-skills"],
        learningOutcomes: ["advanced-math", "problem-solving", "spatial-reasoning"],
        activities: [
          "Fraction Pizza Game",
          "Measurement Race",
          "Geometry Building Challenge"
        ],
        tags: ["math", "kinesthetic", "advanced", "hands-on"],
        createdAt: "2024-01-22T10:00:00Z",
        expiresAt: "2024-01-29T10:00:00Z"
      },
      {
        recommendationId: "rec_006",
        type: "challenge",
        title: "Reading Comprehension Challenge",
        description: "Improve reading skills through interactive stories and activities",
        category: "reading",
        difficulty: "intermediate",
        estimatedDuration: 40,
        confidence: 0.70,
        reason: "Addresses your reading challenge while making it engaging",
        estimatedEngagement: "medium",
        childId: "child2",
        childName: "Alex",
        learningStyle: "kinesthetic",
        interests: ["sports", "building"],
        strengths: ["teamwork", "physical-activity"],
        challenges: ["reading", "patience"],
        prerequisites: ["basic-reading-skills"],
        learningOutcomes: ["reading-comprehension", "vocabulary", "critical-thinking"],
        materials: ["story-books", "activity-sheets", "pencils"],
        tags: ["reading", "comprehension", "challenge", "intermediate"],
        createdAt: "2024-01-22T07:30:00Z",
        expiresAt: "2024-01-29T07:30:00Z"
      }
    ];
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'activity': return '#3b82f6';
      case 'path': return '#10b981';
      case 'challenge': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'activity': return '🎯';
      case 'path': return '🛤️';
      case 'challenge': return '🏆';
      default: return '📝';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'science': return '#06b6d4';
      case 'math': return '#8b5cf6';
      case 'art': return '#f59e0b';
      case 'reading': return '#10b981';
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

  const getEngagementColor = (engagement) => {
    switch (engagement) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleAcceptRecommendation = async (recommendationId) => {
    try {
      const response = await fetch('http://localhost:8000/api/personalization/accept-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          recommendation_id: recommendationId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to accept recommendation');
      }

      // Reload recommendations after accepting
      loadRecommendations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDismissRecommendation = async (recommendationId) => {
    try {
      const response = await fetch('http://localhost:8000/api/personalization/dismiss-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          recommendation_id: recommendationId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to dismiss recommendation');
      }

      // Reload recommendations after dismissing
      loadRecommendations();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const typeMatch = selectedType === 'all' || rec.type === selectedType;
    const categoryMatch = selectedCategory === 'all' || rec.category === selectedCategory;
    return typeMatch && categoryMatch;
  });

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
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '20px'
  };

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

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
          Loading AI recommendations...
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
          🤖 AI Recommendations
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Personalized recommendations powered by AI
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
          <option value="child1">Emma</option>
          <option value="child2">Alex</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Types</option>
          <option value="activity">Activities</option>
          <option value="path">Learning Paths</option>
          <option value="challenge">Challenges</option>
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

      {/* Recommendations Grid */}
      <div style={gridStyle}>
        {filteredRecommendations.map((rec, index) => (
          <div key={index} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{getTypeIcon(rec.type)}</span>
                  <h3 style={{ margin: '0', color: '#1e293b' }}>
                    {rec.title}
                  </h3>
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b' }}>
                  {rec.description}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: getTypeColor(rec.type),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {rec.type}
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: getCategoryColor(rec.category),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {rec.category}
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: getDifficultyColor(rec.difficulty),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {rec.difficulty}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                  {rec.estimatedDuration} min
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
            </div>

            {/* Recommendation Details */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
                Why this recommendation?
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                {rec.reason}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getEngagementColor(rec.estimatedEngagement),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {rec.estimatedEngagement} engagement
                </span>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500'
                }}>
                  For {rec.childName}
                </span>
              </div>
            </div>

            {/* Learning Outcomes */}
            {rec.learningOutcomes && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
                  Learning Outcomes
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {rec.learningOutcomes.map((outcome, idx) => (
                    <span key={idx} style={{
                      padding: '2px 6px',
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500'
                    }}>
                      {outcome}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Materials */}
            {rec.materials && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
                  Materials Needed
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {rec.materials.join(', ')}
                </div>
              </div>
            )}

            {/* Activities */}
            {rec.activities && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
                  Activities ({rec.activities.length})
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {rec.activities.join(', ')}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={buttonStyle}
                onClick={() => handleAcceptRecommendation(rec.recommendationId)}
              >
                Accept
              </button>
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: '#6b7280'
                }}
                onClick={() => handleDismissRecommendation(rec.recommendationId)}
              >
                Dismiss
              </button>
            </div>

            {/* Expiration */}
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>
              Expires: {new Date(rec.expiresAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
            No recommendations found
          </h3>
          <p style={{ margin: '0', fontSize: '14px' }}>
            Try adjusting your filters or check back later for new recommendations.
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIRecommendations;
