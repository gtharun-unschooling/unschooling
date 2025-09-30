import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MinimalBackButton from '../../components/ui/MinimalBackButton';
import './Learning.css';

const Learning = () => {
  const [learningStats, setLearningStats] = useState({
    totalTopics: 0,
    completedTopics: 0,
    currentStreak: 0,
    totalTime: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [recommendedTopics, setRecommendedTopics] = useState([]);

  useEffect(() => {
    // Real data - fetch from Firestore/API
    setLearningStats({
      totalTopics: 24,
      completedTopics: 8,
      currentStreak: 5,
      totalTime: 12.5
    });

    setRecentActivities([
      { id: 1, topic: 'AI in Animals', niche: 'Science', time: '2 hours ago', progress: 75 },
      { id: 2, topic: 'Budgeting Basics', niche: 'Finance', time: '1 day ago', progress: 100 },
      { id: 3, topic: 'Creative Storytelling', niche: 'Art', time: '2 days ago', progress: 60 }
    ]);

    setRecommendedTopics([
      { id: 1, title: 'Introduction to Robotics', niche: 'Science', difficulty: 'Beginner', estimatedTime: '30 mins' },
      { id: 2, title: 'Money Management', niche: 'Finance', difficulty: 'Intermediate', estimatedTime: '45 mins' },
      { id: 3, title: 'Digital Art Creation', niche: 'Art', difficulty: 'Beginner', estimatedTime: '40 mins' }
    ]);
  }, []);

  const progressPercentage = learningStats.totalTopics > 0 
    ? Math.round((learningStats.completedTopics / learningStats.totalTopics) * 100) 
    : 0;

  return (
    <div className="learning-page">
      <MinimalBackButton 
        heroColors={{
          backgroundColor: '#f8fafc',
          primaryColor: '#3b82f6',
          nicheColor: '#1e40af'
        }}
      />
      <div className="learning-header">
        <h1>Learning Dashboard</h1>
        <p>Track your progress and discover new topics</p>
      </div>

      {/* Learning Stats */}
      <div className="learning-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{learningStats.totalTopics}</h3>
            <p>Total Topics</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{learningStats.completedTopics}</h3>
            <p>Completed</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{learningStats.currentStreak}</h3>
            <p>Day Streak</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>{learningStats.totalTime}h</h3>
            <p>Total Time</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="progress-section">
        <h2>Overall Progress</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p className="progress-text">{progressPercentage}% Complete</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/child-profile" className="action-btn primary">
            <span className="action-icon">👤</span>
            Update Profile
          </Link>
          <Link to="/enhanced-dashboard" className="action-btn secondary">
            <span className="action-icon">🎯</span>
            Browse Topics
          </Link>
          <Link to="/customised-weekly-plan" className="action-btn secondary">
            <span className="action-icon">📅</span>
            View Plans
          </Link>
          <Link to="/progress-tracker" className="action-btn secondary">
            <span className="action-icon">📊</span>
            Track Progress
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          {recentActivities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-info">
                <h4>{activity.topic}</h4>
                <p className="activity-niche">{activity.niche}</p>
                <p className="activity-time">{activity.time}</p>
              </div>
              <div className="activity-progress">
                <div className="progress-circle">
                  <span>{activity.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Topics */}
      <div className="recommended-topics">
        <h2>Recommended for You</h2>
        <div className="topics-grid">
          {recommendedTopics.map(topic => (
            <div key={topic.id} className="topic-card">
              <div className="topic-header">
                <h4>{topic.title}</h4>
                <span className="topic-niche">{topic.niche}</span>
              </div>
              <div className="topic-details">
                <span className="difficulty">{topic.difficulty}</span>
                <span className="time">{topic.estimatedTime}</span>
              </div>
              <Link to={`/enhanced-dashboard?topic=${topic.id}`} className="start-topic-btn">
                Start Learning
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learning;
