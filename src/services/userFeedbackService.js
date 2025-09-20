/**
 * User Feedback Service
 * Comprehensive user feedback collection and analysis system
 */

class UserFeedbackService {
  constructor() {
    this.feedbackTypes = {
      BUG_REPORT: 'bug_report',
      FEATURE_REQUEST: 'feature_request',
      USER_EXPERIENCE: 'user_experience',
      GENERAL_FEEDBACK: 'general_feedback',
      SATISFACTION_SURVEY: 'satisfaction_survey'
    };
    
    this.feedbackChannels = {
      IN_APP: 'in_app',
      EMAIL: 'email',
      SUPPORT_TICKET: 'support_ticket',
      SURVEY: 'survey',
      SOCIAL_MEDIA: 'social_media'
    };
    
    this.feedbackData = {
      submissions: [],
      analytics: {
        totalSubmissions: 0,
        averageRating: 0,
        satisfactionTrend: [],
        topIssues: [],
        featureRequests: []
      }
    };
    
    this.init();
  }

  init() {
    this.setupFeedbackCollection();
    this.setupSatisfactionSurveys();
    this.setupFeatureRequestSystem();
    this.setupBugReporting();
    this.setupAnalytics();
  }

  /**
   * Setup feedback collection system
   */
  setupFeedbackCollection() {
    // Create feedback collection UI
    this.createFeedbackWidget();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize feedback analytics
    this.initializeAnalytics();
  }

  /**
   * Create feedback widget
   */
  createFeedbackWidget() {
    if (typeof document !== 'undefined') {
      // Create feedback button
      const feedbackButton = document.createElement('div');
      feedbackButton.id = 'feedback-widget';
      feedbackButton.innerHTML = `
        <div class="feedback-button" onclick="window.feedbackService.showFeedbackModal()">
          <span>💬</span>
          <span>Feedback</span>
        </div>
      `;
      
      // Add styles
      const styles = `
        #feedback-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        
        .feedback-button {
          background: #007bff;
          color: white;
          padding: 12px 16px;
          border-radius: 25px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
          transition: all 0.3s ease;
        }
        
        .feedback-button:hover {
          background: #0056b3;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
        }
        
        .feedback-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: none;
          z-index: 1001;
        }
        
        .feedback-modal-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 30px;
          border-radius: 10px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .feedback-form input,
        .feedback-form textarea,
        .feedback-form select {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }
        
        .feedback-form textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .feedback-form button {
          background: #007bff;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .feedback-form button:hover {
          background: #0056b3;
        }
        
        .close-modal {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
      `;
      
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      
      document.body.appendChild(feedbackButton);
      
      // Make service globally available
      window.feedbackService = this;
    }
  }

