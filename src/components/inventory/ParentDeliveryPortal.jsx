import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const ParentDeliveryPortal = () => {
  const [user] = useAuthState(auth);
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    if (user) {
      loadDeliveries();
    }
  }, [user]);

  const loadDeliveries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/deliveries/schedule?user_id=${user.uid}`);
      
      if (!response.ok) {
        throw new Error('Failed to load deliveries');
      }

      const data = await response.json();
      setDeliveries(data.schedule?.upcoming_deliveries || []);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setDeliveries(getSampleDeliveries());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleDeliveries = () => {
    return [
      {
        deliveryId: 'del_001',
        childName: 'Emma',
        week: 1,
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        materials: [
          { name: 'Colored Pencils Set', quantity: 1, category: 'Art Supplies' },
          { name: 'Construction Paper Pack', quantity: 1, category: 'Craft Supplies' },
          { name: 'Children\'s Encyclopedia', quantity: 1, category: 'Books' }
        ],
        trackingNumber: 'TRK123456789',
        estimatedDelivery: '2-3 business days'
      },
      {
        deliveryId: 'del_002',
        childName: 'Emma',
        week: 2,
        scheduledDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'preparing',
        materials: [
          { name: 'Magnifying Glass', quantity: 1, category: 'Science Kits' },
          { name: 'Educational Board Game', quantity: 1, category: 'Games' }
        ],
        trackingNumber: null,
        estimatedDelivery: 'Next week'
      }
    ];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#3b82f6';
      case 'preparing': return '#f59e0b';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'delayed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'preparing': return 'Preparing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'delayed': return 'Delayed';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const containerStyle = {
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  };

  const deliveryCardStyle = {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const deliveryCardHoverStyle = {
    ...deliveryCardStyle,
    borderColor: '#3b82f6',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.1)'
  };

  const materialListStyle = {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  };

  const detailModalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto'
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }}></div>
          Loading your deliveries...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{
          padding: '16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626'
        }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
          📦 Your Learning Kit Deliveries
        </h1>
        <p style={{ margin: '0', color: '#64748b' }}>
          Track your child's learning materials and delivery status
        </p>
      </div>

      {deliveries.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#64748b',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h3>No deliveries scheduled</h3>
          <p>Your child's learning materials will appear here once scheduled.</p>
        </div>
      ) : (
        <div>
          {deliveries.map((delivery) => (
            <div
              key={delivery.deliveryId}
              style={deliveryCardStyle}
              onMouseOver={(e) => {
                Object.assign(e.target.style, deliveryCardHoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.target.style, deliveryCardStyle);
              }}
              onClick={() => setSelectedDelivery(delivery)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>
                    Week {delivery.week} - {delivery.childName}'s Learning Kit
                  </h3>
                  <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>
                    Scheduled for: {formatDate(delivery.scheduledDate)}
                  </p>
                </div>
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: getStatusColor(delivery.status),
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {getStatusText(delivery.status)}
                </div>
              </div>

              <div style={materialListStyle}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
                  Materials Included:
                </h4>
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                  {delivery.materials.map((material, index) => (
                    <li key={index} style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                      {material.name} ({material.category})
                    </li>
                  ))}
                </ul>
              </div>

              {delivery.trackingNumber && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '6px',
                  border: '1px solid #0ea5e9'
                }}>
                  <div style={{ fontSize: '12px', color: '#0c4a6e', fontWeight: '500' }}>
                    Tracking Number: {delivery.trackingNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#0c4a6e' }}>
                    Estimated Delivery: {delivery.estimatedDelivery}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delivery Detail Modal */}
      {selectedDelivery && (
        <div style={detailModalStyle} onClick={() => setSelectedDelivery(null)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: '0', color: '#1e293b' }}>
                Delivery Details
              </h2>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
                onClick={() => setSelectedDelivery(null)}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
                Week {selectedDelivery.week} - {selectedDelivery.childName}'s Learning Kit
              </h3>
              <p style={{ margin: '0', color: '#64748b' }}>
                Scheduled for: {formatDate(selectedDelivery.scheduledDate)}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>Materials Included:</h4>
              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                {selectedDelivery.materials.map((material, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < selectedDelivery.materials.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#1e293b' }}>
                        {material.name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>
                        {material.category}
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      Qty: {material.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedDelivery.trackingNumber && (
              <div style={{
                padding: '16px',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #0ea5e9',
                marginBottom: '20px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>Tracking Information</h4>
                <p style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>
                  <strong>Tracking Number:</strong> {selectedDelivery.trackingNumber}
                </p>
                <p style={{ margin: '0', color: '#0c4a6e' }}>
                  <strong>Estimated Delivery:</strong> {selectedDelivery.estimatedDelivery}
                </p>
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onClick={() => setSelectedDelivery(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ParentDeliveryPortal;
