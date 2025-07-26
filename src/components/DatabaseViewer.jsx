import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const DatabaseViewer = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadDatabaseData();
    }
  }, [user]);

  const loadDatabaseData = async () => {
    try {
      setLoading(true);
      
      // Get user document
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userDoc = userSnap.exists() ? userSnap.data() : null;
      setUserData(userDoc);

      // Get children collection
      const childrenRef = collection(db, `users/${user.uid}/children`);
      const childrenSnap = await getDocs(childrenRef);
      const children = [];
      
      childrenSnap.forEach((childDoc) => {
        children.push({
          id: childDoc.id,
          data: childDoc.data()
        });
      });
      
      setChildrenData(children);
    } catch (err) {
      console.error('Error loading database data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMonthsColumnToExistingProfiles = async () => {
    try {
      setLoading(true);
      console.log('🔄 Adding months column to existing profiles...');
      
      for (const child of childrenData) {
        const childRef = doc(db, `users/${user.uid}/children`, child.id);
        
        // Check if months column already exists
        if (!child.data.months) {
          console.log(`📝 Adding months column to child: ${child.id}`);
          
          // Extract months from existing plans
          const existingPlans = child.data.plans || {};
          const monthsFromPlans = Object.keys(existingPlans);
          
          // Update the child document with months column
          await updateDoc(childRef, {
            months: monthsFromPlans
          });
          
          console.log(`✅ Added months column to ${child.id}:`, monthsFromPlans);
        } else {
          console.log(`ℹ️ Child ${child.id} already has months column:`, child.data.months);
        }
      }
      
      // Reload data to show updated structure
      await loadDatabaseData();
      console.log('🎉 Months column update completed!');
      
    } catch (err) {
      console.error('Error adding months column:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const countColumns = (obj) => {
    if (!obj || typeof obj !== 'object') return 0;
    return Object.keys(obj).length;
  };

  const renderObject = (obj, level = 0) => {
    if (!obj || typeof obj !== 'object') {
      return <span>{String(obj)}</span>;
    }

    return (
      <div style={{ marginLeft: level * 20 }}>
        {Object.entries(obj).map(([key, value]) => (
          <div key={key} style={{ marginBottom: 8 }}>
            <strong style={{ color: '#6a4c93' }}>{key}:</strong>
            {typeof value === 'object' && value !== null ? (
              <div>
                {Array.isArray(value) ? (
                  <div>
                    <span style={{ color: '#666' }}>[Array with {value.length} items]</span>
                    {value.slice(0, 3).map((item, index) => (
                      <div key={index} style={{ marginLeft: 20 }}>
                        {renderObject(item, level + 1)}
                      </div>
                    ))}
                    {value.length > 3 && (
                      <div style={{ marginLeft: 20, color: '#666' }}>
                        ... and {value.length - 3} more items
                      </div>
                    )}
                  </div>
                ) : (
                  renderObject(value, level + 1)
                )}
              </div>
            ) : (
              <span style={{ marginLeft: 10 }}>{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>Please log in to view database</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>Loading database structure...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>
        <h2>Error loading database</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ color: '#6a4c93', marginBottom: 30 }}>📊 Firebase Database Structure</h1>
      
      {/* Action Buttons */}
      <div style={{ 
        marginBottom: 30, 
        padding: 20, 
        backgroundColor: '#fff3cd', 
        borderRadius: 8,
        border: '1px solid #ffeaa7'
      }}>
        <h3 style={{ color: '#856404', marginBottom: 15 }}>🔧 Database Actions</h3>
        <button 
          onClick={addMonthsColumnToExistingProfiles}
          disabled={loading}
          style={{
            backgroundColor: '#6a4c93',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '🔄 Updating...' : '📅 Add Months Column to Existing Profiles'}
        </button>
        <p style={{ marginTop: 10, color: '#856404', fontSize: '14px' }}>
          This will add a "months" column to child profiles that don't have it yet, based on their existing plans.
        </p>
      </div>

      {/* User Data */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ color: '#264653', borderBottom: '2px solid #6a4c93', paddingBottom: 10 }}>
          👤 User Document (users/{user.uid})
        </h2>
        {userData ? (
          <div>
            <p><strong>Total Columns:</strong> {countColumns(userData)}</p>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: 20, 
              borderRadius: 8, 
              border: '1px solid #ddd',
              fontFamily: 'monospace',
              fontSize: 14
            }}>
              {renderObject(userData)}
            </div>
          </div>
        ) : (
          <p style={{ color: '#666' }}>No user data found</p>
        )}
      </div>

      {/* Children Data */}
      <div>
        <h2 style={{ color: '#264653', borderBottom: '2px solid #6a4c93', paddingBottom: 10 }}>
          👶 Children Collection (users/{user.uid}/children)
        </h2>
        {childrenData.length > 0 ? (
          childrenData.map((child, index) => (
            <div key={child.id} style={{ marginBottom: 30 }}>
              <h3 style={{ color: '#6a4c93' }}>
                Child: {child.id} (ID: {child.id})
                {!child.data.months && (
                  <span style={{ 
                    backgroundColor: '#ff6b6b', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    marginLeft: '10px' 
                  }}>
                    ⚠️ No Months Column
                  </span>
                )}
                {child.data.months && (
                  <span style={{ 
                    backgroundColor: '#4ECDC4', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    marginLeft: '10px' 
                  }}>
                    ✅ Has Months Column
                  </span>
                )}
              </h3>
              <p><strong>Total Columns:</strong> {countColumns(child.data)}</p>
              {child.data.months && (
                <p><strong>Months with Plans:</strong> {child.data.months.length} ({child.data.months.join(', ')})</p>
              )}
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: 20, 
                borderRadius: 8, 
                border: '1px solid #ddd',
                fontFamily: 'monospace',
                fontSize: 14
              }}>
                {renderObject(child.data)}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#666' }}>No children data found</p>
        )}
      </div>

      {/* Summary */}
      <div style={{ 
        marginTop: 40, 
        padding: 20, 
        backgroundColor: '#e8f4f8', 
        borderRadius: 8,
        border: '1px solid #4ECDC4'
      }}>
        <h3 style={{ color: '#264653', marginBottom: 15 }}>📋 Database Summary</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><strong>User Columns:</strong> {userData ? countColumns(userData) : 0}</li>
          <li><strong>Total Children:</strong> {childrenData.length}</li>
          <li><strong>Total Child Columns:</strong> {childrenData.reduce((sum, child) => sum + countColumns(child.data), 0)}</li>
          <li><strong>Total Months with Plans:</strong> {childrenData.reduce((sum, child) => sum + (child.data.months ? child.data.months.length : 0), 0)}</li>
          <li><strong>Collections:</strong> users, users/{user.uid}/children</li>
        </ul>
      </div>
    </div>
  );
};

export default DatabaseViewer; 