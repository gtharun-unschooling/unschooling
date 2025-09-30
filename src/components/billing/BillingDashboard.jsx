import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import MinimalBackButton from '../ui/MinimalBackButton';

const BillingDashboard = () => {
  const { currentUser } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subscriptions');

  useEffect(() => {
    if (currentUser) {
      loadBillingData();
    }
  }, [currentUser]);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      
      // Load subscriptions
      const subscriptionsRef = collection(db, 'subscriptions');
      const subscriptionsQuery = query(
        subscriptionsRef,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
      
      const subscriptionsList = [];
      subscriptionsSnapshot.forEach((doc) => {
        subscriptionsList.push({ id: doc.id, ...doc.data() });
      });
      setSubscriptions(subscriptionsList);

      // Load invoices (same as subscriptions for now, but can be separate)
      setInvoices(subscriptionsList);
      
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAmount = (amountInPaise) => {
    return (amountInPaise / 100).toFixed(2);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'cancelled': return '#ef4444';
      case 'expired': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '✅';
      case 'cancelled': return '❌';
      case 'expired': return '⏰';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '1.1rem',
        color: '#6b7280',
      }}>
        Loading billing information...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
    }}>
      <MinimalBackButton 
        heroColors={{
          backgroundColor: '#f8fafc',
          primaryColor: '#3b82f6',
          nicheColor: '#1e40af'
        }}
      />
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '0.5rem',
        }}>
          Billing & Invoices
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1.1rem',
        }}>
          Manage your subscriptions and view payment history
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '2rem',
      }}>
        <button
          onClick={() => setActiveTab('subscriptions')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'subscriptions' ? '#10b981' : '#6b7280',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            borderBottom: activeTab === 'subscriptions' ? '2px solid #10b981' : '2px solid transparent',
          }}
        >
          Subscriptions
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'invoices' ? '#10b981' : '#6b7280',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            borderBottom: activeTab === 'invoices' ? '2px solid #10b981' : '2px solid transparent',
          }}
        >
          Invoices
        </button>
      </div>

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1.5rem',
          }}>
            Active Subscriptions
          </h2>
          
          {subscriptions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '2px dashed #d1d5db',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem',
              }}>
                No subscriptions found
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
              }}>
                You don't have any active subscriptions yet.
              </p>
              <button
                onClick={() => window.location.href = '/plans'}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Browse Plans
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '1.5rem',
            }}>
              {subscriptions.map((subscription) => (
                <div key={subscription.id} style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '0.25rem',
                        textTransform: 'capitalize',
                      }}>
                        {subscription.planType} Plan
                      </h3>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                      }}>
                        {subscription.billingCycle === 'yearly' ? 'Annual' : 'Monthly'} billing
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <span style={{ fontSize: '1.25rem' }}>
                        {getStatusIcon(subscription.status)}
                      </span>
                      <span style={{
                        color: getStatusColor(subscription.status),
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}>
                        {subscription.status}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}>
                    <div>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem',
                      }}>
                        Amount
                      </p>
                      <p style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}>
                        ₹{formatAmount(subscription.amount)}
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem',
                      }}>
                        Start Date
                      </p>
                      <p style={{
                        fontSize: '1rem',
                        color: '#1f2937',
                      }}>
                        {formatDate(subscription.startDate)}
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem',
                      }}>
                        End Date
                      </p>
                      <p style={{
                        fontSize: '1rem',
                        color: '#1f2937',
                      }}>
                        {formatDate(subscription.endDate)}
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem',
                      }}>
                        Payment ID
                      </p>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        fontFamily: 'monospace',
                      }}>
                        {subscription.paymentId?.substring(0, 20)}...
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'flex-end',
                  }}>
                    <button style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#374151',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}>
                      View Details
                    </button>
                    {subscription.status === 'active' && (
                      <button style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #ef4444',
                        backgroundColor: 'white',
                        color: '#ef4444',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1.5rem',
          }}>
            Payment History
          </h2>
          
          {invoices.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '2px dashed #d1d5db',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧾</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem',
              }}>
                No invoices found
              </h3>
              <p style={{
                color: '#6b7280',
              }}>
                Your payment history will appear here once you make a purchase.
              </p>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                  }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                    }}>
                      Invoice
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                    }}>
                      Plan
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                    }}>
                      Amount
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                    }}>
                      Date
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                    }}>
                      Status
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                    <tr key={invoice.id} style={{
                      borderBottom: index < invoices.length - 1 ? '1px solid #f3f4f6' : 'none',
                    }}>
                      <td style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: '#1f2937',
                        fontFamily: 'monospace',
                      }}>
                        INV-{invoice.paymentId?.substring(0, 8).toUpperCase()}
                      </td>
                      <td style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: '#1f2937',
                        textTransform: 'capitalize',
                      }}>
                        {invoice.planType} ({invoice.billingCycle})
                      </td>
                      <td style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: '#1f2937',
                        fontWeight: '600',
                      }}>
                        ₹{formatAmount(invoice.amount)}
                      </td>
                      <td style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                      }}>
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td style={{
                        padding: '1rem',
                      }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: '#ecfdf5',
                          color: '#059669',
                        }}>
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </span>
                      </td>
                      <td style={{
                        padding: '1rem',
                      }}>
                        <button style={{
                          padding: '0.5rem 1rem',
                          border: '1px solid #d1d5db',
                          backgroundColor: 'white',
                          color: '#374151',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                        }}>
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BillingDashboard;
