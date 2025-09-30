import React, { useState } from 'react';
import MinimalBackButton from '../components/ui/MinimalBackButton';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    position: 'relative'
  };

  const contentContainerStyle = {
    padding: '2rem',
    paddingTop: '5rem' // Add top padding to account for back button
  };

  const contentStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    alignItems: 'start'
  };

  const leftColumnStyle = {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0'
  };

  const rightColumnStyle = {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 1rem 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#64748b',
    margin: '0'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151'
  };

  const inputStyle = {
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: isSubmitting ? 0.7 : 1
  };

  const contactInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  };

  const iconStyle = {
    fontSize: '1.5rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    color: 'white'
  };

  const contactTextStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  };

  const contactTitleStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0'
  };

  const contactValueStyle = {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: '0'
  };

  const successStyle = {
    background: '#dcfce7',
    color: '#166534',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
    textAlign: 'center',
    marginTop: '1rem'
  };

  return (
    <div style={containerStyle}>
      <MinimalBackButton 
        heroColors={{
          backgroundColor: '#f8fafc',
          primaryColor: '#667eea',
          nicheColor: '#764ba2'
        }}
      />
      
      <div style={contentContainerStyle}>
        <div style={contentStyle}>
        {/* Contact Form */}
        <div style={leftColumnStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>Get in Touch</h1>
            <p style={subtitleStyle}>
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <form style={formStyle} onSubmit={handleSubmit}>
            <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
                required
                placeholder="Your full name"
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                style={inputStyle}
                required
                placeholder="What's this about?"
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle} htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                style={textareaStyle}
                required
                placeholder="Tell us more about your question or feedback..."
              />
            </div>

            <button
              type="submit"
              style={buttonStyle}
              disabled={isSubmitting}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitStatus === 'success' && (
              <div style={successStyle}>
                ✅ Thank you! Your message has been sent successfully.
              </div>
            )}
          </form>
        </div>

        {/* Contact Information */}
        <div style={rightColumnStyle}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem' }}>
            Other Ways to Reach Us
          </h2>

          <div style={contactInfoStyle}>
            <div style={contactItemStyle}>
              <div style={iconStyle}>📧</div>
              <div style={contactTextStyle}>
                <h3 style={contactTitleStyle}>Email</h3>
                <p style={contactValueStyle}>hello@unschooling.com</p>
              </div>
            </div>

            <div style={contactItemStyle}>
              <div style={iconStyle}>📞</div>
              <div style={contactTextStyle}>
                <h3 style={contactTitleStyle}>Phone</h3>
                <p style={contactValueStyle}>+1 (555) 123-4567</p>
              </div>
            </div>

            <div style={contactItemStyle}>
              <div style={iconStyle}>📍</div>
              <div style={contactTextStyle}>
                <h3 style={contactTitleStyle}>Address</h3>
                <p style={contactValueStyle}>
                  123 Learning Street<br />
                  Education City, EC 12345
                </p>
              </div>
            </div>

            <div style={contactItemStyle}>
              <div style={iconStyle}>⏰</div>
              <div style={contactTextStyle}>
                <h3 style={contactTitleStyle}>Business Hours</h3>
                <p style={contactValueStyle}>
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <div style={contactItemStyle}>
              <div style={iconStyle}>💬</div>
              <div style={contactTextStyle}>
                <h3 style={contactTitleStyle}>Live Chat</h3>
                <p style={contactValueStyle}>Available 24/7 for urgent questions</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0c4a6e', marginBottom: '0.5rem' }}>
              🚀 Quick Response Guarantee
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#0369a1', margin: '0' }}>
              We typically respond to all inquiries within 24 hours. For urgent matters, please call us directly.
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
