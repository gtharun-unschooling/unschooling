import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const EnhancedLearningDashboard = () => {
  const [user] = useAuthState(auth);
  const [children, setChildren] = useState([]);
  const [enhancedTopics, setEnhancedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filterValue, setFilterValue] = useState('');

  // Load enhanced topics data
  useEffect(() => {
    const loadEnhancedTopics = async () => {
      try {
        const response = await fetch('/api/topics/enhanced');
        if (response.ok) {
          const data = await response.json();
          setEnhancedTopics(data.topics);
        }
      } catch (error) {
        console.error('Error loading enhanced topics:', error);
      }
    };

    if (user) {
      loadEnhancedTopics();
    }
  }, [user]);

  // Load children data
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
          learningStyle: childData.preferred_learning_style || 'mixed',
          ageGroup: getAgeGroup(childData.child_age || childData.age || 5)
        });
      }
      
      setChildren(childrenList);
      if (childrenList.length > 0) {
        setSelectedChild(childrenList[0]);
      }
    } catch (error) {
      console.error('Error loading children:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAgeGroup = (age) => {
    if (age <= 2) return 'Infant';
    if (age <= 4) return 'Toddler';
    if (age <= 8) return 'Children';
    if (age <= 12) return 'Pre-Teen';
    return 'Children';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-yellow-100 text-yellow-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgeGroupColor = (ageGroup) => {
    switch (ageGroup) {
      case 'Infant': return 'bg-pink-100 text-pink-800';
      case 'Toddler': return 'bg-purple-100 text-purple-800';
      case 'Children': return 'bg-blue-100 text-blue-800';
      case 'Pre-Teen': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLearningStageColor = (stage) => {
    switch (stage) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterTopics = () => {
    if (!filterValue) return enhancedTopics;

    switch (selectedFilter) {
      case 'age_group':
        return enhancedTopics.filter(topic => 
          topic.age_group && topic.age_group.toLowerCase().includes(filterValue.toLowerCase())
        );
      case 'difficulty':
        return enhancedTopics.filter(topic => 
          topic.difficulty && topic.difficulty.toLowerCase().includes(filterValue.toLowerCase())
        );
      case 'learning_stage':
        return enhancedTopics.filter(topic => 
          topic.learning_stage && topic.learning_stage.toLowerCase().includes(filterValue.toLowerCase())
        );
      case 'niche':
        return enhancedTopics.filter(topic => 
          topic.niche && topic.niche.toLowerCase().includes(filterValue.toLowerCase())
        );
      default:
        return enhancedTopics.filter(topic => 
          topic.topic_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          topic.niche.toLowerCase().includes(filterValue.toLowerCase())
        );
    }
  };

  const filteredTopics = filterTopics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading enhanced learning dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Learning Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Explore topics organized by age groups, difficulty levels, and learning stages
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Children Selection */}
        {children.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Child</h2>
            <div className="flex flex-wrap gap-3">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    selectedChild?.id === child.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">{child.name}</div>
                    <div className="text-sm text-gray-500">
                      Age: {child.age} • {child.ageGroup}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filter Topics</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter By
              </label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Topics</option>
                <option value="age_group">Age Group</option>
                <option value="difficulty">Difficulty Level</option>
                <option value="learning_stage">Learning Stage</option>
                <option value="niche">Niche</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Value
              </label>
              <input
                type="text"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder={`Enter ${selectedFilter.replace('_', ' ')}...`}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setFilterValue('')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-2xl font-bold text-blue-600">{enhancedTopics.length}</div>
            <div className="text-sm text-gray-600">Total Topics</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-2xl font-bold text-green-600">
              {new Set(enhancedTopics.map(t => t.age_group).filter(Boolean)).size}
            </div>
            <div className="text-sm text-gray-600">Age Groups</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(enhancedTopics.map(t => t.difficulty).filter(Boolean)).size}
            </div>
            <div className="text-sm text-gray-600">Difficulty Levels</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-2xl font-bold text-orange-600">
              {new Set(enhancedTopics.map(t => t.niche).filter(Boolean)).size}
            </div>
            <div className="text-sm text-gray-600">Niches</div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Topics ({filteredTopics.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredTopics.map((topic, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {topic.topic_name}
                      </h3>
                      <span className="text-sm text-gray-500">#{index + 1}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {topic.age_group && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAgeGroupColor(topic.age_group)}`}>
                          {topic.age_group}
                        </span>
                      )}
                      {topic.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                          {topic.difficulty}
                        </span>
                      )}
                      {topic.learning_stage && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLearningStageColor(topic.learning_stage)}`}>
                          {topic.learning_stage.toUpperCase()}
                        </span>
                      )}
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {topic.niche}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{topic.objective}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Estimated Time:</span>
                        <span className="ml-2 text-gray-600">
                          {topic.estimated_time} ({topic.estimated_time_minutes} min)
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Content Richness:</span>
                        <span className="ml-2 text-gray-600">{topic.content_richness || 'Standard'}</span>
                      </div>
                    </div>

                    {topic.prerequisites && topic.prerequisites.length > 0 && (
                      <div className="mt-3">
                        <span className="font-medium text-gray-700">Prerequisites:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {topic.prerequisites.slice(0, 3).map((prereq, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                              {prereq.split('_').slice(-1)[0]}
                            </span>
                          ))}
                          {topic.prerequisites.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                              +{topic.prerequisites.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {topic.learning_path && topic.learning_path.length > 0 && (
                      <div className="mt-3">
                        <span className="font-medium text-gray-700">Learning Path:</span>
                        <div className="flex items-center gap-2 mt-1">
                          {topic.learning_path.map((step, idx) => (
                            <React.Fragment key={idx}>
                              <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                                {step}
                              </span>
                              {idx < topic.learning_path.length - 1 && (
                                <span className="text-gray-400">→</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No topics found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedLearningDashboard;