  /**
   * Show feedback modal
   */
  showFeedbackModal() {
    if (typeof document !== 'undefined') {
      const modal = document.createElement('div');
      modal.className = 'feedback-modal';
      modal.innerHTML = `
        <div class="feedback-modal-content">
          <button class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</button>
          <h2>Share Your Feedback</h2>
          <form class="feedback-form" onsubmit="window.feedbackService.submitFeedback(event)">
            <div>
              <label for="feedback-type">Feedback Type:</label>
              <select id="feedback-type" name="type" required>
                <option value="">Select feedback type</option>
                <option value="${this.feedbackTypes.BUG_REPORT}">Bug Report</option>
                <option value="${this.feedbackTypes.FEATURE_REQUEST}">Feature Request</option>
                <option value="${this.feedbackTypes.USER_EXPERIENCE}">User Experience</option>
                <option value="${this.feedbackTypes.GENERAL_FEEDBACK}">General Feedback</option>
              </select>
            </div>
            
            <div>
              <label for="feedback-rating">Overall Satisfaction:</label>
              <select id="feedback-rating" name="rating" required>
                <option value="">Select rating</option>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Very Poor</option>
              </select>
            </div>
            
            <div>
              <label for="feedback-subject">Subject:</label>
              <input type="text" id="feedback-subject" name="subject" required placeholder="Brief description of your feedback">
            </div>
            
            <div>
              <label for="feedback-message">Message:</label>
              <textarea id="feedback-message" name="message" required placeholder="Please provide detailed feedback..."></textarea>
            </div>
            
            <div>
              <label for="feedback-email">Email (optional):</label>
              <input type="email" id="feedback-email" name="email" placeholder="your@email.com">
            </div>
            
            <button type="submit">Submit Feedback</button>
          </form>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.style.display = 'block';
      
      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }
  }

  /**
   * Submit feedback
   */
  submitFeedback(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const feedback = {
      id: this.generateFeedbackId(),
      type: formData.get('type'),
      rating: parseInt(formData.get('rating')),
      subject: formData.get('subject'),
      message: formData.get('message'),
      email: formData.get('email'),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      channel: this.feedbackChannels.IN_APP,
      status: 'submitted'
    };
    
    // Store feedback
    this.storeFeedback(feedback);
    
    // Send to backend
    this.sendFeedbackToBackend(feedback);
    
    // Show confirmation
    this.showFeedbackConfirmation();
    
    // Close modal
    event.target.closest('.feedback-modal').remove();
  }

  /**
   * Store feedback locally
   */
  storeFeedback(feedback) {
    this.feedbackData.submissions.push(feedback);
    this.feedbackData.analytics.totalSubmissions++;
    
    // Update analytics
    this.updateAnalytics();
    
    // Store in localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userFeedback', JSON.stringify(this.feedbackData));
    }
  }

  /**
   * Send feedback to backend
   */
  async sendFeedbackToBackend(feedback) {
    try {
      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback)
      });
      
      if (response.ok) {
        console.log('✅ Feedback submitted successfully');
      } else {
        console.error('❌ Failed to submit feedback');
      }
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
    }
  }

  /**
   * Show feedback confirmation
   */
  showFeedbackConfirmation() {
    if (typeof document !== 'undefined') {
      const confirmation = document.createElement('div');
      confirmation.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1002;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
      `;
      confirmation.textContent = '✅ Thank you for your feedback!';
      
      document.body.appendChild(confirmation);
      
      // Remove after 3 seconds
      setTimeout(() => {
        confirmation.remove();
      }, 3000);
    }
  }

  /**
   * Setup satisfaction surveys
   */
  setupSatisfactionSurveys() {
    // Trigger satisfaction survey after user interactions
    this.setupSurveyTriggers();
    
    // Create survey templates
    this.createSurveyTemplates();
  }

  /**
   * Setup survey triggers
   */
  setupSurveyTriggers() {
    if (typeof window !== 'undefined') {
      // Trigger survey after 3 page visits
      let pageVisits = parseInt(localStorage.getItem('pageVisits') || '0');
      pageVisits++;
      localStorage.setItem('pageVisits', pageVisits.toString());
      
      if (pageVisits === 3) {
        setTimeout(() => {
          this.showSatisfactionSurvey();
        }, 5000);
      }
      
      // Trigger survey after completing activities
      window.addEventListener('activityCompleted', () => {
        this.showSatisfactionSurvey();
      });
    }
  }

