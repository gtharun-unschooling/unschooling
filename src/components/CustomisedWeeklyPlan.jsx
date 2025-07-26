import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation } from 'react-router-dom';
import BackButton from './BackButton';

const CustomisedWeeklyPlan = () => {
  const [user] = useAuthState(auth);
  const [plans, setPlans] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Replace expandedDay logic with expandedDayRow: { weekKey, dayKey } (only one per week)
  const [expandedDayRow, setExpandedDayRow] = useState({}); // { [weekKey]: dayKey }
  const [childName, setChildName] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (user && location.state?.data) {
      setPlans({ [location.state.data.month || 'Current']: location.state.data });
      setSelectedMonth(location.state.data.month || 'Current');
      setChildName(location.state.childName || '');
      setLoading(false);
    } else if (user) {
      loadPlansFromFirebase();
    }
  }, [user, location.state]);

  const loadPlansFromFirebase = async () => {
    try {
      setLoading(true);
      const childName = location.state?.childName || 'Default';
      setChildName(childName);
      const childRef = doc(db, `users/${user.uid}/children`, childName);
      const childSnap = await getDoc(childRef);
      
      if (childSnap.exists()) {
        const childData = childSnap.data();
        setPlans(childData.plans || {});
        
        // Set default selected month
        const availableMonths = Object.keys(childData.plans || {});
        if (availableMonths.length > 0) {
          setSelectedMonth(availableMonths[0]);
        }
        }
      } catch (err) {
      console.error('Error loading plans:', err);
      setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  const planData = plans && selectedMonth ? plans[selectedMonth] : null;
  const months = plans ? Object.keys(plans) : [];
  const childMonths = location.state?.childMonths || months;

  // Helper function to get plan data with backward compatibility
  const getPlanData = (planData) => {
    if (!planData) return null;
    
    console.log('🔍 DEBUG - Raw plan data:', planData);
    console.log('🔍 DEBUG - Plan data keys:', Object.keys(planData));
    
    // Check if it's the new structure
    if (planData.weekly_learning_plan) {
      console.log('✅ Using new structure (weekly_learning_plan)');
      return {
        isNewStructure: true,
        weeklyPlan: planData.weekly_learning_plan
      };
    }
    
    // Check if it's already in weekly format
    if (planData.weekly_plan) {
      console.log('✅ Using existing weekly structure');
      return {
        isNewStructure: false,
        weeklyPlan: planData.weekly_plan
      };
    }
    
    // Handle flat structure where days are not grouped into weeks
    console.log('🔄 Converting flat structure to weekly format');
    const flatData = planData;
    const weeklyPlan = {};
    
    // Find all day keys
    const dayKeys = Object.keys(flatData).filter(key => 
      key.toLowerCase().includes('day') || 
      key.toLowerCase().includes('monday') ||
      key.toLowerCase().includes('tuesday') ||
      key.toLowerCase().includes('wednesday') ||
      key.toLowerCase().includes('thursday') ||
      key.toLowerCase().includes('friday')
    );
    
    console.log('🔍 DEBUG - Found day keys:', dayKeys);
    
    // Group days into weeks (assuming 5 days per week)
    const daysPerWeek = 5;
    
    for (let weekIndex = 0; weekIndex < 4; weekIndex++) {
      const weekKey = `week_${weekIndex + 1}`;
      weeklyPlan[weekKey] = {};
      
      for (let dayIndex = 0; dayIndex < daysPerWeek; dayIndex++) {
        const dayNumber = weekIndex * daysPerWeek + dayIndex + 1;
        const dayKey = `day ${dayNumber}`;
        const dayKeyAlt = `day${dayNumber}`;
        
        // Map to standard day names
        const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const standardDayKey = dayNames[dayIndex];
        
        // Check for various possible day key formats
        if (flatData[dayKey]) {
          console.log(`✅ Found data for ${dayKey} -> ${standardDayKey}`);
          weeklyPlan[weekKey][standardDayKey] = flatData[dayKey];
        } else if (flatData[dayKeyAlt]) {
          console.log(`✅ Found data for ${dayKeyAlt} -> ${standardDayKey}`);
          weeklyPlan[weekKey][standardDayKey] = flatData[dayKeyAlt];
        } else if (flatData[standardDayKey]) {
          console.log(`✅ Found data for ${standardDayKey}`);
          weeklyPlan[weekKey][standardDayKey] = flatData[standardDayKey];
        }
      }
    }
    
    console.log('🔍 DEBUG - Converted weekly plan:', weeklyPlan);
    
    return {
      isNewStructure: false,
      weeklyPlan: weeklyPlan
    };
  };

  const processedPlanData = getPlanData(planData);

  // Make sure getDayData is defined before any usage in the render
  const getDayData = (weekData, dayKey) => {
    if (!weekData || !weekData[dayKey]) return null;
    const dayData = weekData[dayKey];
    // Handle both old and new structures
    if (processedPlanData?.isNewStructure) {
      return {
        topic: dayData.topic_title || 'No Topic',
        subject: dayData.subject_area || 'No Subject',
        objective: dayData.learning_objective || 'No Objective',
        primaryActivity: dayData.primary_activity || 'No Activity',
        secondaryActivity: dayData.secondary_activity || null,
        duration: dayData.estimated_duration || '30 minutes',
        difficulty: dayData.difficulty_level || 'Beginner',
        materials: dayData.materials_needed || 'Basic materials'
      };
    } else {
      // Handle old structure with various field names
      return {
        topic: dayData.topic || dayData.Topic || dayData["Topic"] || 'No Topic',
        subject: dayData.niche || dayData.Niche || dayData["Niche"] || 'No Subject',
        objective: dayData.objective || dayData.Objective || dayData["Objective"] || 'No Objective',
        primaryActivity: dayData.activity_1 || dayData["Activity 1"] || dayData.activity || 'No Activity',
        secondaryActivity: dayData.activity_2 || dayData["Activity 2"] || null,
        duration: dayData.estimated_time || dayData["Estimated Time"] || dayData.duration || '30 minutes',
        difficulty: dayData.difficulty || dayData["Difficulty"] || 'Not specified',
        materials: dayData.materials || dayData["Materials"] || 'Not specified'
      };
    }
  };

  const WEEK_COLORS = [
    '#e3f2fd', // Week 1: Light Blue
    '#e8f5e9', // Week 2: Light Green
    '#fff3e0', // Week 3: Light Orange
    '#f3e5f5', // Week 4: Light Purple
  ];
  const WEEK_ACCENTS = [
    '#2196f3', // Blue
    '#43a047', // Green
    '#fb8c00', // Orange
    '#8e24aa', // Purple
  ];

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#6a4c93'
    },
    childName: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#6a4c93',
      marginBottom: '10px'
    },
    monthSelector: {
      marginBottom: '30px',
      textAlign: 'center'
    },
    select: {
      padding: '12px 20px',
      borderRadius: '8px',
      border: '2px solid #6a4c93',
      fontSize: '16px',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    weeksContainer: {
      display: 'grid',
      gap: '40px'
    },
    weekCard: {
      backgroundColor: '#f8f9fa',
      borderRadius: '16px',
      padding: '30px',
      border: '3px solid #6a4c93',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    weekHeader: {
      color: '#6a4c93',
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '20px',
      marginTop: '40px',
      textAlign: 'left',
      borderBottom: '3px solid #6a4c93',
      paddingBottom: '10px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      background: '#f3f0fa',
      borderRadius: '8px',
      paddingLeft: '10px',
      width: '100%'
    },
    daysContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    dayCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '2px solid #ddd',
      overflow: 'hidden',
      minHeight: '80px',
      display: 'flex',
      flexDirection: 'row',
      width: '100%'
    },
    dayHeader: {
      backgroundColor: '#6a4c93',
      color: 'white',
      padding: '20px 25px',
      cursor: 'pointer',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '18px',
      flex: '0 0 200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '200px'
    },
    dayName: {
      fontSize: '20px',
      marginBottom: '8px',
      fontWeight: 'bold'
    },
    dayTopic: {
      fontSize: '14px',
      opacity: 0.9,
      lineHeight: '1.3',
      maxWidth: '180px',
      wordWrap: 'break-word',
      textAlign: 'center'
    },
    expandIcon: {
      fontSize: '24px',
      marginTop: '8px'
    },
    dayContent: {
      padding: '20px',
      display: 'none',
      flex: '1',
      overflowY: 'auto'
    },
    dayContentExpanded: {
      padding: '20px',
      display: 'block',
      flex: '1',
      overflowY: 'auto'
    },
    field: {
      marginBottom: '15px'
    },
    label: {
      fontWeight: 'bold',
      color: '#6a4c93',
      marginBottom: '5px',
      display: 'block',
      fontSize: '14px'
    },
    value: {
      color: '#333',
      lineHeight: '1.4',
      fontSize: '13px',
      wordWrap: 'break-word'
    },
    activityBox: {
      backgroundColor: '#f0f8ff',
      padding: '15px',
      borderRadius: '6px',
      marginTop: '15px',
      border: '1px solid #4ECDC4'
    },
    activityTitle: {
      fontWeight: 'bold',
      color: '#264653',
      marginBottom: '8px',
      fontSize: '14px'
    },
    message: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
      fontSize: '18px'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#6a4c93',
      fontSize: '18px'
    },
    error: {
      textAlign: 'center',
      padding: '40px',
      color: '#ff6b6b',
      fontSize: '18px'
    }
  };

  // Update ModernSelect chevron to a modern SVG
  const ModernSelect = ({ value, onChange, options }) => (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      minWidth: 120,
      margin: '0 0 0 8px',
    }}>
      <select
        value={value}
        onChange={onChange}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          background: '#fff',
          border: '2px solid #6a4c93',
          borderRadius: 8,
          padding: '8px 36px 8px 14px',
          fontSize: 16,
          color: '#264653',
          fontWeight: 600,
          outline: 'none',
          boxShadow: '0 1px 4px #6a4c9340',
          cursor: 'pointer',
          transition: 'border 0.2s',
        }}
      >
        {options.map(opt => (
          <option key={opt} value={opt} style={{ fontWeight: 500 }}>{opt.replace(/(\D+)(\d+)/, "$1 $2")}</option>
        ))}
      </select>
      {/* Modern chevron icon */}
      <span style={{
        position: 'absolute',
        right: 14,
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        width: 18,
        height: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a4c93" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
      </span>
    </div>
  );

  if (!user) {
    return <div style={styles.error}>Please log in to view your weekly plan.</div>;
  }

  if (loading) {
    return <div style={styles.loading}>Loading your weekly plan...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <BackButton />
      
      {/* Hero Section */}
      <div style={{
        width: '100%',
        padding: '48px 0 32px 0',
        background: 'linear-gradient(90deg, #6a4c93 0%, #4ECDC4 100%)',
        borderRadius: '0 0 32px 32px',
        boxShadow: '0 8px 32px #6a4c9340',
        textAlign: 'center',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: 2,
          margin: 0,
          textShadow: '0 2px 12px #0002',
          lineHeight: 1.1,
        }}>
          📅 Customised Weekly Plan
        </h1>
        {/* Name and Month Row - small pill buttons, side by side, centered */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 18,
          marginTop: 28,
          flexWrap: 'wrap',
        }}>
          {/* Name Pill */}
          <div style={{
            background: '#fff',
            color: '#6a4c93',
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 999,
            padding: '7px 22px',
            boxShadow: '0 1px 4px #6a4c9320',
            letterSpacing: 0.5,
            minWidth: 80,
            textAlign: 'center',
            border: '1.5px solid #6a4c93',
            display: 'inline-block',
          }}>
            👶 {childName}
          </div>
          {/* Month Pill with Modern Dropdown */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f3f0fa',
            borderRadius: 999,
            padding: '7px 18px',
            boxShadow: '0 1px 4px #4ECDC420',
            minWidth: 80,
            border: '1.5px solid #4ECDC4',
          }}>
            <ModernSelect
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
              options={childMonths}
            />
          </div>
        </div>
      </div>

      {!processedPlanData ? (
        <div style={styles.message}>No plan data for this month.</div>
      ) : (
        <div style={styles.weeksContainer}>
          {Object.entries(processedPlanData.weeklyPlan).map(([weekKey, weekData], weekIdx) => (
            <div key={weekKey} style={{
              ...styles.weekCard,
              background: WEEK_COLORS[weekIdx % WEEK_COLORS.length],
              borderColor: WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length],
              boxShadow: `0 4px 24px ${WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length]}22`,
              marginBottom: 40,
            }}>
              <h2 style={{
                ...styles.weekHeader,
                color: WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length],
                background: 'none',
                borderColor: WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length],
              }}>
                {weekKey.replace('_', ' ').toUpperCase()}
              </h2>
              <div style={{ ...styles.daysContainer, gap: 0 }}>
                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((dayKey, dayIdx) => {
                  const dayData = getDayData(weekData, dayKey);
                  const accent = WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length];
                  return (
                    <React.Fragment key={dayKey}>
                      <div
                        key={dayKey}
                        style={{
                          ...styles.dayCard,
                          background: '#fff',
                          borderLeft: `6px solid ${accent}`,
                          margin: '0 0 8px 0',
                          boxShadow: expandedDayRow[weekKey] === dayKey ? `0 2px 8px ${accent}33` : '0 1px 4px #0001',
                          transition: 'box-shadow 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          minHeight: 44,
                          height: 44,
                          position: 'relative',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          padding: '0 8px',
                          borderRadius: 7,
                        }}
                        onClick={() => {
                          setExpandedDayRow(row => ({ ...row, [weekKey]: row[weekKey] === dayKey ? null : dayKey }));
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f6f9fc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        {/* Day name */}
                        <div style={{
                          minWidth: 80,
                          fontWeight: 700,
                          fontSize: 15,
                          color: accent,
                          textAlign: 'left',
                          padding: '0 10px',
                          letterSpacing: 1,
                          flexShrink: 0,
                        }}>{dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}</div>
                        {/* Topic/title and Smart Helper */}
                        <div style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#222',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}>
                          {dayData ? (
                            <>
                              <span style={{ fontWeight: 600 }}>{dayData.topic}</span>
                              <span style={{ fontSize: 16, marginLeft: 4 }} title="Smart Helper">🤖</span>
                            </>
                          ) : (
                            <span style={{ color: '#bbb', fontStyle: 'italic' }}>No activities planned</span>
                          )}
                        </div>
                        {/* Expand/View Button */}
                        <button
                          style={{
                            background: expandedDayRow[weekKey] === dayKey ? accent : '#f3f0fa',
                            color: expandedDayRow[weekKey] === dayKey ? '#fff' : accent,
                            border: 'none',
                            borderRadius: '50%',
                            width: 26,
                            height: 26,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 15,
                            marginRight: 6,
                            marginLeft: 6,
                            boxShadow: expandedDayRow[weekKey] === dayKey ? `0 1px 4px ${accent}44` : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            outline: 'none',
                          }}
                          tabIndex={0}
                          aria-label={expandedDayRow[weekKey] === dayKey ? `Hide details for ${dayKey}` : `Show details for ${dayKey}`}
                          onClick={e => {
                            e.stopPropagation();
                            setExpandedDayRow(row => ({ ...row, [weekKey]: row[weekKey] === dayKey ? null : dayKey }));
                          }}
                        >
                          {expandedDayRow[weekKey] === dayKey ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                          ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                          )}
                        </button>
                      </div>
                      {/* Expanded details inline below the day row, within the week card */}
                      {expandedDayRow[weekKey] === dayKey && dayData && (
                        <div style={{
                          width: 'calc(100% - 16px)',
                          margin: '0 8px 10px 8px',
                          background: '#f8f9fa',
                          borderRadius: 8,
                          boxShadow: `0 1px 4px ${accent}22`,
                          border: `1px solid ${accent}`,
                          padding: '14px 16px',
                          color: '#222',
                          fontSize: 14,
                          fontWeight: 500,
                          position: 'relative',
                          zIndex: 1,
                          animation: 'fadeIn 0.2s',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <div style={{ color: accent, fontWeight: 800, fontSize: 15 }}>{weekKey.replace('_', ' ').toUpperCase()} - {dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}</div>
                            <span style={{ fontSize: 15, marginLeft: 4 }} title="Smart Helper">🤖</span>
                          </div>
                          <div style={{ color: accent, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{dayData.topic}</div>
                          <div style={{ marginBottom: 6 }}><span style={{ color: '#6a4c93', fontWeight: 600 }}>📚 Subject:</span> <span style={{ color: '#222', marginLeft: 6 }}>{dayData.subject}</span></div>
                          <div style={{ marginBottom: 6 }}><span style={{ color: '#6a4c93', fontWeight: 600 }}>🎯 Learning Objective:</span> <span style={{ color: '#222', marginLeft: 6 }}>{dayData.objective}</span></div>
                          <div style={{ marginBottom: 6 }}><span style={{ color: '#6a4c93', fontWeight: 600 }}>⏱️ Duration:</span> <span style={{ color: '#222', marginLeft: 6 }}>{dayData.duration}</span></div>
                          <div style={{ marginBottom: 6 }}><span style={{ color: '#6a4c93', fontWeight: 600 }}>📊 Difficulty:</span> <span style={{ color: '#222', marginLeft: 6 }}>{dayData.difficulty}</span></div>
                          <div style={{ marginBottom: 6 }}><span style={{ color: '#6a4c93', fontWeight: 600 }}>📦 Materials:</span> <span style={{ color: '#222', marginLeft: 6 }}>{dayData.materials}</span></div>
                          <div style={{ background: '#f0f8ff', borderRadius: 6, padding: '8px 10px', marginBottom: 6, border: `1px solid ${accent}` }}>
                            <div style={{ color: '#264653', fontWeight: 700, marginBottom: 3, fontSize: 13 }}>🎯 Primary Activity</div>
                            <div style={{ color: '#222', fontSize: 13 }}>{dayData.primaryActivity}</div>
                          </div>
                          {dayData.secondaryActivity && (
                            <div style={{ background: '#f3e5f5', borderRadius: 6, padding: '8px 10px', border: `1px solid ${accent}` }}>
                              <div style={{ color: '#8e24aa', fontWeight: 700, marginBottom: 3, fontSize: 13 }}>🔄 Secondary Activity</div>
                              <div style={{ color: '#222', fontSize: 13 }}>{dayData.secondaryActivity}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomisedWeeklyPlan;
