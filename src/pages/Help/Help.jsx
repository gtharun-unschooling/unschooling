import React, { useState } from 'react';
import './Help.css';

const Help = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      id: 1,
      question: "How do I create a learning plan for my child?",
      answer: "To create a learning plan, go to the Child Profile page and fill out your child's information including age, interests, and learning style. The system will automatically generate a personalized 4-week learning plan based on your inputs."
    },
    {
      id: 2,
      question: "Can I customize the learning topics?",
      answer: "Yes! You can browse through different niches and topics in the Explore section. You can also modify your child's interests in their profile to get different topic recommendations."
    },
    {
      id: 3,
      question: "How do I track my child's progress?",
      answer: "Use the Progress Tracker to monitor your child's learning journey. It shows completed topics, time spent learning, and achievements earned. You can also view weekly reports in your dashboard."
    },
    {
      id: 4,
      question: "What age groups is this platform designed for?",
      answer: "Our platform is designed for children ages 3-12. We offer age-appropriate content and activities that adapt to your child's developmental stage and learning level."
    },
    {
      id: 5,
      question: "How often should my child use the platform?",
      answer: "We recommend 20-30 minutes of learning per day, 3-5 times per week. However, you can adjust this based on your child's attention span and schedule. The platform tracks daily goals and streaks to keep motivation high."
    },
    {
      id: 6,
      question: "Can I use this platform offline?",
      answer: "Currently, the platform requires an internet connection for most features. However, you can download weekly plans and activities to use offline. We're working on expanding offline capabilities."
    }
  ];

  const handleFAQToggle = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>Help & Support</h1>
        <p>Find answers to common questions and get the support you need</p>
      </div>

      <div className="help-container">
        {/* Quick Help Section */}
        <div className="quick-help">
          <h2>Quick Help</h2>
          <div className="help-cards">
            <div className="help-card">
              <div className="help-icon">📚</div>
              <h3>Getting Started</h3>
              <p>Learn how to set up your child's profile and create their first learning plan</p>
              <a href="#getting-started" className="help-link">Learn More</a>
            </div>
            
            <div className="help-card">
              <div className="help-icon">🎯</div>
              <h3>Learning Plans</h3>
              <p>Understand how learning plans work and how to customize them</p>
              <a href="#learning-plans" className="help-link">Learn More</a>
            </div>
            
            <div className="help-card">
              <div className="help-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Learn how to monitor your child's learning progress and achievements</p>
              <a href="#progress-tracking" className="help-link">Learn More</a>
            </div>
            
            <div className="help-card">
              <div className="help-icon">⚙️</div>
              <h3>Account Settings</h3>
              <p>Manage your account preferences and privacy settings</p>
              <a href="#account-settings" className="help-link">Learn More</a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map(faq => (
              <div key={faq.id} className="faq-item">
                <button
                  className={`faq-question ${activeFAQ === faq.id ? 'active' : ''}`}
                  onClick={() => handleFAQToggle(faq.id)}
                >
                  {faq.question}
                  <span className="faq-icon">
                    {activeFAQ === faq.id ? '−' : '+'}
                  </span>
                </button>
                {activeFAQ === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="contact-support">
          <h2>Still Need Help?</h2>
          <p>Can't find what you're looking for? Contact our support team and we'll get back to you within 24 hours.</p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <div className="contact-icon">📧</div>
              <h4>Email Support</h4>
              <p>support@unschooling.com</p>
              <small>Response within 24 hours</small>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon">💬</div>
              <h4>Live Chat</h4>
              <p>Available Mon-Fri, 9AM-6PM EST</p>
              <button className="chat-btn">Start Chat</button>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon">📱</div>
              <h4>Phone Support</h4>
              <p>+1 (555) 123-4567</p>
              <small>Mon-Fri, 9AM-6PM EST</small>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h3>Send us a Message</h3>
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Resources */}
        <div className="resources-section">
          <h2>Additional Resources</h2>
          <div className="resources-grid">
            <div className="resource-item">
              <h4>📖 User Guide</h4>
              <p>Complete platform walkthrough and tutorials</p>
              <a href="#" className="resource-link">Download PDF</a>
            </div>
            
            <div className="resource-item">
              <h4>🎥 Video Tutorials</h4>
              <p>Step-by-step video guides for common tasks</p>
              <a href="#" className="resource-link">Watch Videos</a>
            </div>
            
            <div className="resource-item">
              <h4>📋 Best Practices</h4>
              <p>Tips for maximizing your child's learning experience</p>
              <a href="#" className="resource-link">Read More</a>
            </div>
            
            <div className="resource-item">
              <h4>🆘 Troubleshooting</h4>
              <p>Common issues and their solutions</p>
              <a href="#" className="resource-link">View Guide</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