  /**
   * Show satisfaction survey
   */
  showSatisfactionSurvey() {
    if (typeof document !== 'undefined') {
      const survey = document.createElement('div');
      survey.className = 'feedback-modal';
      survey.innerHTML = `
        <div class="feedback-modal-content">
          <button class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</button>
          <h2>How was your experience?</h2>
          <form class="feedback-form" onsubmit="window.feedbackService.submitSatisfactionSurvey(event)">
            <div>
              <label>How satisfied are you with the platform?</label>
              <div style="display: flex; gap: 10px; margin: 10px 0;">
                ${[1, 2, 3, 4, 5].map(rating => `
                  <label style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
                    <input type="radio" name="satisfaction" value="${rating}" required>
                    <span>${rating}</span>
                    <span style="font-size: 12px;">${rating === 1 ? 'Very Poor' : rating === 5 ? 'Excellent' : ''}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            
            <div>
              <label>What did you like most?</label>
              <textarea name="likes" placeholder="Tell us what you enjoyed..."></textarea>
            </div>
            
            <div>
              <label>What could be improved?</label>
              <textarea name="improvements" placeholder="Share your suggestions..."></textarea>
            </div>
            
            <div>
              <label>Would you recommend this platform to others?</label>
              <select name="recommendation" required>
                <option value="">Select</option>
                <option value="definitely">Definitely</option>
                <option value="probably">Probably</option>
                <option value="maybe">Maybe</option>
                <option value="probably_not">Probably Not</option>
                <option value="definitely_not">Definitely Not</option>
              </select>
            </div>
            
            <button type="submit">Submit Survey</button>
          </form>
        </div>
      `;
      
      document.body.appendChild(survey);
      survey.style.display = 'block';
    }
  }

  /**
   * Submit satisfaction survey
   */
  submitSatisfactionSurvey(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const survey = {
      id: this.generateFeedbackId(),
      type: this.feedbackTypes.SATISFACTION_SURVEY,
      satisfaction: parseInt(formData.get('satisfaction')),
      likes: formData.get('likes'),
      improvements: formData.get('improvements'),
      recommendation: formData.get('recommendation'),
      timestamp: new Date().toISOString(),
      url: window.location.href,
      channel: this.feedbackChannels.SURVEY,
      status: 'completed'
    };
    
    // Store survey
    this.storeFeedback(survey);
    
    // Send to backend
    this.sendFeedbackToBackend(survey);
    
    // Show confirmation
    this.showFeedbackConfirmation();
    
    // Close modal
    event.target.closest('.feedback-modal').remove();
  }

  /**
   * Setup feature request system
   */
  setupFeatureRequestSystem() {
    // Create feature request tracking
    this.featureRequests = [];
    
    // Setup feature request analytics
    this.setupFeatureRequestAnalytics();
  }

  /**
   * Submit feature request
   */
  submitFeatureRequest(featureData) {
    const featureRequest = {
      id: this.generateFeedbackId(),
      type: this.feedbackTypes.FEATURE_REQUEST,
      title: featureData.title,
      description: featureData.description,
      priority: featureData.priority || 'medium',
      category: featureData.category,
      timestamp: new Date().toISOString(),
      status: 'submitted',
      votes: 0,
      userEmail: featureData.email
    };
    
    this.featureRequests.push(featureRequest);
    this.feedbackData.analytics.featureRequests.push(featureRequest);
    
    // Send to backend
    this.sendFeedbackToBackend(featureRequest);
    
    return featureRequest;
  }

  /**
   * Setup bug reporting
   */
  setupBugReporting() {
    // Create bug report tracking
    this.bugReports = [];
    
    // Setup automatic bug detection
    this.setupAutomaticBugDetection();
  }

  /**
   * Submit bug report
   */
  submitBugReport(bugData) {
    const bugReport = {
      id: this.generateFeedbackId(),
      type: this.feedbackTypes.BUG_REPORT,
      title: bugData.title,
      description: bugData.description,
      steps: bugData.steps,
      expected: bugData.expected,
      actual: bugData.actual,
      severity: bugData.severity || 'medium',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      status: 'reported'
    };
    
    this.bugReports.push(bugReport);
    
    // Send to backend
    this.sendFeedbackToBackend(bugReport);
    
    return bugReport;
  }

  /**
   * Setup automatic bug detection
   */
  setupAutomaticBugDetection() {
    if (typeof window !== 'undefined') {
      // Monitor for JavaScript errors
      window.addEventListener('error', (event) => {
        const bugReport = {
          title: 'JavaScript Error Detected',
          description: event.message,
          steps: 'Automatic detection',
          expected: 'No errors',
          actual: event.message,
          severity: 'high',
          error: {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        };
        
        this.submitBugReport(bugReport);
      });
      
      // Monitor for unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        const bugReport = {
          title: 'Unhandled Promise Rejection',
          description: event.reason,
          steps: 'Automatic detection',
          expected: 'No unhandled rejections',
          actual: event.reason,
          severity: 'high',
          error: {
            reason: event.reason
          }
        };
        
        this.submitBugReport(bugReport);
      });
    }
  }

  /**
   * Setup analytics
   */
  setupAnalytics() {
    // Initialize analytics
    this.initializeAnalytics();
    
    // Setup real-time analytics
    this.setupRealTimeAnalytics();
  }

  /**
   * Initialize analytics
   */
  initializeAnalytics() {
    // Load existing feedback data
    if (typeof localStorage !== 'undefined') {
      const storedData = localStorage.getItem('userFeedback');
      if (storedData) {
        this.feedbackData = JSON.parse(storedData);
      }
    }
  }

  /**
   * Update analytics
   */
  updateAnalytics() {
    const submissions = this.feedbackData.submissions;
    
    if (submissions.length > 0) {
      // Calculate average rating
      const ratings = submissions.filter(s => s.rating).map(s => s.rating);
      this.feedbackData.analytics.averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0;
      
      // Update satisfaction trend
      this.feedbackData.analytics.satisfactionTrend = this.calculateSatisfactionTrend();
      
      // Update top issues
      this.feedbackData.analytics.topIssues = this.calculateTopIssues();
    }
  }

  /**
   * Calculate satisfaction trend
   */
  calculateSatisfactionTrend() {
    const submissions = this.feedbackData.submissions.filter(s => s.rating);
    const trend = [];
    
    // Group by week
    const weeklyData = {};
    submissions.forEach(submission => {
      const week = this.getWeekKey(new Date(submission.timestamp));
      if (!weeklyData[week]) {
        weeklyData[week] = [];
      }
      weeklyData[week].push(submission.rating);
    });
    
    // Calculate weekly averages
    Object.keys(weeklyData).forEach(week => {
      const average = weeklyData[week].reduce((sum, rating) => sum + rating, 0) / weeklyData[week].length;
      trend.push({
        week,
        averageRating: Math.round(average * 10) / 10,
        count: weeklyData[week].length
      });
    });
    
    return trend.sort((a, b) => a.week.localeCompare(b.week));
  }

  /**
   * Calculate top issues
   */
  calculateTopIssues() {
    const submissions = this.feedbackData.submissions;
    const issueCounts = {};
    
    submissions.forEach(submission => {
      if (submission.type === this.feedbackTypes.BUG_REPORT) {
        const key = submission.subject || submission.message.substring(0, 50);
        issueCounts[key] = (issueCounts[key] || 0) + 1;
      }
    });
    
    return Object.entries(issueCounts)
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Get week key
   */
  getWeekKey(date) {
    const year = date.getFullYear();
    const week = this.getWeekNumber(date);
    return `${year}-W${week}`;
  }

  /**
   * Get week number
   */
  getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  /**
   * Setup real-time analytics
   */
  setupRealTimeAnalytics() {
    // Update analytics every 5 minutes
    setInterval(() => {
      this.updateAnalytics();
    }, 300000);
  }

  /**
   * Generate feedback ID
   */
  generateFeedbackId() {
    return 'feedback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get feedback analytics
   */
  getAnalytics() {
    return this.feedbackData.analytics;
  }

  /**
   * Get all feedback
   */
  getAllFeedback() {
    return this.feedbackData.submissions;
  }

  /**
   * Get feedback by type
   */
  getFeedbackByType(type) {
    return this.feedbackData.submissions.filter(feedback => feedback.type === type);
  }

  /**
   * Export feedback data
   */
  exportFeedbackData() {
    return {
      timestamp: new Date().toISOString(),
      analytics: this.getAnalytics(),
      submissions: this.getAllFeedback(),
      featureRequests: this.featureRequests,
      bugReports: this.bugReports
    };
  }
}

// Export the service
export default new UserFeedbackService();
