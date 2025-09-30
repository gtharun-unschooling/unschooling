/**
 * Unified Plan Format System
 * 
 * This system standardizes the data flow from:
 * Schedule Agent → Reviewer Agent → Customised Weekly Plan Page
 * 
 * All agents now use the same data structure for consistency
 */

// Standardized Weekly Plan Structure
export const createUnifiedWeeklyPlan = (rawData, childProfile) => {
  const plan = {
    // Metadata
    metadata: {
      childName: childProfile?.child_name || childProfile?.name || 'Unknown Child',
      childAge: childProfile?.child_age || childProfile?.age || 5,
      interests: Array.isArray(childProfile?.interests) ? childProfile.interests : [],
      learningStyle: childProfile?.preferred_learning_style || childProfile?.learning_style || 'mixed',
      goals: Array.isArray(childProfile?.goals) ? childProfile.goals : [],
      planType: childProfile?.plan_type || 'hybrid',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    },

    // Learning Objectives (from Schedule Agent)
    learningObjectives: {
      primary: rawData.learning_objectives || rawData.learningObjectives || [],
      secondary: rawData.secondary_objectives || [],
      weeklyGoals: rawData.weekly_goals || rawData.weeklyGoals || []
    },

    // Weekly Structure (from Schedule Agent)
    weeklyStructure: {
      totalWeeks: 4,
      planType: rawData.plan_type || rawData.planType || 'hybrid',
      approach: rawData.systematic_approach || rawData.approach || 'balanced',
      methodology: rawData.methodology || 'progressive_learning'
    },

    // Weekly Plans (from Schedule Agent)
    weeklyPlans: standardizeWeeklyPlans(rawData.weekly_plan || rawData.weeklyPlan || {}),

    // Review & Optimization (from Reviewer Agent)
    review: {
      insights: rawData.review_insights || rawData.reviewInsights || {},
      recommendations: rawData.recommended_activities || rawData.recommendations || [],
      optimizations: rawData.plan_optimization || rawData.optimizations || {},
      progressTracking: rawData.progress_tracking || rawData.progressTracking || {},
      effectiveness: rawData.effectiveness_score || rawData.effectivenessScore || 0
    },

    // Matched Topics (from Match Agent)
    matchedTopics: standardizeMatchedTopics(rawData.matched_topics || rawData.matchedTopics || []),

    // Plan Summary
    summary: {
      totalActivities: calculateTotalActivities(rawData.weekly_plan || rawData.weeklyPlan || {}),
      estimatedDuration: calculateTotalDuration(rawData.weekly_plan || rawData.weeklyPlan || {}),
      difficultyLevel: rawData.difficulty_level || rawData.difficultyLevel || 'beginner',
      engagementScore: rawData.engagement_score || rawData.engagementScore || 0
    }
  };

  return plan;
};

// Standardize weekly plans structure
const standardizeWeeklyPlans = (weeklyPlanData) => {
  const standardized = {};
  
  Object.entries(weeklyPlanData).forEach(([weekKey, weekData]) => {
    if (!weekData || typeof weekData !== 'object') return;
    
    const weekNumber = weekKey.replace(/[^0-9]/g, '') || '1';
    
    standardized[weekKey] = {
      weekNumber: parseInt(weekNumber),
      weekTitle: formatWeekTitle(weekKey),
      theme: weekData.week_theme || weekData.weekTheme || weekData.theme || '',
      goal: weekData.week_goal || weekData.weekGoal || weekData.goal || '',
      focus: weekData.week_focus || weekData.weekFocus || weekData.focus || '',
      
      // Daily activities
      days: standardizeDailyActivities(weekData),
      
      // Week-specific objectives
      objectives: weekData.week_objectives || weekData.weekObjectives || weekData.objectives || [],
      
      // Week metadata
      estimatedTime: weekData.estimated_time || weekData.estimatedTime || '2-3 hours',
      difficulty: weekData.difficulty || 'beginner',
      materials: weekData.materials || weekData.required_materials || []
    };
  });
  
  return standardized;
};

// Standardize daily activities
const standardizeDailyActivities = (weekData) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const standardized = {};
  
  days.forEach(day => {
    const dayData = weekData[day];
    if (dayData && typeof dayData === 'object') {
      standardized[day] = {
        dayName: day.charAt(0).toUpperCase() + day.slice(1),
        topic: dayData.topic || dayData.topic_name || dayData.topicName || '',
        objective: dayData.objective || dayData.learning_objective || dayData.learningObjective || '',
        activities: Array.isArray(dayData.activities) ? dayData.activities : 
                   dayData.activity ? [dayData.activity] : [],
        estimatedTime: dayData.estimated_time || dayData.estimatedTime || dayData.duration || '20-30 mins',
        materials: dayData.materials || dayData.required_materials || dayData.requiredMaterials || [],
        instructions: dayData.instructions || dayData.steps || dayData.directions || [],
        expectedOutcome: dayData.expected_outcome || dayData.expectedOutcome || dayData.outcome || '',
        difficulty: dayData.difficulty || 'beginner',
        engagement: dayData.engagement || dayData.engagement_level || 'medium'
      };
    }
  });
  
  return standardized;
};

