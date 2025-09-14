import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';

const ContentManagement = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  // Content form state
  const [contentForm, setContentForm] = useState({
    title: '',
    description: '',
    category: '',
    ageGroup: '',
    difficulty: 'beginner',
    type: 'lesson',
    tags: [],
    content: '',
    thumbnail: '',
    estimatedTime: '',
    learningObjectives: []
  });

  // Categories for content organization
  const categories = [
    'Mathematics', 'Science', 'Language Arts', 'Social Studies', 
    'Art & Creativity', 'Physical Education', 'Life Skills', 'Technology'
  ];

  const ageGroups = ['3-5', '6-8', '9-11', '12-14', '15-17'];
  const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
  const contentTypes = ['lesson', 'activity', 'worksheet', 'video', 'game', 'assessment'];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const contentRef = collection(db, 'learningContent');
      const q = query(contentRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const contentData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContent(contentData);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const contentData = {
        ...contentForm,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser.uid,
        status: 'draft'
      };

      if (editingContent) {
        await updateDoc(doc(db, 'learningContent', editingContent.id), {
          ...contentData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'learningContent'), contentData);
      }

      setContentForm({
        title: '',
        description: '',
        category: '',
        ageGroup: '',
        difficulty: 'beginner',
        type: 'lesson',
        tags: [],
        content: '',
        thumbnail: '',
        estimatedTime: '',
        learningObjectives: []
      });
      setEditingContent(null);
      setShowUploadModal(false);
      fetchContent();
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contentItem) => {
    setEditingContent(contentItem);
    setContentForm({
      title: contentItem.title || '',
      description: contentItem.description || '',
      category: contentItem.category || '',
      ageGroup: contentItem.ageGroup || '',
      difficulty: contentItem.difficulty || 'beginner',
      type: contentItem.type || 'lesson',
      tags: contentItem.tags || [],
      content: contentItem.content || '',
      thumbnail: contentItem.thumbnail || '',
      estimatedTime: contentItem.estimatedTime || '',
      learningObjectives: contentItem.learningObjectives || []
    });
    setShowUploadModal(true);
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteDoc(doc(db, 'learningContent', contentId));
        fetchContent();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return '#22c55e';
      case 'draft': return '#f59e0b';
      case 'review': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#22c55e';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2.5rem', fontWeight: '700', color: '#1e293b' }}>
              📚 Learning Content Management
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>
              Create, organize, and manage educational content for your platform
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                padding: '12px 24px',
                background: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              + Add Content
            </button>
            <button
              onClick={() => navigate('/admin/content-analytics')}
              style={{
                padding: '12px 24px',
                background: '#22c55e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              📊 View Existing Content
            </button>
            <button
              onClick={() => navigate('/admin/content-inventory')}
              style={{
                padding: '12px 24px',
                background: '#8b5cf6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              📚 Content Inventory
            </button>
            <button
              onClick={() => navigate('/admin/progress')}
              style={{
                padding: '12px 24px',
                background: '#f59e0b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              📊 Child Progress
            </button>
            <button
              onClick={() => navigate('/admin')}
              style={{
                padding: '12px 24px',
                background: '#6b7280',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              ← Back to Admin
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['overview', 'content', 'analytics', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab ? '#3b82f6' : '#f1f5f9',
                color: activeTab === tab ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                textTransform: 'capitalize',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        {activeTab === 'overview' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
              📊 Content Overview
            </h3>
            
            {/* Existing Content Summary */}
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '600' }}>
                🎯 Your Existing Content Library
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>400</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Topics</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>4</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Niches</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>10</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Age Groups</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>100</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Topics per Niche</div>
                </div>
              </div>
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  onClick={() => navigate('/admin/content-analytics')}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  📊 View Detailed Analytics
                </button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
                  {content.length}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>New Content Added</div>
              </div>
              
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
                  {content.filter(c => c.status === 'published').length}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Published</div>
              </div>
              
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
                  {content.filter(c => c.status === 'draft').length}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Drafts</div>
              </div>
              
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
                  {categories.length}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Categories</div>
              </div>
            </div>

            {/* Recent Content */}
            <div>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
                📝 Recent Content
              </h4>
              {content.slice(0, 5).map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      {item.category} • {item.ageGroup} • {item.type}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      background: getStatusColor(item.status) + '20',
                      color: getStatusColor(item.status),
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {item.status}
                    </span>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        padding: '4px 8px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
              📚 All Content
            </h3>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading content...</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {content.map((item) => (
                  <div key={item.id} style={{
                    padding: '20px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                          {item.title}
                        </h4>
                        <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '0.9rem' }}>
                          {item.description}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <span style={{
                            padding: '4px 8px',
                            background: '#e0e7ff',
                            color: '#3730a3',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {item.category}
                          </span>
                          <span style={{
                            padding: '4px 8px',
                            background: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {item.ageGroup}
                          </span>
                          <span style={{
                            padding: '4px 8px',
                            background: getDifficultyColor(item.difficulty) + '20',
                            color: getDifficultyColor(item.difficulty),
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}>
                            {item.difficulty}
                          </span>
                          <span style={{
                            padding: '4px 8px',
                            background: '#f3f4f6',
                            color: '#374151',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}>
                            {item.type}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{
                          padding: '6px 12px',
                          background: getStatusColor(item.status) + '20',
                          color: getStatusColor(item.status),
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {item.status}
                        </span>
                        <button
                          onClick={() => handleEdit(item)}
                          style={{
                            padding: '6px 12px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
              📊 Content Analytics
            </h3>
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Analytics dashboard coming soon...
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
              ⚙️ Content Settings
            </h3>
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Settings panel coming soon...
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
              {editingContent ? 'Edit Content' : 'Add New Content'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={contentForm.title}
                    onChange={(e) => setContentForm({...contentForm, title: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Description *
                  </label>
                  <textarea
                    value={contentForm.description}
                    onChange={(e) => setContentForm({...contentForm, description: e.target.value})}
                    required
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Category *
                    </label>
                    <select
                      value={contentForm.category}
                      onChange={(e) => setContentForm({...contentForm, category: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Age Group *
                    </label>
                    <select
                      value={contentForm.ageGroup}
                      onChange={(e) => setContentForm({...contentForm, ageGroup: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Select Age Group</option>
                      {ageGroups.map(age => (
                        <option key={age} value={age}>{age} years</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Difficulty Level
                    </label>
                    <select
                      value={contentForm.difficulty}
                      onChange={(e) => setContentForm({...contentForm, difficulty: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      {difficultyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Content Type
                    </label>
                    <select
                      value={contentForm.type}
                      onChange={(e) => setContentForm({...contentForm, type: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      {contentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={contentForm.estimatedTime}
                    onChange={(e) => setContentForm({...contentForm, estimatedTime: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Content *
                  </label>
                  <textarea
                    value={contentForm.content}
                    onChange={(e) => setContentForm({...contentForm, content: e.target.value})}
                    required
                    rows={8}
                    placeholder="Enter the main content here..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setEditingContent(null);
                    setContentForm({
                      title: '',
                      description: '',
                      category: '',
                      ageGroup: '',
                      difficulty: 'beginner',
                      type: 'lesson',
                      tags: [],
                      content: '',
                      thumbnail: '',
                      estimatedTime: '',
                      learningObjectives: []
                    });
                  }}
                  style={{
                    padding: '12px 24px',
                    background: '#6b7280',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? 'Saving...' : (editingContent ? 'Update' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
