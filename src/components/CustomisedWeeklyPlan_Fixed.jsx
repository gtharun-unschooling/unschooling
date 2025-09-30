import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config/config';

const CustomisedWeeklyPlan = () => {
  const [user, authLoading, authError] = useAuthState(auth);
  const [plans, setPlans] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [childName, setChildName] = useState('');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [availableChildren, setAvailableChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Load available children
  const loadAvailableChildren = async () => {
    try {
      const childrenRef = collection(db, `users/${user.uid}/children`);
      const childrenQuery = query(childrenRef, orderBy('createdAt', 'asc'));
      const childrenSnapshot = await getDocs(childrenQuery);
      
      const children = [];
      childrenSnapshot.forEach((doc) => {
        const data = doc.data();
        children.push({
          id: doc.id,
          name: data.name || data.child_name || 'Child',
          age: data.age || data.child_age || 5,
          interests: data.interests || []
        });
      });
      
      setAvailableChildren(children);
      if (children.length > 0 && !selectedChild) {
        setSelectedChild(children[0].id);
        setChildName(children[0].name);
        loadPlansForChild(children[0].id);
      }
    } catch (error) {
      console.error('❌ Error loading children:', error);
      setError('Failed to load child profiles');
    }
  };

  // Load plans for specific child
  const loadPlansForChild = async (childId) => {
    try {
      setLoading(true);
      const childRef = doc(db, `users/${user.uid}/children`, childId);
      const childSnap = await getDoc(childRef);
      
      if (childSnap.exists()) {
        const childData = childSnap.data();
        const existingPlans = childData.plans || {};
        setPlans(existingPlans);
        
        if (Object.keys(existingPlans).length === 0) {
          // No plans exist, generate new one
          generateNewPlan(childData);
        } else {
          // Set the first available month as selected
          const months = Object.keys(existingPlans);
          if (months.length > 0) {
            setSelectedMonth(months[0]);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error loading plans:', error);
      setError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  // Generate new plan
  const generateNewPlan = async (childData) => {
    try {
      setGeneratingPlan(true);
      setError('');
      
      const profileData = {
        child_name: childData.name || childData.child_name || 'Child',
        child_age: childData.age || childData.child_age || 5,
        interests: childData.interests || [],
        preferred_learning_style: 'mixed',
        plan_type: 'hybrid'
      };
      
      const response = await fetch('https://llm-agents-44gsrw22gq-uc.a.run.app/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'unschooling-api-key-2024',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ profile: profileData }),
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          const currentMonth = new Date().toLocaleString('default', { month: 'long' }) + ' ' + new Date().getFullYear();
          const newPlans = {
            ...plans,
            [currentMonth]: result.data
          };
          
          // Save to Firebase
          const childRef = doc(db, `users/${user.uid}/children`, selectedChild);
          await updateDoc(childRef, {
            plans: newPlans
          });
          
          setPlans(newPlans);
          setSelectedMonth(currentMonth);
        } else {
          setError('Failed to generate plan');
        }
      } else {
        setError('Failed to connect to plan generation service');
      }
    } catch (error) {
      console.error('❌ Error generating plan:', error);
      setError('Failed to generate plan: ' + error.message);
    } finally {
      setGeneratingPlan(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAvailableChildren();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <div>Error: {authError.message}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Please log in to view your learning plans.</div>
        <button 
          onClick={() => navigate('/login')}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate('/dashboard')}
        style={{
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>
          🎯 Personalized Learning Journey
        </h1>
        <p style={{ margin: '0', fontSize: '1.2rem', opacity: 0.9 }}>
          Tailored weekly activities designed just for your child
        </p>
      </div>

      {/* Child Profile Selection */}
      {availableChildren.length > 0 && (
        <div style={{
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>👶 Select Child Profile</h3>
          <select
            value={selectedChild}
            onChange={(e) => {
              const childId = e.target.value;
              const child = availableChildren.find(c => c.id === childId);
              if (child) {
                setSelectedChild(childId);
                setChildName(child.name);
                loadPlansForChild(childId);
              }
            }}
            style={{
              padding: '12px',
              borderRadius: '6px',
              border: '2px solid #ddd',
              fontSize: '16px',
              width: '100%',
              maxWidth: '400px',
              background: 'white'
            }}
          >
            {availableChildren.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} (Age {child.age})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading plans...</div>
        </div>
      )}

      {/* Generating Plan */}
      {generatingPlan && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>🎯 Generating personalized plan...</div>
          <div style={{ fontSize: '14px', color: '#666' }}>This may take a few moments</div>
        </div>
      )}

      {/* No Children */}
      {availableChildren.length === 0 && !loading && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>No Child Profiles Found</h3>
          <p style={{ margin: '0 0 15px 0', color: '#856404' }}>
            Please create a child profile first to generate learning plans.
          </p>
          <button 
            onClick={() => navigate('/profile')}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Child Profile
          </button>
        </div>
      )}

      {/* Plans Display */}
      {Object.keys(plans).length > 0 && (
        <div>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            📅 Learning Plans for {childName}
          </h3>
          
          {/* Month Selection */}
          {Object.keys(plans).length > 1 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Select Month:
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                  minWidth: '200px'
                }}
              >
                {Object.keys(plans).map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          )}

          {/* Plan Content */}
          {selectedMonth && plans[selectedMonth] && (
            <div style={{
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
                {selectedMonth} Learning Plan
              </h4>
              
              {/* Display plan content here */}
              <div style={{ color: '#666' }}>
                Plan content will be displayed here...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomisedWeeklyPlan;