// Standardize matched topics
const standardizeMatchedTopics = (topicsData) => {
  if (!Array.isArray(topicsData)) return [];
  
  return topicsData.map(topic => {
    if (!topic || typeof topic !== 'object') return null;
    
    return {
      id: topic.id || topic.topic_id || topic.topicId || Math.random().toString(36).substr(2, 9),
      name: topic.topic || topic.topic_name || topic.topicName || topic.name || 'Unknown Topic',
      niche: topic.niche || topic.Niche || topic.category || 'General',
      objective: topic.objective || topic.Objective || topic.learning_objective || 'Learn and explore',
      explanation: topic.explanation || topic.Explanation || topic.description || topic.desc || '',
      estimatedTime: topic.estimated_time || topic.estimatedTime || topic.duration || '20-30 mins',
      age: topic.age || topic.Age || topic.age_range || topic.ageRange || '5-12',
      difficulty: topic.difficulty || topic.Difficulty || topic.level || 'beginner',
      learningStyle: Array.isArray(topic.learning_style) ? topic.learning_style : 
                     topic.learningStyle ? [topic.learningStyle] : ['mixed'],
      hashtags: topic.hashtags || topic.Hashtags || topic.tags || topic.Tags || '',
      
      // Activities
      activities: {
        primary: topic.activity1 || topic.primary_activity || topic.primaryActivity || {},
        secondary: topic.activity2 || topic.secondary_activity || topic.secondaryActivity || {}
      },
      
      // Metadata
      source: topic.source || 'database',
      lastUpdated: topic.last_updated || topic.lastUpdated || new Date().toISOString()
    };
  }).filter(Boolean);
};

// Helper functions
const formatWeekTitle = (weekKey) => {
  return weekKey
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/week\s*(\d+)/i, 'Week $1');
};

const calculateTotalActivities = (weeklyPlanData) => {
  let total = 0;
  Object.values(weeklyPlanData).forEach(weekData => {
    if (weekData && typeof weekData === 'object') {
      Object.values(weekData).forEach(dayData => {
        if (dayData && typeof dayData === 'object' && dayData.activities) {
          total += Array.isArray(dayData.activities) ? dayData.activities.length : 1;
        }
      });
    }
  });
  return total;
};

const calculateTotalDuration = (weeklyPlanData) => {
  let totalMinutes = 0;
  Object.values(weeklyPlanData).forEach(weekData => {
    if (weekData && typeof weekData === 'object') {
      Object.values(weekData).forEach(dayData => {
        if (dayData && typeof dayData === 'object' && dayData.estimatedTime) {
          const timeStr = dayData.estimatedTime.toString();
          const minutes = parseInt(timeStr.match(/(\d+)/)?.[1] || '20');
          totalMinutes += minutes;
        }
      });
    }
  });
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Export utility functions for components
export const getPlanSummary = (unifiedPlan) => {
  return {
    childName: unifiedPlan.metadata.childName,
    totalWeeks: unifiedPlan.weeklyStructure.totalWeeks,
    planType: unifiedPlan.weeklyStructure.planType,
    totalActivities: unifiedPlan.summary.totalActivities,
    estimatedDuration: unifiedPlan.summary.estimatedDuration,
    learningObjectives: unifiedPlan.learningObjectives.primary.length,
    matchedTopics: unifiedPlan.matchedTopics.length
  };
};

export const getWeekData = (unifiedPlan, weekKey) => {
  return unifiedPlan.weeklyPlans[weekKey] || null;
};

export const getDayData = (unifiedPlan, weekKey, dayKey) => {
  const weekData = getWeekData(unifiedPlan, weekKey);
  return weekData?.days?.[dayKey] || null;
};

export const formatPlanForDisplay = (unifiedPlan) => {
  return {
    overview: {
      title: `${unifiedPlan.metadata.childName}'s ${unifiedPlan.weeklyStructure.planType} Learning Plan`,
      subtitle: `${unifiedPlan.weeklyStructure.totalWeeks} weeks • ${unifiedPlan.summary.totalActivities} activities • ${unifiedPlan.summary.estimatedDuration}`,
      childInfo: {
        name: unifiedPlan.metadata.childName,
        age: unifiedPlan.metadata.childAge,
        interests: unifiedPlan.metadata.interests,
        learningStyle: unifiedPlan.metadata.learningStyle
      }
    },
    weeks: Object.entries(unifiedPlan.weeklyPlans).map(([weekKey, weekData]) => ({
      key: weekKey,
      title: weekData.weekTitle,
      theme: weekData.theme,
      goal: weekData.goal,
      days: Object.entries(weekData.days).map(([dayKey, dayData]) => ({
        key: dayKey,
        name: dayData.dayName,
        topic: dayData.topic,
        objective: dayData.objective,
        activities: dayData.activities,
        estimatedTime: dayData.estimatedTime,
        materials: dayData.materials
      }))
    })),
    objectives: unifiedPlan.learningObjectives.primary,
    topics: unifiedPlan.matchedTopics,
    review: unifiedPlan.review
  };
};
