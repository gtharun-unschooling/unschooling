import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const AdaptiveLearningPaths = () => {
  const [user] = useAuthState(auth);
  const [learningPaths, setLearningPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    if (user) {
      loadLearningPaths();
    }
  }, [user, selectedChild, selectedSubject, selectedDifficulty]);

  const loadLearningPaths = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/personalization/learning-paths?user_id=${user.uid}&child_id=${selectedChild}&subject=${selectedSubject}&difficulty=${selectedDifficulty}`);
      
      if (!response.ok) {
        throw new Error('Failed to load learning paths');
      }

      const data = await response.json();
      setLearningPaths(data.learningPaths || []);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setLearningPaths(getSampleLearningPaths());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleLearningPaths = () => {
    return [
      {
        pathId: "science_visual_beginner",
        title: "Visual Science Explorer",
        description: "A beginner-friendly science path designed for visual learners",
        subject: "science",
        difficulty: "beginner",
        learningStyle: "visual",
        estimatedDuration: "4 weeks",
        totalActivities: 12,
        completedActivities: 8,
        progress: 67,
        completionRate: 85,
        averageRating: 4.8,
        activities: [
          {
            activityId: "rainbow_milk",
            title: "Rainbow Milk Experiment",
            description: "Create beautiful rainbow patterns in milk using food coloring and soap",
            type: "experiment",
            difficulty: "beginner",
            duration: 20,
            visualElements: ["colorful", "step-by-step", "diagrams"],
            learningOutcomes: ["color-mixing", "surface-tension", "observation"],
            isCompleted: true,
            rating: 5
          },
          {
            activityId: "solar_system_model",
            title: "Solar System Model",
            description: "Build a 3D model of our solar system",
            type: "project",
            difficulty: "intermediate",
            duration: 45,
            visualElements: ["3d-model", "charts", "illustrations"],
            learningOutcomes: ["planets", "scale", "space"],
            isCompleted: true,
            rating: 4
          },
          {
            activityId: "plant_growth_tracking",
            title: "Plant Growth Tracking",
            description: "Observe and document plant growth over time",
            type: "observation",
            difficulty: "beginner",
            duration: 30,
            visualElements: ["charts", "photos", "measurements"],
            learningOutcomes: ["plant-life", "measurement", "documentation"],
            isCompleted: false,
            rating: null
          }
        ],
        prerequisites: [],
        nextPaths: ["science_visual_intermediate", "science_kinesthetic_beginner"]
      },
      {
        pathId: "math_kinesthetic_intermediate",
        title: "Hands-On Math Master",
        description: "Interactive math activities for kinesthetic learners",
        subject: "math",
        difficulty: "intermediate",
        learningStyle: "kinesthetic",
        estimatedDuration: "6 weeks",
        totalActivities: 15,
        completedActivities: 6,
        progress: 40,
        completionRate: 78,
        averageRating: 4.6,
        activities: [
          {
            activityId: "fraction_pizza",
            title: "Fraction Pizza Game",
            description: "Learn fractions by cutting and sharing pizza",
            type: "game",
            difficulty: "intermediate",
            duration: 30,
            kinestheticElements: ["cutting", "moving", "building"],
            learningOutcomes: ["fractions", "division", "sharing"],
            isCompleted: true,
            rating: 5
          },
          {
            activityId: "measurement_race",
            title: "Measurement Race",
            description: "Race to measure different objects around the house",
            type: "activity",
            difficulty: "intermediate",
            duration: 25,
            kinestheticElements: ["running", "measuring", "comparing"],
            learningOutcomes: ["measurement", "comparison", "estimation"],
            isCompleted: true,
            rating: 4
          },
          {
            activityId: "geometry_building",
            title: "Geometry Building Challenge",
            description: "Build 3D shapes using everyday materials",
            type: "project",
            difficulty: "intermediate",
            duration: 40,
            kinestheticElements: ["building", "constructing", "manipulating"],
            learningOutcomes: ["3d-shapes", "geometry", "spatial-reasoning"],
            isCompleted: false,
            rating: null
          }
        ],
        prerequisites: ["math_kinesthetic_beginner"],
        nextPaths: ["math_kinesthetic_advanced", "math_visual_intermediate"]
      },
      {
        pathId: "art_creative_beginner",
        title: "Creative Art Journey",
        description: "Explore different art techniques and mediums",
        subject: "art",
        difficulty: "beginner",
        learningStyle: "visual",
        estimatedDuration: "3 weeks",
        totalActivities: 10,
        completedActivities: 10,
        progress: 100,
        completionRate: 92,
        averageRating: 4.9,
        activities: [
          {
            activityId: "watercolor_galaxy",
            title: "Watercolor Galaxy",
            description: "Create a beautiful galaxy painting using watercolors and salt",
            type: "painting",
            difficulty: "beginner",
            duration: 45,
            visualElements: ["colorful", "creative", "step-by-step"],
            learningOutcomes: ["watercolor-techniques", "color-blending", "creativity"],
            isCompleted: true,
            rating: 5
          },
          {
            activityId: "collage_self_portrait",
            title: "Collage Self Portrait",
            description: "Create a self-portrait using magazine cutouts",
            type: "collage",
            difficulty: "beginner",
            duration: 35,
            visualElements: ["colorful", "textured", "personal"],
            learningOutcomes: ["collage-techniques", "self-expression", "composition"],
            isCompleted: true,
            rating: 5
          }
        ],
        prerequisites: [],
        nextPaths: ["art_creative_intermediate", "art_3d_beginner"]
      },
      {
        pathId: "reading_comprehension_intermediate",
        title: "Reading Comprehension Master",
        description: "Improve reading skills through interactive stories and activities",
        subject: "reading",
        difficulty: "intermediate",
        learningStyle: "reading",
        estimatedDuration: "5 weeks",
        totalActivities: 18,
        completedActivities: 12,
        progress: 67,
        completionRate: 88,
        averageRating: 4.7,
        activities: [
          {
            activityId: "story_sequencing",
            title: "Story Sequencing Challenge",
            description: "Put story events in the correct order",
            type: "comprehension",
            difficulty: "intermediate",
            duration: 25,
            readingElements: ["story-analysis", "sequence-logic", "comprehension"],
            learningOutcomes: ["story-structure", "sequence-logic", "comprehension"],
            isCompleted: true,
            rating: 4
          },
          {
            activityId: "character_analysis",
            title: "Character Analysis",
            description: "Analyze character traits and motivations",
            type: "analysis",
            difficulty: "intermediate",
            duration: 30,
            readingElements: ["character-study", "trait-analysis", "inference"],
            learningOutcomes: ["character-analysis", "inference", "critical-thinking"],
            isCompleted: true,
            rating: 5
          }
        ],
        prerequisites: ["reading_comprehension_beginner"],
        nextPaths: ["reading_comprehension_advanced", "reading_creative_writing"]
      }
    ];
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'science': return '#06b6d4';
      case 'math': return '#8b5cf6';
      case 'art': return '#f59e0b';
      case 'reading': return '#10b981';
      default: return '#6b7280';
    }
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

  const handleStartPath = async (pathId) => {
    try {
      const response = await fetch('http://localhost:8000/api/personalization/start-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          path_id: pathId,
          child_id: selectedChild
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start learning path');
      }

      // Reload paths after starting
      loadLearningPaths();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredPaths = learningPaths.filter(path => {
    const subjectMatch = selectedSubject === 'all' || path.subject === selectedSubject;
    const difficultyMatch = selectedDifficulty === 'all' || path.difficulty === selectedDifficulty;
    return subjectMatch && difficultyMatch;
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
          Loading adaptive learning paths...
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
          🛤️ Adaptive Learning Paths
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Personalized learning journeys tailored to each child's needs
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
          <option value="child1">Child 1</option>
          <option value="child2">Child 2</option>
        </select>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Subjects</option>
          <option value="science">Science</option>
          <option value="math">Math</option>
          <option value="art">Art</option>
          <option value="reading">Reading</option>
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Learning Paths */}
      <div style={gridStyle}>
        {filteredPaths.map((path, index) => (
          <div key={index} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
                  {path.title}
                </h3>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b' }}>
                  {path.description}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: getSubjectColor(path.subject),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {path.subject}
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: getDifficultyColor(path.difficulty),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {path.difficulty}
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: getLearningStyleColor(path.learningStyle),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {path.learningStyle}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                  {path.estimatedDuration}
                </div>
                <div style={{ fontSize: '12px', color: '#10b981' }}>
                  ⭐ {path.averageRating}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#1e293b' }}>
                  Progress
                </span>
                <span style={{ fontSize: '14px', color: '#64748b' }}>
                  {path.completedActivities} / {path.totalActivities} activities
                </span>
              </div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(path.progress)}></div>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                {path.progress}% complete • {path.completionRate}% completion rate
              </div>
            </div>

            {/* Activities Preview */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
                Activities ({path.activities.length})
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {path.activities.slice(0, 3).map((activity, actIndex) => (
                  <div key={actIndex} style={{
                    padding: '8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    marginBottom: '4px',
                    fontSize: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#1e293b' }}>
                        {activity.isCompleted ? '✅' : '⏳'} {activity.title}
                      </span>
                      {activity.rating && (
                        <span style={{ color: '#f59e0b' }}>
                          ⭐ {activity.rating}
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#64748b', marginTop: '2px' }}>
                      {activity.duration} min • {activity.type}
                    </div>
                  </div>
                ))}
                {path.activities.length > 3 && (
                  <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', padding: '4px' }}>
                    +{path.activities.length - 3} more activities
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button
              style={{
                ...buttonStyle,
                backgroundColor: path.progress === 100 ? '#10b981' : '#3b82f6',
                width: '100%'
              }}
              onClick={() => handleStartPath(path.pathId)}
            >
              {path.progress === 100 ? 'Path Completed' : 
               path.progress > 0 ? 'Continue Path' : 'Start Path'}
            </button>
          </div>
        ))}
      </div>

      {filteredPaths.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
            No learning paths found
          </h3>
          <p style={{ margin: '0', fontSize: '14px' }}>
            Try adjusting your filters to see more learning paths.
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

export default AdaptiveLearningPaths;
