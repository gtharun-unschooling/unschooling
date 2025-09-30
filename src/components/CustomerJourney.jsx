import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaUserPlus, 
  FaChild, 
  FaCalendarAlt, 
  FaBox, 
  FaLock, 
  FaUnlock,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaHome,
  FaRecycle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight,
  FaEdit,
  FaTrash,
  FaInfoCircle
} from 'react-icons/fa';
import './CustomerJourney.css';

const CustomerJourney = () => {
  const [currentStep, setCurrentStep] = useState('signup');
  const [customerData, setCustomerData] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('customerJourneyData');
    return saved ? JSON.parse(saved) : {
      name: '',
      email: '',
      phone: '',
      address: '',
      childProfiles: []
    };
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [orderLocked, setOrderLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(6 * 60 * 60); // 6 hours in seconds
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customizationOptions, setCustomizationOptions] = useState({
    extraArtSupplies: true,
    scienceMaterials: true,
    digitalResources: false,
    parentGuide: false
  });

  const plans = [
    {
      id: 'weekly-basic',
      name: 'Weekly Basic Plan',
      price: 2999,
      duration: '4 weeks',
      description: 'Basic learning materials for 4 weeks',
      features: ['4 weekly kits', 'Basic materials', 'Standard delivery'],
      popular: false
    },
    {
      id: 'weekly-premium',
      name: 'Weekly Premium Plan',
      price: 4999,
      duration: '4 weeks',
      description: 'Premium learning materials with extras',
      features: ['4 weekly kits', 'Premium materials', 'Priority delivery', 'Extra activities'],
      popular: true
    },
    {
      id: 'monthly-basic',
      name: 'Monthly Basic Plan',
      price: 10999,
      duration: '4 weeks',
      description: 'Monthly subscription with savings',
      features: ['4 weekly kits', 'Basic materials', 'Free delivery', '10% savings'],
      popular: false
    },
    {
      id: 'monthly-premium',
      name: 'Monthly Premium Plan',
      price: 17999,
      duration: '4 weeks',
      description: 'Premium monthly subscription',
      features: ['4 weekly kits', 'Premium materials', 'Free delivery', '15% savings', 'Bonus materials'],
      popular: false
    }
  ];

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('customerJourneyData', JSON.stringify(customerData));
  }, [customerData]);

  // Timer countdown
  useEffect(() => {
    if (lockTimer > 0 && !orderLocked) {
      const interval = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            // Auto-lock order when timer expires
            lockOrder();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockTimer, orderLocked]);

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const validateStep = useCallback((step) => {
    const newErrors = {};

    switch (step) {
      case 'signup':
        if (!customerData.name.trim()) newErrors.name = 'Name is required';
        if (!customerData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(customerData.email)) newErrors.email = 'Invalid email format';
        if (!customerData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!customerData.address.trim()) newErrors.address = 'Address is required';
        break;
      
      case 'child-profiles':
        if (customerData.childProfiles.length === 0) {
          newErrors.childProfiles = 'At least one child profile is required';
        } else {
          customerData.childProfiles.forEach((child, index) => {
            if (!child.name.trim()) newErrors[`child${index}Name`] = 'Child name is required';
            if (!child.age || child.age < 3 || child.age > 12) {
              newErrors[`child${index}Age`] = 'Age must be between 3 and 12';
            }
          });
        }
        break;
      
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [customerData]);

  const goToStep = useCallback((step) => {
    if (validateStep(currentStep)) {
      setCurrentStep(step);
      setErrors({});
    }
  }, [currentStep, validateStep]);

  const goToPreviousStep = useCallback(() => {
    const stepOrder = ['signup', 'child-profiles', 'plan-selection', 'plan-customization', 'order-confirmed'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
      setErrors({});
    }
  }, [currentStep]);

  const addChildProfile = () => {
    const newChild = {
      id: Date.now(),
      name: '',
      age: '',
      interests: [],
      learningLevel: 'beginner'
    };
    setCustomerData(prev => ({
      ...prev,
      childProfiles: [...prev.childProfiles, newChild]
    }));
  };

  const updateChildProfile = (id, field, value) => {
    setCustomerData(prev => ({
      ...prev,
      childProfiles: prev.childProfiles.map(child => 
        child.id === id ? { ...child, [field]: value } : child
      )
    }));
  };

  const removeChildProfile = (id) => {
    if (customerData.childProfiles.length > 1) {
      setCustomerData(prev => ({
        ...prev,
        childProfiles: prev.childProfiles.filter(child => child.id !== id)
      }));
    }
  };

  const selectPlan = (plan) => {
    setSelectedPlan(plan);
    setCurrentStep('plan-customization');
  };

  const lockOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setOrderLocked(true);
      setCurrentStep('order-confirmed');
      
      // Clear timer
      setLockTimer(0);
      
      // Save order to localStorage
      const orderData = {
        id: `ORD_${Date.now()}`,
        customer: customerData,
        plan: selectedPlan,
        customization: customizationOptions,
        lockedAt: new Date().toISOString(),
        status: 'locked'
      };
      localStorage.setItem('customerOrder', JSON.stringify(orderData));
      
    } catch (error) {
      console.error('Error locking order:', error);
      alert('Failed to lock order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCustomization = (option, value) => {
    setCustomizationOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const renderSignup = () => (
    <div className="journey-step">
      <h2>👤 Customer Signup</h2>
      <p className="step-description">
        Please provide your information to get started with personalized learning kits
      </p>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input 
            id="name"
            type="text" 
            value={customerData.name}
            onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your full name"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input 
            id="email"
            type="email" 
            value={customerData.email}
            onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email address"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input 
            id="phone"
            type="tel" 
            value={customerData.phone}
            onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Enter your phone number"
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Delivery Address *</label>
          <textarea 
            id="address"
            value={customerData.address}
            onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Enter your complete delivery address"
            rows="3"
            className={errors.address ? 'error' : ''}
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>
        
        <div className="form-actions">
          <button 
            className="btn-primary"
            onClick={() => goToStep('child-profiles')}
            disabled={!customerData.name || !customerData.email || !customerData.phone || !customerData.address}
          >
            Next: Add Child Profiles <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );

  const renderChildProfiles = () => (
    <div className="journey-step">
      <h2>👶 Child Profile Creation</h2>
      <p className="step-description">
        Create profiles for each child to personalize their learning experience
      </p>
      
      {errors.childProfiles && (
        <div className="error-banner">
          <FaExclamationTriangle />
          <span>{errors.childProfiles}</span>
        </div>
      )}
      
      {customerData.childProfiles.map((child, index) => (
        <div key={child.id} className="child-profile-card">
          <div className="card-header">
            <h3>Child {index + 1}</h3>
            {customerData.childProfiles.length > 1 && (
              <button 
                className="btn-icon btn-danger"
                onClick={() => removeChildProfile(child.id)}
                title="Remove child profile"
              >
                <FaTrash />
              </button>
            )}
          </div>
          
          <div className="child-form">
            <div className="form-group">
              <label htmlFor={`child${index}Name`}>Child's Name *</label>
              <input 
                id={`child${index}Name`}
                type="text" 
                value={child.name}
                onChange={(e) => updateChildProfile(child.id, 'name', e.target.value)}
                placeholder="Enter child's name"
                className={errors[`child${index}Name`] ? 'error' : ''}
              />
              {errors[`child${index}Name`] && (
                <span className="error-message">{errors[`child${index}Name`]}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor={`child${index}Age`}>Age *</label>
              <input 
                id={`child${index}Age`}
                type="number" 
                value={child.age}
                onChange={(e) => updateChildProfile(child.id, 'age', e.target.value)}
                placeholder="Age in years"
                min="3"
                max="12"
                className={errors[`child${index}Age`] ? 'error' : ''}
              />
              {errors[`child${index}Age`] && (
                <span className="error-message">{errors[`child${index}Age`]}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor={`child${index}Level`}>Learning Level</label>
              <select 
                id={`child${index}Level`}
                value={child.learningLevel}
                onChange={(e) => updateChildProfile(child.id, 'learningLevel', e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      
      <div className="form-actions">
        <button className="btn-secondary" onClick={addChildProfile}>
          + Add Another Child
        </button>
        
        <div className="action-buttons">
          <button className="btn-secondary" onClick={goToPreviousStep}>
            <FaArrowLeft /> Back
          </button>
          
          <button 
            className="btn-primary"
            onClick={() => goToStep('plan-selection')}
            disabled={customerData.childProfiles.length === 0 || customerData.childProfiles.some(child => !child.name || !child.age)}
          >
            Next: Choose Plan <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlanSelection = () => (
    <div className="journey-step">
      <h2>📋 Plan Selection</h2>
      <p className="step-description">
        Choose the perfect learning plan for your children
      </p>
      
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h3>{plan.name}</h3>
            <div className="plan-price">₹{plan.price.toLocaleString()}</div>
            <div className="plan-duration">{plan.duration}</div>
            <p className="plan-description">{plan.description}</p>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <FaCheckCircle className="feature-icon" />
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              className="btn-primary"
              onClick={() => selectPlan(plan)}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
      
      <div className="form-actions">
        <button className="btn-secondary" onClick={goToPreviousStep}>
          <FaArrowLeft /> Back
        </button>
      </div>
    </div>
  );

  const renderPlanCustomization = () => (
    <div className="journey-step">
      <h2>⚙️ Plan Customization</h2>
      
      <div className="selected-plan-info">
        <h3>Selected Plan: {selectedPlan.name}</h3>
        <div className="plan-summary">
          <div className="summary-item">
            <span className="label">Price:</span>
            <span className="value">₹{selectedPlan.price.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="label">Duration:</span>
            <span className="value">{selectedPlan.duration}</span>
          </div>
          <div className="summary-item">
            <span className="label">Children:</span>
            <span className="value">{customerData.childProfiles.length}</span>
          </div>
        </div>
      </div>
      
      <div className="customization-options">
        <h3>Customization Options</h3>
        <p className="customization-description">
          Personalize your kit with additional materials and resources
        </p>
        
        <div className="customization-grid">
          <div className="customization-item">
            <label className="customization-label">
              <input 
                type="checkbox" 
                checked={customizationOptions.extraArtSupplies}
                onChange={(e) => updateCustomization('extraArtSupplies', e.target.checked)}
              />
              <span className="checkmark"></span>
              <div className="customization-content">
                <strong>Extra Art Supplies</strong>
                <small>Additional paints, brushes, and craft materials</small>
              </div>
            </label>
          </div>
          
          <div className="customization-item">
            <label className="customization-label">
              <input 
                type="checkbox" 
                checked={customizationOptions.scienceMaterials}
                onChange={(e) => updateCustomization('scienceMaterials', e.target.checked)}
              />
              <span className="checkmark"></span>
              <div className="customization-content">
                <strong>Science Experiment Materials</strong>
                <small>Lab equipment and experiment supplies</small>
              </div>
            </label>
          </div>
          
          <div className="customization-item">
            <label className="customization-label">
              <input 
                type="checkbox" 
                checked={customizationOptions.digitalResources}
                onChange={(e) => updateCustomization('digitalResources', e.target.checked)}
              />
              <span className="checkmark"></span>
              <div className="customization-content">
                <strong>Digital Learning Resources</strong>
                <small>Online access to educational content</small>
              </div>
            </label>
          </div>
          
          <div className="customization-item">
            <label className="customization-label">
              <input 
                type="checkbox" 
                checked={customizationOptions.parentGuide}
                onChange={(e) => updateCustomization('parentGuide', e.target.checked)}
              />
              <span className="checkmark"></span>
              <div className="customization-content">
                <strong>Parent Guide Materials</strong>
                <small>Instructions and tips for parents</small>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="lock-timer">
        <h3>⏰ Order Lock Timer</h3>
        <div className="timer-display">
          <FaClock /> {formatTime(lockTimer)}
        </div>
        <p>You have {formatTime(lockTimer)} to make changes before the order is locked</p>
        
        {lockTimer < 3600 && (
          <div className="timer-warning">
            <FaExclamationTriangle />
            <span>Less than 1 hour remaining!</span>
          </div>
        )}
      </div>
      
      <div className="form-actions">
        <div className="action-buttons">
          <button className="btn-secondary" onClick={goToPreviousStep}>
            <FaArrowLeft /> Change Plan
          </button>
          
          <button 
            className="btn-primary"
            onClick={lockOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Locking Order...
              </>
            ) : (
              <>
                <FaLock /> Lock Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderOrderConfirmed = () => (
    <div className="journey-step">
      <div className="order-confirmed">
        <FaCheckCircle className="success-icon" />
        <h2>🎉 Order Confirmed!</h2>
        <p>Your order has been locked and is being processed</p>
      </div>
      
      <div className="order-details">
        <h3>Order Details</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Customer:</span>
            <span className="value">{customerData.name}</span>
          </div>
          <div className="detail-item">
            <span className="label">Plan:</span>
            <span className="value">{selectedPlan.name}</span>
          </div>
          <div className="detail-item">
            <span className="label">Children:</span>
            <span className="value">{customerData.childProfiles.length}</span>
          </div>
          <div className="detail-item">
            <span className="label">Delivery:</span>
            <span className="value">3-5 business days</span>
          </div>
          <div className="detail-item">
            <span className="label">Total:</span>
            <span className="value">₹{selectedPlan.price.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="next-steps">
        <h3>What Happens Next?</h3>
        <div className="steps-grid">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong>Order Processing</strong>
              <p>Our team will prepare your customized learning kit</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong>Kit Preparation</strong>
              <p>Materials will be gathered and packed according to your plan</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong>Shipping</strong>
              <p>Your kit will be shipped within 3-5 business days</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong>Delivery</strong>
              <p>You'll receive tracking information and delivery updates</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <button className="btn-secondary" onClick={() => window.location.reload()}>
          Start New Order
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 'signup':
        return renderSignup();
      case 'child-profiles':
        return renderChildProfiles();
      case 'plan-selection':
        return renderPlanSelection();
      case 'plan-customization':
        return renderPlanCustomization();
      case 'order-confirmed':
        return renderOrderConfirmed();
      default:
        return renderSignup();
    }
  };

  return (
    <div className="customer-journey">
      <div className="journey-header">
        <h1>🚀 Customer Journey</h1>
        <p>Complete customer onboarding and order management system</p>
      </div>
      
      <div className="journey-progress">
        <div className={`progress-step ${currentStep === 'signup' ? 'active' : ''}`}>
          <FaUserPlus />
          <span>Signup</span>
        </div>
        <div className={`progress-step ${currentStep === 'child-profiles' ? 'active' : ''}`}>
          <FaChild />
          <span>Child Profiles</span>
        </div>
        <div className={`progress-step ${currentStep === 'plan-selection' ? 'active' : ''}`}>
          <FaCalendarAlt />
          <span>Choose Plan</span>
        </div>
        <div className={`progress-step ${currentStep === 'plan-customization' ? 'active' : ''}`}>
          <FaBox />
          <span>Customize</span>
        </div>
        <div className={`progress-step ${currentStep === 'order-confirmed' ? 'active' : ''}`}>
          <FaCheckCircle />
          <span>Confirmed</span>
        </div>
      </div>
      
      <div className="journey-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default CustomerJourney;
