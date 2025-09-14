import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projectSheet, setProjectSheet] = useState({
    projects: [
      {
        id: 1,
        name: "Admin Dashboard Redesign",
        category: "Development",
        priority: "High",
        status: "In Progress",
        startDate: "2024-01-15",
        endDate: "2024-01-25",
        estimatedHours: 40,
        actualHours: 25,
        progress: 62,
        steps: [
          { id: 1, task: "UI/UX Design", estimatedTime: "8h", actualTime: "6h", status: "Completed", result: "Modern, clean admin interface" },
          { id: 2, task: "Component Development", estimatedTime: "12h", actualTime: "8h", status: "In Progress", result: "Reusable admin components" },
          { id: 3, task: "Integration Testing", estimatedTime: "6h", actualTime: "0h", status: "Pending", result: "Fully tested admin system" },
          { id: 4, task: "Performance Optimization", estimatedTime: "8h", actualTime: "0h", status: "Pending", result: "Fast, responsive dashboard" },
          { id: 5, task: "Documentation", estimatedTime: "6h", actualTime: "0h", status: "Pending", result: "Complete admin guide" }
        ],
        dependencies: ["User Authentication", "Database Schema"],
        deliverables: ["Admin Panel", "User Management", "Analytics Dashboard"],
        risks: ["Time constraints", "UI complexity"],
        notes: "Critical for business operations"
      },
      {
        id: 2,
        name: "Sales Pipeline System",
        category: "Business",
        priority: "High",
        status: "Planning",
        startDate: "2024-01-20",
        endDate: "2024-02-05",
        estimatedHours: 30,
        actualHours: 0,
        progress: 0,
        steps: [
          { id: 1, task: "Requirements Analysis", estimatedTime: "4h", actualTime: "0h", status: "Pending", result: "Clear system requirements" },
          { id: 2, task: "Database Design", estimatedTime: "6h", actualTime: "0h", status: "Pending", result: "Optimized sales data structure" },
          { id: 3, task: "API Development", estimatedTime: "10h", actualTime: "0h", status: "Pending", result: "RESTful sales API" },
          { id: 4, task: "Frontend Integration", estimatedTime: "8h", actualTime: "0h", status: "Pending", result: "Interactive sales dashboard" },
          { id: 5, task: "Testing & Deployment", estimatedTime: "2h", actualTime: "0h", status: "Pending", result: "Live sales tracking system" }
        ],
        dependencies: ["Admin Dashboard", "Payment Gateway"],
        deliverables: ["Sales Dashboard", "Lead Management", "Revenue Reports"],
        risks: ["Integration complexity", "Data migration"],
        notes: "Essential for revenue tracking"
      },
      {
        id: 3,
        name: "Content Marketing Campaign",
        category: "Marketing",
        priority: "Medium",
        status: "Planning",
        startDate: "2024-01-25",
        endDate: "2024-02-15",
        estimatedHours: 25,
        actualHours: 0,
        progress: 0,
        steps: [
          { id: 1, task: "Content Strategy", estimatedTime: "4h", actualTime: "0h", status: "Pending", result: "Comprehensive content plan" },
          { id: 2, task: "Blog Posts Creation", estimatedTime: "8h", actualTime: "0h", status: "Pending", result: "10 high-quality blog posts" },
          { id: 3, task: "Social Media Content", estimatedTime: "6h", actualTime: "0h", status: "Pending", result: "30 social media posts" },
          { id: 4, task: "Email Newsletter", estimatedTime: "4h", actualTime: "0h", status: "Pending", result: "Weekly newsletter series" },
          { id: 5, task: "Analytics Setup", estimatedTime: "3h", actualTime: "0h", status: "Pending", result: "Content performance tracking" }
        ],
        dependencies: ["Brand Guidelines", "Website Content"],
        deliverables: ["Content Calendar", "Blog Posts", "Social Media Kit"],
        risks: ["Content quality", "Engagement rates"],
        notes: "Focus on educational content"
      }
    ],
    filters: {
      category: "All",
      status: "All",
      priority: "All"
    },
    sortBy: "priority",
    viewMode: "table"
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#22c55e';
      case 'In Progress': return '#3b82f6';
      case 'Planning': return '#f59e0b';
      case 'On Hold': return '#6b7280';
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2.5rem', fontWeight: '700', color: '#1e293b' }}>
              📊 Project Sheet
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>
              Comprehensive project planning and tracking like Google Sheets
            </p>
          </div>
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

        {/* Filters and Controls */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontWeight: 500, color: '#1e293b' }}>Category:</label>
            <select 
              style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#ffffff' }}
              value={projectSheet.filters.category}
              onChange={(e) => setProjectSheet(prev => ({...prev, filters: {...prev.filters, category: e.target.value}}))}
            >
              <option value="All">All</option>
              <option value="Development">Development</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontWeight: 500, color: '#1e293b' }}>Status:</label>
            <select 
              style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#ffffff' }}
              value={projectSheet.filters.status}
              onChange={(e) => setProjectSheet(prev => ({...prev, filters: {...prev.filters, status: e.target.value}}))}
            >
              <option value="All">All</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontWeight: 500, color: '#1e293b' }}>Priority:</label>
            <select 
              style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#ffffff' }}
              value={projectSheet.filters.priority}
              onChange={(e) => setProjectSheet(prev => ({...prev, filters: {...prev.filters, priority: e.target.value}}))}
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              + New Project
            </button>
            <button style={{
              padding: '8px 16px',
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Project Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
          gap: '16px',
          padding: '20px 24px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontWeight: 600,
          color: '#1e293b',
          fontSize: '0.9rem'
        }}>
          <div>Project Name</div>
          <div>Category</div>
          <div>Priority</div>
          <div>Status</div>
          <div>Progress</div>
          <div>Time</div>
          <div>Timeline</div>
          <div>Actions</div>
        </div>

        {/* Table Rows */}
        {projectSheet.projects
          .filter(project => 
            (projectSheet.filters.category === "All" || project.category === projectSheet.filters.category) &&
            (projectSheet.filters.status === "All" || project.status === projectSheet.filters.status) &&
            (projectSheet.filters.priority === "All" || project.priority === projectSheet.filters.priority)
          )
          .map(project => (
            <div key={project.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              {/* Main Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                gap: '16px',
                padding: '20px 24px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px', fontSize: '1rem' }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{project.notes}</div>
                </div>
                <div>
                  <span style={{
                    padding: '6px 12px',
                    background: '#f1f5f9',
                    color: '#475569',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 500
                  }}>
                    {project.category}
                  </span>
                </div>
                <div>
                  <span style={{
                    padding: '6px 12px',
                    background: getPriorityColor(project.priority) + '20',
                    color: getPriorityColor(project.priority),
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 500
                  }}>
                    {project.priority}
                  </span>
                </div>
                <div>
                  <span style={{
                    padding: '6px 12px',
                    background: getStatusColor(project.status) + '20',
                    color: getStatusColor(project.status),
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 500
                  }}>
                    {project.status}
                  </span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '80px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${project.progress}%`,
                        height: '100%',
                        background: getStatusColor(project.status),
                        borderRadius: '4px'
                      }}></div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>
                      {project.progress}%
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>
                    {project.actualHours}h / {project.estimatedHours}h
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {Math.round((project.actualHours / project.estimatedHours) * 100)}% complete
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{
                    padding: '6px 12px',
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    View
                  </button>
                  <button style={{
                    padding: '6px 12px',
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    Edit
                  </button>
                </div>
              </div>

              {/* Expanded Details Row */}
              <div style={{ padding: '0 24px 20px 24px', background: '#f8fafc' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                  {/* Steps */}
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                      Steps & Tasks
                    </h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {project.steps.slice(0, 3).map(step => (
                        <div key={step.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: '#ffffff',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div style={{ fontSize: '0.8rem', color: '#1e293b' }}>{step.task}</div>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {step.actualTime}/{step.estimatedTime}
                            </span>
                            <span style={{
                              padding: '3px 6px',
                              background: getStatusColor(step.status) + '20',
                              color: getStatusColor(step.status),
                              borderRadius: '3px',
                              fontSize: '0.7rem'
                            }}>
                              {step.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {project.steps.length > 3 && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', padding: '6px' }}>
                          +{project.steps.length - 3} more steps
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dependencies & Deliverables */}
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                      Dependencies
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {project.dependencies.map((dep, idx) => (
                        <span key={idx} style={{
                          padding: '4px 8px',
                          background: '#e2e8f0',
                          color: '#475569',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {dep}
                        </span>
                      ))}
                    </div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                      Deliverables
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {project.deliverables.map((del, idx) => (
                        <span key={idx} style={{
                          padding: '4px 8px',
                          background: '#dbeafe',
                          color: '#1e40af',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {del}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Risks & Results */}
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                      Risks
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {project.risks.map((risk, idx) => (
                        <span key={idx} style={{
                          padding: '4px 8px',
                          background: '#fef2f2',
                          color: '#dc2626',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {risk}
                        </span>
                      ))}
                    </div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                      Expected Results
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
                      {project.steps.map(step => step.result).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginTop: '24px'
      }}>
        <div style={{
          padding: '20px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>
            {projectSheet.projects.length}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Projects</div>
        </div>
        <div style={{
          padding: '20px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#22c55e' }}>
            {projectSheet.projects.filter(p => p.status === 'Completed').length}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Completed</div>
        </div>
        <div style={{
          padding: '20px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
            {projectSheet.projects.filter(p => p.status === 'In Progress').length}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>In Progress</div>
        </div>
        <div style={{
          padding: '20px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#8b5cf6' }}>
            {Math.round(projectSheet.projects.reduce((sum, p) => sum + p.progress, 0) / projectSheet.projects.length)}%
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Avg Progress</div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;


