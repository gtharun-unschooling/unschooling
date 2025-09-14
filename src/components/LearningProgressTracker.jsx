import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const LearningProgressTracker = () => {
  const [user] = useAuthState(auth);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [learningHistory, setLearningHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadChildrenData();
    }
  }, [user]);

  const loadChildrenData = async () => {
    try {
      setLoading(true);
      const childrenRef = collection(db, `users/${user.uid}/children`);
      const childrenSnapshot = await getDocs(childrenRef);
      
      const childrenList = [];
      for (const childDoc of childrenSnapshot.docs) {
        const childData = childDoc.data();
        childrenList.push({
          id: childDoc.id,
          name: childData.child_name || childData.name || 'Unknown Child',
          age: childData.child_age || childData.age || 5,
          interests: Array.isArray(childData.interests) ? childData.interests : [],
          learningStyle: childData.preferred_learning_style || 'mixed'
        });
      }
      
      setChildren(childrenList);
      if (childrenList.length > 0) {
        setSelectedChild(childrenList[0]);
        await loadLearningHistory(childrenList[0].id);
      }
    } catch (error) {
      console.error('Error loading children:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLearningHistory = async (childId) => {
    try {
      // In a real implementation, this would load from your learning history system
      // For now, we'll create a sample history structure
      const sampleHistory = {
        child_id: childId,
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        learning_sessions: [
          {
            session_id: "session_1",
            topic_id: "Finance_Understanding_Money",
            topic_name: "Understanding Money",
            niche: "Finance",
            age_group: "Toddler",
            difficulty: "Beginner",
            learning_stage: "basic",
            started_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            completed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
            time_spent_minutes: 30,
            activities_completed: ["Money Sorting", "Shopping Pretend Play"],
            parent_rating: 5,
            child_engagement: "high",
            notes: "Child loved the shopping game!",
            status: "completed"
          },
          {
            session_id: "session_2",
            topic_id: "Finance_Coins_and_Bills",
            topic_name: "Coins and Bills",
            niche: "Finance",
            age_group: "Toddler",
            difficulty: "Beginner",
            learning_stage: "basic",
            started_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
            time_spent_minutes: 25,
            activities_completed: ["Coin Sorting", "Value Matching"],
            parent_rating: 4,
            child_engagement: "medium",
            notes: "Good understanding of coin values",
            status: "completed"
          }
        ],
        achievements: [
          {
            id: "first_topic",
            name: "First Steps",
            description: "Completed your first learning topic",
            icon: "🌟",
            unlocked_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        progress_summary: {
          total_sessions: 2,
          total_topics_completed: 2,
          total_learning_time_minutes: 55,
          total_learning_time_hours: 0.92,
          learning_streak_days: 2,
          average_session_length_minutes: 27.5,
          average_engagement_score: 4.5,
          average_parent_rating: 4.5,
          niche_progress: {
            "Finance": {
              completed: 2,
              total_time: 55,
              sessions: []
            }
          },
          stage_progress: {
            "basic": {
              completed: 2,
              total_time: 55
            }
          },
          difficulty_progress: {
            "Beginner": {
              completed: 2,
              total_time: 55
            }
          },
          recent_activity: {
            last_week: 2,
            last_month: 2,
            last_3_months: 2
          },
          strengths: ["high engagement and motivation"],
          areas_for_growth: ["building regular learning habits"],
          recommended_next_topics: [
            {
              type: "niche_continuation",
              niche: "Finance",
              reason: "High success rate in Finance (avg rating: 4.5)",
              priority: "high"
            }
          ]
        }
      };

      setLearningHistory(sampleHistory);
    } catch (error) {
      console.error('Error loading learning history:', error);
    }
  };

  const handleChildSelect = async (child) => {
    setSelectedChild(child);
    await loadLearningHistory(child.id);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getAchievementIcon = (achievement) => {
    return (
      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-white text-2xl">
        {achievement.icon}
      </div>
    );
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading learning progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">Error Loading Progress</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!learningHistory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <h2 className="text-2xl font-bold mb-4">No Learning History</h2>
          <p>Start learning to see your progress!</p>
        </div>
      </div>
    );
  }

  const progress = learningHistory.progress_summary;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Learning Progress Tracker</h1>
          <p className="mt-2 text-gray-600">
            Track your child's learning journey, achievements, and progress
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Child Selection */}
        {children.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Child</h2>
            <div className="flex flex-wrap gap-3">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleChildSelect(child)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    selectedChild?.id === child.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">{child.name}</div>
                    <div className="text-sm text-gray-500">
                      Age: {child.age} • {child.learningStyle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-2xl font-bold text-blue-600">{progress.total_topics_completed}</div>
            <div className="text-sm text-gray-600">Topics Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-2xl font-bold text-green-600">{formatTime(progress.total_learning_time_minutes)}</div>
            <div className="text-sm text-gray-600">Total Learning Time</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-2xl font-bold text-purple-600">{progress.learning_streak_days}</div>
            <div className="text-sm text-gray-600">Learning Streak (Days)</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-2xl font-bold text-orange-600">{progress.average_parent_rating}/5</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Learning Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Learning Sessions</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {learningHistory.learning_sessions.map((session) => (
                  <div key={session.session_id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {session.topic_name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {session.niche}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {session.age_group}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {session.difficulty}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {session.learning_stage}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="font-medium text-gray-700">Time Spent:</span>
                            <span className="ml-2 text-gray-600">{formatTime(session.time_spent_minutes)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Engagement:</span>
                            <span className="ml-2 text-gray-600 capitalize">{session.child_engagement}</span>
                          </div>
                        </div>
                        {session.activities_completed.length > 0 && (
                          <div className="mb-3">
                            <span className="font-medium text-gray-700">Activities:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {session.activities_completed.map((activity, idx) => (
                                <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {session.notes && (
                          <div className="text-sm text-gray-600 italic">
                            "{session.notes}"
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{new Date(session.completed_at).toLocaleDateString()}</div>
                        <div className="text-2xl">⭐ {session.parent_rating}/5</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements and Insights */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
              </div>
              <div className="p-6">
                {learningHistory.achievements.length > 0 ? (
                  <div className="space-y-4">
                    {learningHistory.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        {getAchievementIcon(achievement)}
                        <div>
                          <h3 className="font-medium text-gray-900">{achievement.name}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(achievement.unlocked_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No achievements yet. Keep learning!</p>
                )}
              </div>
            </div>

            {/* Strengths */}
            {progress.strengths.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Strengths</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {progress.strengths.map((strength, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Growth Areas */}
            {progress.areas_for_growth.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Areas for Growth</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {progress.areas_for_growth.map((area, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-blue-500">💡</span>
                        <span className="text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {progress.recommended_next_topics.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Recommendations</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {progress.recommended_next_topics.map((rec, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="font-medium text-blue-900">{rec.type.replace('_', ' ')}</div>
                        <div className="text-sm text-blue-700">{rec.reason}</div>
                        <div className="text-xs text-blue-600 mt-1 capitalize">
                          Priority: {rec.priority}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Charts */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Niche Progress */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Progress by Niche</h2>
            </div>
            <div className="p-6">
              {Object.entries(progress.niche_progress).map(([niche, data]) => (
                <div key={niche} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">{niche}</span>
                    <span className="text-sm text-gray-500">
                      {data.completed} topics • {formatTime(data.total_time)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.completed / Math.max(progress.total_topics_completed, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stage Progress */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Progress by Learning Stage</h2>
            </div>
            <div className="p-6">
              {Object.entries(progress.stage_progress).map(([stage, data]) => (
                <div key={stage} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700 capitalize">{stage}</span>
                    <span className="text-sm text-gray-500">
                      {data.completed} topics • {formatTime(data.total_time)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.completed / Math.max(progress.total_topics_completed, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProgressTracker;
