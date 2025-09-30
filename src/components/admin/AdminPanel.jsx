import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import LoadingSpinner from '../ui/LoadingSpinner';
import UnifiedDashboard from '../../pages/UnifiedDashboard/UnifiedDashboard';
import OrderManagement from './OrderManagement';
import DevDashboard from './AdminDashboard';
import AdminDashboard from '../../pages/Admin/AdminDashboard';
import InventoryDashboard from '../inventory/InventoryDashboard';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import ContentBuilder from '../content/ContentBuilder';
// Founder dashboard is merged into this AdminPanel as a Business tab

const AdminPanel = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, promoteToAdmin, demoteToParent } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');
  const [activeSection, setActiveSection] = useState('schedule');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scheduleView, setScheduleView] = useState('daily'); // daily, weekly, monthly
  const [timeTracking, setTimeTracking] = useState({
    isTracking: false,
    sessionStart: null,
    todayHours: 0,
    weekHours: 0,
    monthHours: 0,
    dailySessions: [],
    weeklyData: [],
    monthlyData: []
  });
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
    viewMode: "table" // table, kanban, gantt
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
    initializeTimeTracking();
  }, []);


  // Time tracking effects
  useEffect(() => {
    let interval;
    if (timeTracking.isTracking) {
      interval = setInterval(() => {
        updateTimeTracking();
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [timeTracking.isTracking, timeTracking.sessionStart]);

  // Check for Cursor app activity
  useEffect(() => {
    const checkCursorActivity = () => {
      // This would ideally check if Cursor is the active window
      // For now, we'll simulate this with a simple check
      const isCursorActive = document.hasFocus() && window.location.hostname === 'localhost';
      if (isCursorActive && !timeTracking.isTracking) {
        startTimeTracking();
      } else if (!isCursorActive && timeTracking.isTracking) {
        stopTimeTracking();
      }
    };

    const interval = setInterval(checkCursorActivity, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [timeTracking.isTracking]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to fetch users. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setMessage({ type: '', text: '' });
      
      if (newRole === 'admin') {
        await promoteToAdmin(userId);
        setMessage({ type: 'success', text: 'User promoted to admin successfully' });
      } else {
        await demoteToParent(userId);
        setMessage({ type: 'success', text: 'User demoted to parent successfully' });
      }
      
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('Error changing user role:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to change user role' });
    }
  };

  // Time tracking functions
  const initializeTimeTracking = () => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('cursorTimeTracking');
    
    if (savedData) {
      const data = JSON.parse(savedData);
      const todayData = data.dailySessions[today] || { hours: 0, sessions: [] };
      
      setTimeTracking(prev => ({
        ...prev,
        todayHours: todayData.hours,
        weekHours: data.weekHours || 0,
        monthHours: data.monthHours || 0,
        dailySessions: data.dailySessions || {},
        weeklyData: data.weeklyData || [],
        monthlyData: data.monthlyData || []
      }));
    }
  };

  const startTimeTracking = () => {
    setTimeTracking(prev => ({
      ...prev,
      isTracking: true,
      sessionStart: new Date()
    }));
  };

  const stopTimeTracking = () => {
    if (timeTracking.sessionStart) {
      const sessionDuration = (new Date() - timeTracking.sessionStart) / (1000 * 60 * 60); // hours
      const today = new Date().toDateString();
      
      setTimeTracking(prev => {
        const newTodayHours = prev.todayHours + sessionDuration;
        const newDailySessions = {
          ...prev.dailySessions,
          [today]: {
            hours: newTodayHours,
            sessions: [
              ...(prev.dailySessions[today]?.sessions || []),
              {
                start: prev.sessionStart,
                end: new Date(),
                duration: sessionDuration
              }
            ]
          }
        };

        // Update weekly and monthly data
        const weekStart = getWeekStart(new Date());
        const monthStart = getMonthStart(new Date());
        
        const newWeekHours = calculateWeekHours(newDailySessions, weekStart);
        const newMonthHours = calculateMonthHours(newDailySessions, monthStart);

        const updatedData = {
          ...prev,
          isTracking: false,
          sessionStart: null,
          todayHours: newTodayHours,
          weekHours: newWeekHours,
          monthHours: newMonthHours,
          dailySessions: newDailySessions
        };

        // Save to localStorage
        localStorage.setItem('cursorTimeTracking', JSON.stringify({
          dailySessions: newDailySessions,
          weekHours: newWeekHours,
          monthHours: newMonthHours,
          weeklyData: prev.weeklyData,
          monthlyData: prev.monthlyData
        }));

        return updatedData;
      });
    }
  };

  const updateTimeTracking = () => {
    if (timeTracking.isTracking && timeTracking.sessionStart) {
      const currentSessionDuration = (new Date() - timeTracking.sessionStart) / (1000 * 60 * 60);
      const today = new Date().toDateString();
      
      setTimeTracking(prev => {
        const newTodayHours = (prev.dailySessions[today]?.hours || 0) + currentSessionDuration;
        return {
          ...prev,
          todayHours: newTodayHours
        };
      });
    }
  };

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getMonthStart = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const calculateWeekHours = (dailySessions, weekStart) => {
    let totalHours = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dayKey = date.toDateString();
      totalHours += dailySessions[dayKey]?.hours || 0;
    }
    return totalHours;
  };

  const calculateMonthHours = (dailySessions, monthStart) => {
    let totalHours = 0;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    for (let day = 1; day <= 31; day++) {
      const date = new Date(currentYear, currentMonth, day);
      if (date.getMonth() === currentMonth) {
        const dayKey = date.toDateString();
        totalHours += dailySessions[dayKey]?.hours || 0;
      }
    }
    return totalHours;
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  // Admin-specific styling - professional and clean
  const adminContainerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    color: '#1e293b',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '0',
    margin: '0',
    overflow: 'hidden',
    display: 'flex'
  };

  const adminHeaderStyle = {
    background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)',
    padding: '20px 0',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const adminTitleStyle = {
    fontSize: '2rem',
    fontWeight: '600',
    textAlign: 'center',
    margin: '0',
    color: '#ffffff',
    letterSpacing: '0.5px'
  };

  const adminSubtitleStyle = {
    fontSize: '1rem',
    textAlign: 'center',
    margin: '8px 0 0 0',
    color: '#e2e8f0',
    opacity: '0.9'
  };

  const adminTabContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '20px',
    gap: '10px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
  };

  const adminTabStyle = (isActive) => ({
    padding: '15px 30px',
    border: 'none',
    borderRadius: '25px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: isActive 
      ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)' 
      : 'rgba(255, 255, 255, 0.1)',
    color: isActive ? '#ffffff' : '#f1f2f6',
    border: `2px solid ${isActive ? '#ff4757' : 'rgba(255, 255, 255, 0.3)'}`,
    boxShadow: isActive ? '0 8px 25px rgba(255, 107, 107, 0.4)' : 'none',
    transform: isActive ? 'translateY(-2px)' : 'none',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  });

  const adminContentStyle = {
    padding: '32px',
    width: '100%',
    minHeight: '100vh',
    background: '#f8fafc'
  };

  // Sidebar styles
  const sidebarStyle = {
    width: sidebarOpen ? '280px' : '70px',
    transition: 'width 0.25s ease',
    background: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    boxShadow: '2px 0 4px rgba(0, 0, 0, 0.05)',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const sidebarHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: sidebarOpen ? 'space-between' : 'center',
    gap: '8px',
    padding: '6px 8px'
  };

  const burgerButtonStyle = {
    background: '#3b82f6',
    color: '#ffffff',
    border: '1px solid #2563eb',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#2563eb',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(59, 130, 246, 0.4)'
    }
  };

  const navButtonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid transparent',
    background: isActive ? '#3b82f6' : 'transparent',
    color: isActive ? '#ffffff' : '#64748b',
    cursor: 'pointer',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: isActive ? '#2563eb' : '#f1f5f9',
      color: isActive ? '#ffffff' : '#334155'
    }
  });

  // Sidebar groups matching your company verticals (mapped to existing tabs/views)
  const sidebarGroups = [
    {
      label: 'Planning',
      items: [
        { key: 'schedule', label: 'Launch Schedule', icon: '📋', tab: 'schedule' },
        { key: 'content', label: 'Content Management', icon: '📚', tab: 'content' },
        { key: 'progress', label: 'Child Progress', icon: '📊', tab: 'progress' },
        { key: 'agents', label: 'Agent Reporting', icon: '🤖', tab: 'agents' },
        { key: 'agents-streamlined', label: 'Agent Dashboard (Streamlined)', icon: '⚡', tab: 'agents-streamlined' },
        { key: 'comprehensive', label: 'Comprehensive Dashboard', icon: '📊', tab: 'comprehensive' },
        { key: 'child-activity', label: 'Child Activity Tracking', icon: '👶', tab: 'child-activity' },
        { key: 'ultimate', label: 'Ultimate Dashboard', icon: '🚀', tab: 'ultimate' },
        { key: 'inventory', label: 'Inventory Management', icon: '📦', tab: 'inventory' },
        { key: 'analytics', label: 'Analytics Dashboard', icon: '📊', tab: 'analytics' },
        { key: 'content-builder', label: 'Content Builder', icon: '🎨', tab: 'content-builder' }
      ]
    },
    {
      label: 'Quick',
      items: [
        { key: 'overview', label: 'Overview', icon: '📊', tab: 'dashboard' }
      ]
    },
    {
      label: 'Core',
      items: [
        { key: 'sales', label: 'Sales & Orders', icon: '💰', tab: 'warehouse' },
        { key: 'customers', label: 'Customers', icon: '👥', tab: 'users' },
        { key: 'operations', label: 'Operations & Programs', icon: '⚙️', tab: 'business' },
        { key: 'finance', label: 'Finance & RevOps', icon: '📈', tab: 'business' }
      ]
    },
    {
      label: 'Enablement',
      items: [
        { key: 'leadership', label: 'Leadership & Strategy', icon: '🧭', tab: 'business' },
        { key: 'product', label: 'Product Management', icon: '🧩', tab: 'business' },
        { key: 'engineering', label: 'Engineering', icon: '🛠️', tab: 'dev' },
        { key: 'design', label: 'Design & Research', icon: '🎨', tab: 'business' },
        { key: 'data', label: 'Data, AI & Analytics', icon: '🤖', tab: 'dev' },
        { key: 'marketing', label: 'Growth Marketing', icon: '🚀', tab: 'business' },
        { key: 'brand', label: 'Brand & Comms', icon: '📣', tab: 'business' },
        { key: 'success', label: 'Customer Success & Support', icon: '🎧', tab: 'business' },
        { key: 'people', label: 'People/HR & Talent', icon: '🫂', tab: 'business' },
        { key: 'legal', label: 'Legal & Security', icon: '⚖️', tab: 'business' },
        { key: 'it', label: 'IT & Internal Tools', icon: '🖥️', tab: 'dev' },
        { key: 'corpdev', label: 'Corp Dev & IR', icon: '🏦', tab: 'business' }
      ]
    }
  ];

  const quickChips = [
    { label: 'Sales', tab: 'warehouse', key: 'sales' },
    { label: 'Customers', tab: 'users', key: 'customers' },
    { label: 'Operations', tab: 'business', key: 'operations' },
    { label: 'Finance', tab: 'business', key: 'finance' },
    { label: 'Comprehensive Dashboard', tab: 'comprehensive', key: 'comprehensive' }
  ];

  const quickBarStyle = {
    display: 'flex',
    gap: '10px',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.04)'
  };

  const chipStyle = {
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    fontWeight: 700,
    letterSpacing: '0.4px',
    cursor: 'pointer'
  };

  // Section header + quick dashboard per vertical
  const sectionHeaderStyle = {
    padding: '16px',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.03)'
  };
  const cardStyle = {
    minWidth: '180px',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };
  const linkBtnStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    color: '#3b82f6',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#f1f5f9',
      borderColor: '#3b82f6'
    }
  };

  const renderSectionStrip = () => {
    if (activeSection === 'finance') {
      return (
        <div style={sectionHeaderStyle}>
          <div style={cardStyle}>
            <div style={{opacity:0.8,fontSize:'0.85rem'}}>MRR</div>
            <div style={{fontSize:'1.4rem',fontWeight:900}}>₹ —</div>
          </div>
          <div style={cardStyle}>
            <div style={{opacity:0.8,fontSize:'0.85rem'}}>ARR</div>
            <div style={{fontSize:'1.4rem',fontWeight:900}}>₹ —</div>
          </div>
          <div style={cardStyle}>
            <div style={{opacity:0.8,fontSize:'0.85rem'}}>Active Subs</div>
            <div style={{fontSize:'1.4rem',fontWeight:900}}>—</div>
          </div>
          <div style={cardStyle}>
            <div style={{opacity:0.8,fontSize:'0.85rem'}}>Failed Charges (7d)</div>
            <div style={{fontSize:'1.4rem',fontWeight:900}}>—</div>
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <button style={linkBtnStyle}>Open Stripe</button>
            <button style={linkBtnStyle}>Revenue Report</button>
            <button style={linkBtnStyle}>Invoices</button>
            <button style={linkBtnStyle}>Churn Risk</button>
          </div>
        </div>
      );
    }
    if (activeSection === 'sales') {
      return (
        <div style={sectionHeaderStyle}>
          <div style={cardStyle}><div style={{opacity:0.8}}>Leads (7d)</div><div style={{fontSize:'1.4rem',fontWeight:900}}>—</div></div>
          <div style={cardStyle}><div style={{opacity:0.8}}>Win Rate</div><div style={{fontSize:'1.4rem',fontWeight:900}}>—%</div></div>
          <button style={linkBtnStyle}>Pipeline</button>
          <button style={linkBtnStyle}>Follow-ups</button>
        </div>
      );
    }
    if (activeSection === 'customers') {
      return (
        <div style={sectionHeaderStyle}>
          <div style={cardStyle}><div style={{opacity:0.8}}>Active</div><div style={{fontSize:'1.4rem',fontWeight:900}}>—</div></div>
          <div style={cardStyle}><div style={{opacity:0.8}}>At-risk</div><div style={{fontSize:'1.4rem',fontWeight:900}}>—</div></div>
          <button style={linkBtnStyle}>Segments</button>
          <button style={linkBtnStyle}>Renewals</button>
        </div>
      );
    }
    if (activeSection === 'operations') {
      return (
        <div style={sectionHeaderStyle}>
          <div style={cardStyle}><div style={{opacity:0.8}}>Plans Pending</div><div style={{fontSize:'1.4rem',fontWeight:900}}>—</div></div>
          <div style={cardStyle}><div style={{opacity:0.8}}>Stuck >7d</div><div style={{fontSize:'1.4rem',fontWeight:900}}>—</div></div>
          <button style={linkBtnStyle}>Queue</button>
          <button style={linkBtnStyle}>SLA</button>
        </div>
      );
    }
    return null;
  };

  const adminMessageStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '30px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    textAlign: 'center'
  };

  const adminTableStyle = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
  };

  const adminTableHeaderStyle = {
    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
    color: '#ffffff',
    padding: '20px',
    textAlign: 'left',
    fontWeight: '700',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const adminTableCellStyle = {
    padding: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    verticalAlign: 'middle',
    color: '#f1f2f6'
  };

  const adminRoleBadgeStyle = (role) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '700',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    backgroundColor: role === 'admin' 
      ? 'rgba(46, 213, 115, 0.3)' 
      : 'rgba(54, 123, 245, 0.3)',
    color: role === 'admin' ? '#2ed573' : '#367bf5',
    border: `2px solid ${role === 'admin' ? '#2ed573' : '#367bf5'}`,
    backdropFilter: 'blur(10px)'
  });

  const adminButtonStyle = (variant = 'primary') => ({
    padding: '12px 24px',
    border: 'none',
    borderRadius: '25px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    background: variant === 'danger' 
      ? 'linear-gradient(45deg, #ff4757, #ff3742)' 
      : 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
    color: '#ffffff',
    border: '2px solid transparent',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
    }
  });

  if (loading) {
    return (
      <div style={adminContainerStyle}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: '2rem'
        }}>
          <LoadingSpinner size="large" />
          <div style={{ color: '#f1f2f6', fontSize: '1.2rem', fontFamily: 'monospace' }}>
            Loading Admin Panel...
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'schedule':
        return (
          <div>
            <div style={{marginBottom:'24px'}}>
              <h1 style={{margin:'0 0 8px 0',fontSize:'2rem',fontWeight:'600',color:'#1e293b'}}>📋 Launch Schedule</h1>
              <p style={{margin:0,color:'#64748b',fontSize:'1.05rem'}}>High-level customer & payment focused plan (2 days).</p>
            </div>
            <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
              <button 
                style={{...linkBtnStyle, background: '#3b82f6', color: '#ffffff'}}
                onClick={() => navigate('/admin/schedule')}
              >
                Open Detailed Schedule
              </button>
            </div>
          </div>
        );
      case 'planning':
        return (
          <div>
            <div style={{marginBottom:'32px'}}>
              <h1 style={{margin:'0 0 8px 0',fontSize:'2rem',fontWeight:'600',color:'#1e293b'}}>Planning & Operations</h1>
              <p style={{margin:0,color:'#64748b',fontSize:'1.1rem'}}>Your daily command center for development, maintenance, and vertical oversight.</p>
            </div>
            
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginTop:'20px'}}>
              {/* Left: Daily Schedule & Tasks */}
              <div style={{display:'grid',gap:'16px'}}>
                <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                  <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📋 Today's Schedule</h3>
                  <div style={{display:'grid',gap:'12px'}}>
                    <div style={{padding:'16px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <div style={{fontWeight:600,color:'#3b82f6',fontSize:'0.9rem'}}>09:00 - 10:30</div>
                      <div style={{fontWeight:500,color:'#1e293b',margin:'4px 0'}}>Development: Admin Dashboard Polish</div>
                      <div style={{fontSize:'0.875rem',color:'#64748b'}}>Priority: High | Status: In Progress</div>
                    </div>
                    <div style={{padding:'16px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <div style={{fontWeight:600,color:'#3b82f6',fontSize:'0.9rem'}}>11:00 - 12:00</div>
                      <div style={{fontWeight:500,color:'#1e293b',margin:'4px 0'}}>Business: Sales Pipeline Review</div>
                      <div style={{fontSize:'0.875rem',color:'#64748b'}}>Priority: Medium | Status: Planned</div>
                    </div>
                    <div style={{padding:'16px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <div style={{fontWeight:600,color:'#3b82f6',fontSize:'0.9rem'}}>14:00 - 15:30</div>
                      <div style={{fontWeight:500,color:'#1e293b',margin:'4px 0'}}>Marketing: Content Calendar Planning</div>
                      <div style={{fontSize:'0.875rem',color:'#64748b'}}>Priority: Medium | Status: Planned</div>
                    </div>
                    <div style={{padding:'16px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <div style={{fontWeight:600,color:'#3b82f6',fontSize:'0.9rem'}}>16:00 - 17:00</div>
                      <div style={{fontWeight:500,color:'#1e293b',margin:'4px 0'}}>Operations: System Health Check</div>
                      <div style={{fontSize:'0.875rem',color:'#64748b'}}>Priority: High | Status: Scheduled</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'10px',marginTop:'12px'}}>
                    <button style={linkBtnStyle}>Add Task</button>
                    <button 
                      style={{...linkBtnStyle, background: '#3b82f6', color: '#ffffff'}} 
                      onClick={() => navigate('/admin/schedule')}
                    >
                      📋 Detailed Schedule
                    </button>
                    <button 
                      style={{...linkBtnStyle, background: '#22c55e', color: '#ffffff'}}
                      onClick={() => navigate('/admin/content')}
                    >
                      📚 Content Management
                    </button>
                    <button 
                      style={{...linkBtnStyle, background: '#8b5cf6', color: '#ffffff'}}
                      onClick={() => navigate('/admin/progress')}
                    >
                      📊 Child Progress
                    </button>
                    <button 
                      style={linkBtnStyle}
                      onClick={() => navigate('/admin/tracker')}
                    >
                      ⏱️ Time Tracker
                    </button>
                    <button 
                      style={linkBtnStyle}
                      onClick={() => navigate('/admin/projects')}
                    >
                      📊 Project Sheet
                    </button>
                    <button 
                      style={{...linkBtnStyle, background: '#8b5cf6', color: '#ffffff'}}
                      onClick={() => navigate('/admin/launch')}
                    >
                      🚀 Startup Launch
                    </button>
                    <button 
                      style={{...linkBtnStyle, background: '#f59e0b', color: '#ffffff'}}
                      onClick={() => navigate('/admin/comprehensive')}
                    >
                      📊 Comprehensive Dashboard
                    </button>
                  </div>
                </div>

                <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                  <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>🛠️ Development Tasks</h3>
                  <div style={{display:'grid',gap:'10px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f0fdf4',borderRadius:'8px',border:'1px solid #bbf7d0'}}>
                      <span style={{color:'#166534',fontWeight:'500'}}>✅ Admin Dashboard UI Polish</span>
                      <span style={{fontSize:'0.875rem',color:'#16a34a',fontWeight:'500'}}>Done</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#fef3c7',borderRadius:'8px',border:'1px solid #fde68a'}}>
                      <span style={{color:'#92400e',fontWeight:'500'}}>🔄 Notion Integration Setup</span>
                      <span style={{fontSize:'0.875rem',color:'#d97706',fontWeight:'500'}}>In Progress</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f1f5f9',borderRadius:'8px',border:'1px solid #cbd5e1'}}>
                      <span style={{color:'#475569',fontWeight:'500'}}>⏳ Payment Gateway Integration</span>
                      <span style={{fontSize:'0.875rem',color:'#64748b',fontWeight:'500'}}>Planned</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f1f5f9',borderRadius:'8px',border:'1px solid #cbd5e1'}}>
                      <span style={{color:'#475569',fontWeight:'500'}}>📊 Analytics Dashboard</span>
                      <span style={{fontSize:'0.875rem',color:'#64748b',fontWeight:'500'}}>Planned</span>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'10px',marginTop:'12px'}}>
                    <button style={linkBtnStyle}>Add Task</button>
                    <button style={linkBtnStyle}>GitHub Issues</button>
                    <button 
                      style={linkBtnStyle}
                      onClick={() => navigate('/admin/projects')}
                    >
                      📊 Project Sheet
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Weekly Goals & Quick Actions */}
              <div style={{display:'grid',gap:'16px'}}>

                <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                  <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>🎯 Weekly Goals Progress</h3>
                  <div style={{display:'grid',gap:'10px'}}>
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                        <span style={{fontWeight:500,color:'#1e293b'}}>Admin Dashboard Polish</span>
                        <span style={{fontWeight:600,color:'#3b82f6'}}>80%</span>
                      </div>
                      <div style={{width:'100%',height:'8px',background:'#e2e8f0',borderRadius:'4px',overflow:'hidden'}}>
                        <div style={{width:'80%',height:'100%',background:'#3b82f6',borderRadius:'4px'}}></div>
                      </div>
                    </div>
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                        <span style={{fontWeight:500,color:'#1e293b'}}>Sales Pipeline Setup</span>
                        <span style={{fontWeight:600,color:'#3b82f6'}}>60%</span>
                      </div>
                      <div style={{width:'100%',height:'8px',background:'#e2e8f0',borderRadius:'4px',overflow:'hidden'}}>
                        <div style={{width:'60%',height:'100%',background:'#3b82f6',borderRadius:'4px'}}></div>
                      </div>
                    </div>
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                        <span style={{fontWeight:500,color:'#1e293b'}}>Content Calendar</span>
                        <span style={{fontWeight:600,color:'#3b82f6'}}>40%</span>
                      </div>
                      <div style={{width:'100%',height:'8px',background:'#e2e8f0',borderRadius:'4px',overflow:'hidden'}}>
                        <div style={{width:'40%',height:'100%',background:'#3b82f6',borderRadius:'4px'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                  <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>🔗 Quick Actions</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                    <button style={linkBtnStyle}>Deploy to Prod</button>
                    <button style={linkBtnStyle}>Run Tests</button>
                    <button style={linkBtnStyle}>Check Logs</button>
                    <button style={linkBtnStyle}>Backup Data</button>
                    <button style={linkBtnStyle}>Monitor Alerts</button>
                    <button style={linkBtnStyle}>Update Docs</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div>
            <div style={{marginBottom:'32px'}}>
              <h1 style={{margin:'0 0 8px 0',fontSize:'2rem',fontWeight:'600',color:'#1e293b'}}>📋 Detailed Schedule</h1>
              <p style={{margin:0,color:'#64748b',fontSize:'1.1rem'}}>Comprehensive planning for today, this week, and this month.</p>
            </div>

            {/* Schedule View Toggle */}
            <div style={{display:'flex',gap:'12px',marginBottom:'24px',padding:'16px',background:'#ffffff',borderRadius:'12px',border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
              <button 
                style={{
                  ...linkBtnStyle,
                  background: scheduleView === 'daily' ? '#3b82f6' : '#f8fafc',
                  color: scheduleView === 'daily' ? '#ffffff' : '#64748b',
                  fontWeight: scheduleView === 'daily' ? '600' : '500'
                }}
                onClick={() => setScheduleView('daily')}
              >
                📅 Today
              </button>
              <button 
                style={{
                  ...linkBtnStyle,
                  background: scheduleView === 'weekly' ? '#3b82f6' : '#f8fafc',
                  color: scheduleView === 'weekly' ? '#ffffff' : '#64748b',
                  fontWeight: scheduleView === 'weekly' ? '600' : '500'
                }}
                onClick={() => setScheduleView('weekly')}
              >
                📊 This Week
              </button>
              <button 
                style={{
                  ...linkBtnStyle,
                  background: scheduleView === 'monthly' ? '#3b82f6' : '#f8fafc',
                  color: scheduleView === 'monthly' ? '#ffffff' : '#64748b',
                  fontWeight: scheduleView === 'monthly' ? '600' : '500'
                }}
                onClick={() => setScheduleView('monthly')}
              >
                📈 This Month
              </button>
            </div>

            {/* Schedule Content */}
            {scheduleView === 'daily' && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
                {/* Today's Schedule */}
                <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                  <h3 style={{marginTop:0,marginBottom:'20px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📅 Today's Schedule</h3>
                  <div style={{display:'grid',gap:'16px'}}>
                    <div style={{padding:'16px',background:'#fef3c7',borderRadius:'8px',border:'1px solid #fde68a'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                        <div style={{fontWeight:600,color:'#92400e',fontSize:'0.9rem'}}>09:00 - 10:30</div>
                        <span style={{padding:'4px 8px',background:'#f59e0b',color:'#ffffff',borderRadius:'4px',fontSize:'0.75rem',fontWeight:600}}>IN PROGRESS</span>
                      </div>
                      <div style={{fontWeight:500,color:'#1e293b',marginBottom:'4px'}}>Development: Admin Dashboard Polish</div>
                      <div style={{fontSize:'0.875rem',color:'#92400e'}}>Priority: High | Category: Development</div>
                    </div>
                    <div style={{padding:'16px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                        <div style={{fontWeight:600,color:'#3b82f6',fontSize:'0.9rem'}}>11:00 - 12:00</div>
                        <span style={{padding:'4px 8px',background:'#6b7280',color:'#ffffff',borderRadius:'4px',fontSize:'0.75rem',fontWeight:600}}>PLANNED</span>
                      </div>
                      <div style={{fontWeight:500,color:'#1e293b',marginBottom:'4px'}}>Business: Sales Pipeline Review</div>
                      <div style={{fontSize:'0.875rem',color:'#64748b'}}>Priority: Medium | Category: Business</div>
                    </div>
                    <div style={{padding:'16px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                        <div style={{fontWeight:600,color:'#3b82f6',fontSize:'0.9rem'}}>14:00 - 15:30</div>
                        <span style={{padding:'4px 8px',background:'#6b7280',color:'#ffffff',borderRadius:'4px',fontSize:'0.75rem',fontWeight:600}}>PLANNED</span>
                      </div>
                      <div style={{fontWeight:500,color:'#1e293b',marginBottom:'4px'}}>Marketing: Content Calendar Planning</div>
                      <div style={{fontSize:'0.875rem',color:'#64748b'}}>Priority: Medium | Category: Marketing</div>
                    </div>
                    <div style={{padding:'16px',background:'#fef2f2',borderRadius:'8px',border:'1px solid #fecaca'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                        <div style={{fontWeight:600,color:'#dc2626',fontSize:'0.9rem'}}>16:00 - 17:00</div>
                        <span style={{padding:'4px 8px',background:'#ef4444',color:'#ffffff',borderRadius:'4px',fontSize:'0.75rem',fontWeight:600}}>URGENT</span>
                      </div>
                      <div style={{fontWeight:500,color:'#1e293b',marginBottom:'4px'}}>Operations: System Health Check</div>
                      <div style={{fontSize:'0.875rem',color:'#dc2626'}}>Priority: High | Category: Operations</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'10px',marginTop:'16px'}}>
                    <button style={linkBtnStyle}>+ Add Task</button>
                    <button style={linkBtnStyle}>Edit Schedule</button>
                  </div>
                </div>

                {/* Today's Goals & Notes */}
                <div style={{display:'grid',gap:'20px'}}>
                  <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                    <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>🎯 Today's Goals</h3>
                    <div style={{display:'grid',gap:'12px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',background:'#f0fdf4',borderRadius:'8px',border:'1px solid #bbf7d0'}}>
                        <input type="checkbox" style={{transform:'scale(1.2)'}} />
                        <span style={{color:'#166534',fontWeight:500}}>Complete admin dashboard UI polish</span>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',background:'#fef3c7',borderRadius:'8px',border:'1px solid #fde68a'}}>
                        <input type="checkbox" style={{transform:'scale(1.2)'}} />
                        <span style={{color:'#92400e',fontWeight:500}}>Review sales pipeline data</span>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',background:'#f1f5f9',borderRadius:'8px',border:'1px solid #cbd5e1'}}>
                        <input type="checkbox" style={{transform:'scale(1.2)'}} />
                        <span style={{color:'#475569',fontWeight:500}}>Plan content calendar for next week</span>
                      </div>
                    </div>
                  </div>

                  <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                    <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📝 Notes & Ideas</h3>
                    <textarea 
                      style={{
                        width:'100%',
                        height:'120px',
                        padding:'12px',
                        border:'1px solid #e2e8f0',
                        borderRadius:'8px',
                        fontSize:'0.9rem',
                        resize:'vertical',
                        fontFamily:'inherit'
                      }}
                      placeholder="Add notes, ideas, or reminders for today..."
                    />
                    <div style={{display:'flex',gap:'10px',marginTop:'12px'}}>
                      <button style={linkBtnStyle}>Save Notes</button>
                      <button style={linkBtnStyle}>Clear</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {scheduleView === 'weekly' && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
                {/* Weekly Calendar */}
                <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                  <h3 style={{marginTop:0,marginBottom:'20px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📊 This Week's Schedule</h3>
                  <div style={{display:'grid',gap:'8px'}}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                      <div key={day} style={{padding:'16px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                          <h4 style={{margin:0,fontSize:'1rem',fontWeight:600,color:'#1e293b'}}>{day}</h4>
                          <span style={{fontSize:'0.875rem',color:'#64748b'}}>{index + 1} task{index === 0 ? '' : 's'}</span>
                        </div>
                        <div style={{fontSize:'0.875rem',color:'#64748b'}}>
                          {index === 0 ? 'Admin dashboard work, Sales review' : 
                           index === 1 ? 'Content planning, Team meeting' :
                           index === 2 ? 'Development tasks, Client calls' :
                           index === 3 ? 'Marketing review, Operations check' :
                           'Week wrap-up, Planning for next week'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Goals & Progress */}
                <div style={{display:'grid',gap:'20px'}}>
                  <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                    <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>🎯 Weekly Goals</h3>
                    <div style={{display:'grid',gap:'12px'}}>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                          <span style={{fontWeight:500,color:'#1e293b'}}>Complete admin dashboard redesign</span>
                          <span style={{fontWeight:600,color:'#3b82f6'}}>80%</span>
                        </div>
                        <div style={{width:'100%',height:'8px',background:'#e2e8f0',borderRadius:'4px',overflow:'hidden'}}>
                          <div style={{width:'80%',height:'100%',background:'#3b82f6',borderRadius:'4px'}}></div>
                        </div>
                      </div>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                          <span style={{fontWeight:500,color:'#1e293b'}}>Set up sales pipeline tracking</span>
                          <span style={{fontWeight:600,color:'#3b82f6'}}>60%</span>
                        </div>
                        <div style={{width:'100%',height:'8px',background:'#e2e8f0',borderRadius:'4px',overflow:'hidden'}}>
                          <div style={{width:'60%',height:'100%',background:'#3b82f6',borderRadius:'4px'}}></div>
                        </div>
                      </div>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                          <span style={{fontWeight:500,color:'#1e293b'}}>Plan content calendar for next month</span>
                          <span style={{fontWeight:600,color:'#3b82f6'}}>40%</span>
                        </div>
                        <div style={{width:'100%',height:'8px',background:'#e2e8f0',borderRadius:'4px',overflow:'hidden'}}>
                          <div style={{width:'40%',height:'100%',background:'#3b82f6',borderRadius:'4px'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                    <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📈 Weekly Metrics</h3>
                    <div style={{display:'grid',gap:'12px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                        <span style={{fontWeight:500,color:'#1e293b'}}>Tasks Completed</span>
                        <span style={{fontWeight:600,color:'#16a34a'}}>12/15</span>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                        <span style={{fontWeight:500,color:'#1e293b'}}>Hours Worked</span>
                        <span style={{fontWeight:600,color:'#3b82f6'}}>{formatTime(timeTracking.weekHours)}</span>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                        <span style={{fontWeight:500,color:'#1e293b'}}>Goals Achieved</span>
                        <span style={{fontWeight:600,color:'#16a34a'}}>3/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {scheduleView === 'monthly' && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
                {/* Monthly Overview */}
                <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                  <h3 style={{marginTop:0,marginBottom:'20px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📈 This Month's Overview</h3>
                  <div style={{display:'grid',gap:'16px'}}>
                    <div style={{padding:'16px',background:'#f0fdf4',borderRadius:'8px',border:'1px solid #bbf7d0'}}>
                      <h4 style={{margin:'0 0 8px 0',fontSize:'1rem',fontWeight:600,color:'#166534'}}>Week 1: Foundation</h4>
                      <p style={{margin:0,fontSize:'0.875rem',color:'#16a34a'}}>Admin dashboard redesign, system setup</p>
                    </div>
                    <div style={{padding:'16px',background:'#fef3c7',borderRadius:'8px',border:'1px solid #fde68a'}}>
                      <h4 style={{margin:'0 0 8px 0',fontSize:'1rem',fontWeight:600,color:'#92400e'}}>Week 2: Development</h4>
                      <p style={{margin:0,fontSize:'0.875rem',color:'#d97706'}}>Feature implementation, testing</p>
                    </div>
                    <div style={{padding:'16px',background:'#f1f5f9',borderRadius:'8px',border:'1px solid #cbd5e1'}}>
                      <h4 style={{margin:'0 0 8px 0',fontSize:'1rem',fontWeight:600,color:'#475569'}}>Week 3: Marketing</h4>
                      <p style={{margin:0,fontSize:'0.875rem',color:'#64748b'}}>Content creation, campaign planning</p>
                    </div>
                    <div style={{padding:'16px',background:'#f1f5f9',borderRadius:'8px',border:'1px solid #cbd5e1'}}>
                      <h4 style={{margin:'0 0 8px 0',fontSize:'1rem',fontWeight:600,color:'#475569'}}>Week 4: Review</h4>
                      <p style={{margin:0,fontSize:'0.875rem',color:'#64748b'}}>Performance analysis, next month planning</p>
                    </div>
                  </div>
                </div>

                {/* Monthly Goals & KPIs */}
                <div style={{display:'grid',gap:'20px'}}>
                  <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                    <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>🎯 Monthly Goals</h3>
                    <div style={{display:'grid',gap:'12px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',background:'#f0fdf4',borderRadius:'8px',border:'1px solid #bbf7d0'}}>
                        <input type="checkbox" checked style={{transform:'scale(1.2)'}} />
                        <span style={{color:'#166534',fontWeight:500}}>Complete admin dashboard overhaul</span>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',background:'#fef3c7',borderRadius:'8px',border:'1px solid #fde68a'}}>
                        <input type="checkbox" style={{transform:'scale(1.2)'}} />
                        <span style={{color:'#92400e',fontWeight:500}}>Implement sales tracking system</span>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',background:'#f1f5f9',borderRadius:'8px',border:'1px solid #cbd5e1'}}>
                        <input type="checkbox" style={{transform:'scale(1.2)'}} />
                        <span style={{color:'#475569',fontWeight:500}}>Launch content marketing campaign</span>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',background:'#f1f5f9',borderRadius:'8px',border:'1px solid #cbd5e1'}}>
                        <input type="checkbox" style={{transform:'scale(1.2)'}} />
                        <span style={{color:'#475569',fontWeight:500}}>Hire 2 new team members</span>
                      </div>
                    </div>
                  </div>

                  <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                    <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📊 Monthly KPIs</h3>
                    <div style={{display:'grid',gap:'12px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                        <span style={{fontWeight:500,color:'#1e293b'}}>Revenue Growth</span>
                        <span style={{fontWeight:600,color:'#16a34a'}}>+25%</span>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                        <span style={{fontWeight:500,color:'#1e293b'}}>New Customers</span>
                        <span style={{fontWeight:600,color:'#3b82f6'}}>45</span>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                        <span style={{fontWeight:500,color:'#1e293b'}}>Task Completion Rate</span>
                        <span style={{fontWeight:600,color:'#16a34a'}}>92%</span>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                        <span style={{fontWeight:500,color:'#1e293b'}}>Team Productivity</span>
                        <span style={{fontWeight:600,color:'#3b82f6'}}>+18%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Back to Planning Button */}
            <div style={{marginTop:'32px',textAlign:'center'}}>
              <button 
                style={{...linkBtnStyle, background: '#6b7280', color: '#ffffff'}}
                onClick={() => setActiveSection('planning')}
              >
                ← Back to Planning Overview
              </button>
            </div>
          </div>
        );
      case 'timeTracker':
        return (
          <div>
            <div style={{marginBottom:'32px'}}>
              <h1 style={{margin:'0 0 8px 0',fontSize:'2rem',fontWeight:'600',color:'#1e293b'}}>⏱️ Time Tracker</h1>
              <p style={{margin:0,color:'#64748b',fontSize:'1.1rem'}}>Track your Cursor app usage and productivity metrics.</p>
            </div>

            {/* Time Tracking Status */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'24px',marginBottom:'32px'}}>
              <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📅 Today</h3>
                <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
                  <div style={{fontSize:'2rem',fontWeight:700,color:'#3b82f6'}}>{formatTime(timeTracking.todayHours)}</div>
                  <div style={{padding:'4px 8px',background:timeTracking.isTracking ? '#f0fdf4' : '#f1f5f9',color:timeTracking.isTracking ? '#16a34a' : '#64748b',borderRadius:'4px',fontSize:'0.75rem',fontWeight:600}}>
                    {timeTracking.isTracking ? 'TRACKING' : 'IDLE'}
                  </div>
                </div>
                <div style={{fontSize:'0.875rem',color:'#64748b'}}>
                  {timeTracking.isTracking ? 'Session started' : 'No active session'}
                </div>
              </div>

              <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📊 This Week</h3>
                <div style={{fontSize:'2rem',fontWeight:700,color:'#16a34a',marginBottom:'8px'}}>{formatTime(timeTracking.weekHours)}</div>
                <div style={{fontSize:'0.875rem',color:'#64748b'}}>
                  {Math.round(timeTracking.weekHours / 7 * 10) / 10}h average per day
                </div>
              </div>

              <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📈 This Month</h3>
                <div style={{fontSize:'2rem',fontWeight:700,color:'#8b5cf6',marginBottom:'8px'}}>{formatTime(timeTracking.monthHours)}</div>
                <div style={{fontSize:'0.875rem',color:'#64748b'}}>
                  {Math.round(timeTracking.monthHours / 30 * 10) / 10}h average per day
                </div>
              </div>
            </div>

            {/* Manual Controls */}
            <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)',marginBottom:'32px'}}>
              <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>🎮 Manual Controls</h3>
              <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
                <button 
                  style={{
                    ...linkBtnStyle,
                    background: timeTracking.isTracking ? '#ef4444' : '#16a34a',
                    color: '#ffffff',
                    fontWeight: '600'
                  }}
                  onClick={timeTracking.isTracking ? stopTimeTracking : startTimeTracking}
                >
                  {timeTracking.isTracking ? '⏹️ Stop Tracking' : '▶️ Start Tracking'}
                </button>
                <div style={{fontSize:'0.875rem',color:'#64748b'}}>
                  {timeTracking.isTracking ? 'Currently tracking your Cursor usage' : 'Click to start tracking your work time'}
                </div>
              </div>
            </div>

            {/* Daily Sessions History */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
              <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📋 Recent Sessions</h3>
                <div style={{display:'grid',gap:'12px'}}>
                  {Object.entries(timeTracking.dailySessions)
                    .slice(-7)
                    .reverse()
                    .map(([date, data]) => (
                      <div key={date} style={{padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
                          <span style={{fontWeight:500,color:'#1e293b'}}>{new Date(date).toLocaleDateString()}</span>
                          <span style={{fontWeight:600,color:'#3b82f6'}}>{formatTime(data.hours)}</span>
                        </div>
                        <div style={{fontSize:'0.875rem',color:'#64748b'}}>
                          {data.sessions.length} session{data.sessions.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📊 Productivity Insights</h3>
                <div style={{display:'grid',gap:'12px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                    <span style={{fontWeight:500,color:'#1e293b'}}>Most Productive Day</span>
                    <span style={{fontWeight:600,color:'#16a34a'}}>
                      {Object.entries(timeTracking.dailySessions)
                        .sort(([,a], [,b]) => b.hours - a.hours)[0]?.hours ? 
                        formatTime(Math.max(...Object.values(timeTracking.dailySessions).map(d => d.hours))) : 
                        'N/A'}
                    </span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                    <span style={{fontWeight:500,color:'#1e293b'}}>Total Sessions</span>
                    <span style={{fontWeight:600,color:'#3b82f6'}}>
                      {Object.values(timeTracking.dailySessions).reduce((sum, day) => sum + day.sessions.length, 0)}
                    </span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                    <span style={{fontWeight:500,color:'#1e293b'}}>Average Session</span>
                    <span style={{fontWeight:600,color:'#8b5cf6'}}>
                      {Object.values(timeTracking.dailySessions).length > 0 ? 
                        formatTime(Object.values(timeTracking.dailySessions).reduce((sum, day) => sum + day.hours, 0) / Object.values(timeTracking.dailySessions).length) : 
                        'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Planning Button */}
            <div style={{marginTop:'32px',textAlign:'center'}}>
              <button 
                style={{...linkBtnStyle, background: '#6b7280', color: '#ffffff'}}
                onClick={() => setActiveSection('planning')}
              >
                ← Back to Planning Overview
              </button>
            </div>
          </div>
        );
      case 'projectSheet':
        return (
          <div>
            <div style={{marginBottom:'32px'}}>
              <h1 style={{margin:'0 0 8px 0',fontSize:'2rem',fontWeight:'600',color:'#1e293b'}}>📊 Project Sheet</h1>
              <p style={{margin:0,color:'#64748b',fontSize:'1.1rem'}}>Comprehensive project planning and tracking like Google Sheets.</p>
            </div>

            {/* Filters and Controls */}
            <div style={{display:'flex',gap:'16px',marginBottom:'24px',padding:'20px',background:'#ffffff',borderRadius:'12px',border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <label style={{fontWeight:500,color:'#1e293b'}}>Category:</label>
                <select 
                  style={{padding:'6px 12px',border:'1px solid #e2e8f0',borderRadius:'6px',background:'#ffffff'}}
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
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <label style={{fontWeight:500,color:'#1e293b'}}>Status:</label>
                <select 
                  style={{padding:'6px 12px',border:'1px solid #e2e8f0',borderRadius:'6px',background:'#ffffff'}}
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
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <label style={{fontWeight:500,color:'#1e293b'}}>Priority:</label>
                <select 
                  style={{padding:'6px 12px',border:'1px solid #e2e8f0',borderRadius:'6px',background:'#ffffff'}}
                  value={projectSheet.filters.priority}
                  onChange={(e) => setProjectSheet(prev => ({...prev, filters: {...prev.filters, priority: e.target.value}}))}
                >
                  <option value="All">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div style={{marginLeft:'auto',display:'flex',gap:'8px'}}>
                <button style={{...linkBtnStyle, background: '#3b82f6', color: '#ffffff'}}>+ New Project</button>
                <button style={linkBtnStyle}>Export</button>
              </div>
            </div>

            {/* Project Table */}
            <div style={{background:'#ffffff',borderRadius:'12px',border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)',overflow:'hidden'}}>
              {/* Table Header */}
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',gap:'16px',padding:'16px 20px',background:'#f8fafc',borderBottom:'1px solid #e2e8f0',fontWeight:600,color:'#1e293b',fontSize:'0.875rem'}}>
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
                  <div key={project.id} style={{borderBottom:'1px solid #f1f5f9'}}>
                    {/* Main Row */}
                    <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',gap:'16px',padding:'16px 20px',alignItems:'center'}}>
                      <div>
                        <div style={{fontWeight:600,color:'#1e293b',marginBottom:'4px'}}>{project.name}</div>
                        <div style={{fontSize:'0.75rem',color:'#64748b'}}>{project.notes}</div>
                      </div>
                      <div>
                        <span style={{padding:'4px 8px',background:'#f1f5f9',color:'#475569',borderRadius:'4px',fontSize:'0.75rem',fontWeight:500}}>
                          {project.category}
                        </span>
                      </div>
                      <div>
                        <span style={{
                          padding:'4px 8px',
                          background: project.priority === 'High' ? '#fef2f2' : project.priority === 'Medium' ? '#fef3c7' : '#f0fdf4',
                          color: project.priority === 'High' ? '#dc2626' : project.priority === 'Medium' ? '#d97706' : '#16a34a',
                          borderRadius:'4px',
                          fontSize:'0.75rem',
                          fontWeight:500
                        }}>
                          {project.priority}
                        </span>
                      </div>
                      <div>
                        <span style={{
                          padding:'4px 8px',
                          background: project.status === 'Completed' ? '#f0fdf4' : project.status === 'In Progress' ? '#fef3c7' : '#f1f5f9',
                          color: project.status === 'Completed' ? '#16a34a' : project.status === 'In Progress' ? '#d97706' : '#64748b',
                          borderRadius:'4px',
                          fontSize:'0.75rem',
                          fontWeight:500
                        }}>
                          {project.status}
                        </span>
                      </div>
                      <div>
                        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                          <div style={{width:'60px',height:'6px',background:'#e2e8f0',borderRadius:'3px',overflow:'hidden'}}>
                            <div style={{width:`${project.progress}%`,height:'100%',background:'#3b82f6',borderRadius:'3px'}}></div>
                          </div>
                          <span style={{fontSize:'0.75rem',fontWeight:600,color:'#1e293b'}}>{project.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:'0.875rem',fontWeight:500,color:'#1e293b'}}>{project.actualHours}h / {project.estimatedHours}h</div>
                        <div style={{fontSize:'0.75rem',color:'#64748b'}}>
                          {Math.round((project.actualHours / project.estimatedHours) * 100)}% complete
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:'0.75rem',color:'#64748b'}}>
                          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                        </div>
                        <div style={{fontSize:'0.75rem',color:'#64748b'}}>
                          {Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                        </div>
                      </div>
                      <div style={{display:'flex',gap:'4px'}}>
                        <button style={{...linkBtnStyle, padding:'4px 8px', fontSize:'0.75rem'}}>View</button>
                        <button style={{...linkBtnStyle, padding:'4px 8px', fontSize:'0.75rem'}}>Edit</button>
                      </div>
                    </div>

                    {/* Expanded Details Row */}
                    <div style={{padding:'0 20px 16px 20px',background:'#f8fafc'}}>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'20px'}}>
                        {/* Steps */}
                        <div>
                          <h4 style={{margin:'0 0 8px 0',fontSize:'0.875rem',fontWeight:600,color:'#1e293b'}}>Steps & Tasks</h4>
                          <div style={{display:'grid',gap:'6px'}}>
                            {project.steps.slice(0, 3).map(step => (
                              <div key={step.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 8px',background:'#ffffff',borderRadius:'4px',border:'1px solid #e2e8f0'}}>
                                <div style={{fontSize:'0.75rem',color:'#1e293b'}}>{step.task}</div>
                                <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
                                  <span style={{fontSize:'0.7rem',color:'#64748b'}}>{step.actualTime}/{step.estimatedTime}</span>
                                  <span style={{
                                    padding:'2px 4px',
                                    background: step.status === 'Completed' ? '#f0fdf4' : step.status === 'In Progress' ? '#fef3c7' : '#f1f5f9',
                                    color: step.status === 'Completed' ? '#16a34a' : step.status === 'In Progress' ? '#d97706' : '#64748b',
                                    borderRadius:'2px',
                                    fontSize:'0.65rem'
                                  }}>
                                    {step.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {project.steps.length > 3 && (
                              <div style={{fontSize:'0.7rem',color:'#64748b',textAlign:'center',padding:'4px'}}>
                                +{project.steps.length - 3} more steps
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dependencies & Deliverables */}
                        <div>
                          <h4 style={{margin:'0 0 8px 0',fontSize:'0.875rem',fontWeight:600,color:'#1e293b'}}>Dependencies</h4>
                          <div style={{display:'flex',flexWrap:'wrap',gap:'4px',marginBottom:'12px'}}>
                            {project.dependencies.map((dep, idx) => (
                              <span key={idx} style={{padding:'2px 6px',background:'#e2e8f0',color:'#475569',borderRadius:'3px',fontSize:'0.7rem'}}>
                                {dep}
                              </span>
                            ))}
                          </div>
                          <h4 style={{margin:'0 0 8px 0',fontSize:'0.875rem',fontWeight:600,color:'#1e293b'}}>Deliverables</h4>
                          <div style={{display:'flex',flexWrap:'wrap',gap:'4px'}}>
                            {project.deliverables.map((del, idx) => (
                              <span key={idx} style={{padding:'2px 6px',background:'#dbeafe',color:'#1e40af',borderRadius:'3px',fontSize:'0.7rem'}}>
                                {del}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Risks & Results */}
                        <div>
                          <h4 style={{margin:'0 0 8px 0',fontSize:'0.875rem',fontWeight:600,color:'#1e293b'}}>Risks</h4>
                          <div style={{display:'flex',flexWrap:'wrap',gap:'4px',marginBottom:'12px'}}>
                            {project.risks.map((risk, idx) => (
                              <span key={idx} style={{padding:'2px 6px',background:'#fef2f2',color:'#dc2626',borderRadius:'3px',fontSize:'0.7rem'}}>
                                {risk}
                              </span>
                            ))}
                          </div>
                          <h4 style={{margin:'0 0 8px 0',fontSize:'0.875rem',fontWeight:600,color:'#1e293b'}}>Expected Results</h4>
                          <div style={{fontSize:'0.75rem',color:'#64748b',lineHeight:'1.4'}}>
                            {project.steps.map(step => step.result).join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Summary Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:'16px',marginTop:'24px'}}>
              <div style={{padding:'16px',background:'#ffffff',borderRadius:'8px',border:'1px solid #e2e8f0',textAlign:'center'}}>
                <div style={{fontSize:'1.5rem',fontWeight:700,color:'#3b82f6'}}>
                  {projectSheet.projects.length}
                </div>
                <div style={{fontSize:'0.875rem',color:'#64748b'}}>Total Projects</div>
              </div>
              <div style={{padding:'16px',background:'#ffffff',borderRadius:'8px',border:'1px solid #e2e8f0',textAlign:'center'}}>
                <div style={{fontSize:'1.5rem',fontWeight:700,color:'#16a34a'}}>
                  {projectSheet.projects.filter(p => p.status === 'Completed').length}
                </div>
                <div style={{fontSize:'0.875rem',color:'#64748b'}}>Completed</div>
              </div>
              <div style={{padding:'16px',background:'#ffffff',borderRadius:'8px',border:'1px solid #e2e8f0',textAlign:'center'}}>
                <div style={{fontSize:'1.5rem',fontWeight:700,color:'#d97706'}}>
                  {projectSheet.projects.filter(p => p.status === 'In Progress').length}
                </div>
                <div style={{fontSize:'0.875rem',color:'#64748b'}}>In Progress</div>
              </div>
              <div style={{padding:'16px',background:'#ffffff',borderRadius:'8px',border:'1px solid #e2e8f0',textAlign:'center'}}>
                <div style={{fontSize:'1.5rem',fontWeight:700,color:'#8b5cf6'}}>
                  {Math.round(projectSheet.projects.reduce((sum, p) => sum + p.progress, 0) / projectSheet.projects.length)}%
                </div>
                <div style={{fontSize:'0.875rem',color:'#64748b'}}>Avg Progress</div>
              </div>
            </div>

            {/* Back to Planning Button */}
            <div style={{marginTop:'32px',textAlign:'center'}}>
              <button 
                style={{...linkBtnStyle, background: '#6b7280', color: '#ffffff'}}
                onClick={() => setActiveSection('planning')}
              >
                ← Back to Planning Overview
              </button>
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div>
            <div style={{marginBottom:'32px'}}>
              <h1 style={{margin:'0 0 8px 0',fontSize:'2rem',fontWeight:'600',color:'#1e293b'}}>Overview Dashboard</h1>
              <p style={{margin:0,color:'#64748b',fontSize:'1.1rem'}}>Complete system overview and health monitoring.</p>
            </div>
            
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
              {/* Left: System Overview */}
              <div style={{display:'grid',gap:'20px'}}>
                <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                  <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📊 System Status</h3>
                  <div style={{display:'grid',gap:'12px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <div>
                        <div style={{fontWeight:500,color:'#1e293b'}}>Active Users</div>
                        <div style={{fontSize:'0.875rem',color:'#64748b'}}>Last 24 hours</div>
                      </div>
                      <div style={{fontSize:'1.5rem',fontWeight:700,color:'#3b82f6'}}>—</div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <div>
                        <div style={{fontWeight:500,color:'#1e293b'}}>Learning Plans Generated</div>
                        <div style={{fontSize:'0.875rem',color:'#64748b'}}>This week</div>
                      </div>
                      <div style={{fontSize:'1.5rem',fontWeight:700,color:'#3b82f6'}}>—</div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <div>
                        <div style={{fontWeight:500,color:'#1e293b'}}>System Uptime</div>
                        <div style={{fontSize:'0.875rem',color:'#64748b'}}>Last 30 days</div>
                      </div>
                      <div style={{fontSize:'1.5rem',fontWeight:700,color:'#16a34a'}}>99.9%</div>
                    </div>
                  </div>
                </div>

                <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                  <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>🔗 Quick Actions</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                    <button style={linkBtnStyle}>View All Users</button>
                    <button style={linkBtnStyle}>System Logs</button>
                    <button style={linkBtnStyle}>Backup Data</button>
                    <button style={linkBtnStyle}>Run Diagnostics</button>
                    <button style={linkBtnStyle}>Update System</button>
                    <button style={linkBtnStyle}>Export Reports</button>
                  </div>
                </div>
              </div>

              {/* Right: Vertical Health Overview */}
              <div style={{display:'grid',gap:'20px'}}>
                <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                  <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📊 Vertical Health Overview</h3>
                  <div style={{display:'grid',gap:'12px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px',background:'#f0fdf4',borderRadius:'8px',border:'1px solid #bbf7d0'}}>
                      <div>
                        <div style={{fontWeight:600,color:'#166534'}}>💰 Sales & Orders</div>
                        <div style={{fontSize:'0.875rem',color:'#16a34a'}}>All systems operational</div>
                      </div>
                      <div style={{color:'#16a34a',fontSize:'1.25rem'}}>✅</div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px',background:'#fef3c7',borderRadius:'8px',border:'1px solid #fde68a'}}>
                      <div>
                        <div style={{fontWeight:600,color:'#92400e'}}>👥 Customers</div>
                        <div style={{fontSize:'0.875rem',color:'#d97706'}}>3 pending support tickets</div>
                      </div>
                      <div style={{color:'#d97706',fontSize:'1.25rem'}}>⚠️</div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px',background:'#f0fdf4',borderRadius:'8px',border:'1px solid #bbf7d0'}}>
                      <div>
                        <div style={{fontWeight:600,color:'#166534'}}>⚙️ Operations</div>
                        <div style={{fontSize:'0.875rem',color:'#16a34a'}}>Running smoothly</div>
                      </div>
                      <div style={{color:'#16a34a',fontSize:'1.25rem'}}>✅</div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px',background:'#fef2f2',borderRadius:'8px',border:'1px solid #fecaca'}}>
                      <div>
                        <div style={{fontWeight:600,color:'#dc2626'}}>📈 Finance</div>
                        <div style={{fontSize:'0.875rem',color:'#ef4444'}}>Payment processing issues</div>
                      </div>
                      <div style={{color:'#ef4444',fontSize:'1.25rem'}}>🚨</div>
                    </div>
                  </div>
                </div>

                <div style={{padding:'24px',border:'1px solid #e2e8f0',borderRadius:'12px',background:'#ffffff',boxShadow:'0 1px 3px rgba(0, 0, 0, 0.1)'}}>
                  <h3 style={{marginTop:0,marginBottom:'16px',fontSize:'1.25rem',fontWeight:'600',color:'#1e293b'}}>📈 Key Metrics</h3>
                  <div style={{display:'grid',gap:'12px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <span style={{fontWeight:500,color:'#1e293b'}}>Monthly Revenue</span>
                      <span style={{fontWeight:600,color:'#3b82f6'}}>₹ —</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <span style={{fontWeight:500,color:'#1e293b'}}>New Customers</span>
                      <span style={{fontWeight:600,color:'#3b82f6'}}>—</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <span style={{fontWeight:500,color:'#1e293b'}}>Churn Rate</span>
                      <span style={{fontWeight:600,color:'#3b82f6'}}>—%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'warehouse':
        return <OrderManagement />;
      case 'business':
        // Reuse UnifiedDashboard as business overview for now
        return <UnifiedDashboard />;
      case 'users':
        return (
          <div style={adminTableStyle}>
            {users.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#f1f2f6',
                fontSize: '1.1rem'
              }}>
                No users found. This might be due to database connection issues or no users have been created yet.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={adminTableHeaderStyle}>User</th>
                    <th style={adminTableHeaderStyle}>Email</th>
                    <th style={adminTableHeaderStyle}>Role</th>
                    <th style={adminTableHeaderStyle}>Member Since</th>
                    <th style={adminTableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td style={adminTableCellStyle}>
                        {user.profile?.firstName && user.profile?.lastName 
                          ? `${user.profile.firstName} ${user.profile.lastName}`
                          : user.displayName || 'No name set'
                        }
                      </td>
                      <td style={adminTableCellStyle}>{user.email}</td>
                      <td style={adminTableCellStyle}>
                        <span style={adminRoleBadgeStyle(user.role || 'parent')}>
                          {user.role || 'parent'}
                        </span>
                      </td>
                      <td style={adminTableCellStyle}>
                        {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={adminTableCellStyle}>
                        {user.role === 'parent' ? (
                          <button
                            onClick={() => handleRoleChange(user.id, 'admin')}
                            style={adminButtonStyle()}
                            disabled={user.id === currentUser?.uid}
                          >
                            Promote to Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(user.id, 'parent')}
                            style={adminButtonStyle('danger')}
                            disabled={user.id === currentUser?.uid}
                          >
                            Demote to Parent
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case 'dev':
        return <DevDashboard />;
      case 'inventory':
        return <InventoryDashboard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'content-builder':
        return <ContentBuilder />;
      default:
        return <UnifiedDashboard />;
    }
  };

  return (
    <div style={adminContainerStyle}>
      {/* Floating hamburger when sidebar is closed */}
      {!sidebarOpen && (
        <button 
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            ...burgerButtonStyle
          }} 
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      <div style={sidebarStyle}>
        <div style={sidebarHeaderStyle}>
          {sidebarOpen && <div style={{fontWeight: 700, letterSpacing: '0.5px', color: '#1e293b', fontSize: '0.9rem'}}>Admin Panel</div>}
          {sidebarOpen && (
            <button style={burgerButtonStyle} onClick={() => setSidebarOpen(false)}>
              ✕
            </button>
          )}
        </div>
        {sidebarGroups.map(group => (
          <div key={group.label}>
            {sidebarOpen && (
              <div style={{
                padding: '8px 10px',
                opacity: 0.8,
                fontSize: '0.8rem',
                letterSpacing: '1px'
              }}>{group.label.toUpperCase()}</div>
            )}
            {group.items.map(v => (
              <button 
                key={v.key} 
                style={navButtonStyle(activeTab === v.tab && activeSection === v.key)} 
                onClick={() => {
                  // Handle navigation for specific items
                  if (v.key === 'content') {
                    navigate('/admin/content');
                  } else if (v.key === 'progress') {
                    navigate('/admin/progress');
                  } else if (v.key === 'schedule') {
                    navigate('/admin/schedule');
                  } else if (v.key === 'agents') {
                    navigate('/admin/agents');
                  } else if (v.key === 'agents-streamlined') {
                    navigate('/admin/agents-streamlined');
                  } else if (v.key === 'comprehensive') {
                    navigate('/admin/comprehensive');
                  } else if (v.key === 'child-activity') {
                    navigate('/admin/child-activity');
                  } else if (v.key === 'ultimate') {
                    navigate('/admin/ultimate');
                  } else {
                    setActiveTab(v.tab); 
                    setActiveSection(v.key);
                  }
                }}
              >
                <span style={{fontSize: '1.1rem'}}>{v.icon}</span>
                {sidebarOpen && <span>{v.label}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div style={{flex: 1}}>

      {message.text && (
        <div style={{
          ...adminMessageStyle,
          background: message.type === 'success' 
            ? 'rgba(46, 213, 115, 0.2)' 
            : 'rgba(255, 71, 87, 0.2)',
          borderColor: message.type === 'success' 
            ? 'rgba(46, 213, 115, 0.4)' 
            : 'rgba(255, 71, 87, 0.4)',
          color: message.type === 'success' ? '#2ed573' : '#ff4757'
        }}>
          {message.text}
          <button 
            onClick={() => setMessage({ type: '', text: '' })}
            style={{
              marginLeft: '1rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Dismiss
          </button>
        </div>
      )}

        <div style={adminContentStyle}>
          {activeSection === 'brand' ? (
            <div>
              <h2 style={{marginTop:0}}>📣 Brand, Communications & Community</h2>
              <p style={{opacity:0.85}}>Operate your brand, PR, and social in one place. This is a working dashboard you can refine later.</p>

              <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:'18px',alignItems:'start'}}>
                {/* Left column: Content & Campaigns */}
                <div style={{display:'grid',gap:'14px'}}>
                  <div style={{padding:'16px',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'14px',background:'rgba(255,255,255,0.04)'}}>
                    <h3 style={{marginTop:0}}>🗓️ Editorial Calendar (This Week)</h3>
                    <ul style={{lineHeight:'1.8'}}>
                      <li>Mon: Blog – “Unschooling vs Traditional Schooling”</li>
                      <li>Wed: Short – “1-minute learning ritual for kids”</li>
                      <li>Fri: Newsletter – “Parent wins + weekend plan”</li>
                    </ul>
                    <div style={{display:'flex',gap:'10px',marginTop:'8px'}}>
                      <button style={linkBtnStyle}>Open Calendar</button>
                      <button style={linkBtnStyle}>Ideas Backlog</button>
                    </div>
      </div>

                  <div style={{padding:'16px',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'14px',background:'rgba(255,255,255,0.04)'}}>
                    <h3 style={{marginTop:0}}>📦 Content Pipeline</h3>
                    <table style={{width:'100%',borderCollapse:'collapse'}}>
                      <thead>
                        <tr>
                          <th style={{textAlign:'left',padding:'8px 6px'}}>Title</th>
                          <th style={{textAlign:'left',padding:'8px 6px'}}>Channel</th>
                          <th style={{textAlign:'left',padding:'8px 6px'}}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{padding:'8px 6px'}}>Parent guide: “Starter Kit for Unschooling”</td>
                          <td style={{padding:'8px 6px'}}>Blog / PDF</td>
                          <td style={{padding:'8px 6px'}}><span className="status-badge inprogress">In Progress</span></td>
                        </tr>
                        <tr>
                          <td style={{padding:'8px 6px'}}>Testimonial montage – Semester 1</td>
                          <td style={{padding:'8px 6px'}}>YouTube/Shorts</td>
                          <td style={{padding:'8px 6px'}}><span className="status-badge planned">Planned</span></td>
                        </tr>
                        <tr>
                          <td style={{padding:'8px 6px'}}>Lead magnet: “7-day home learning plan”</td>
                          <td style={{padding:'8px 6px'}}>Newsletter</td>
                          <td style={{padding:'8px 6px'}}><span className="status-badge review">Review</span></td>
                        </tr>
                      </tbody>
                    </table>
                    <div style={{display:'flex',gap:'10px',marginTop:'8px'}}>
                      <button style={linkBtnStyle}>New Item</button>
                      <button style={linkBtnStyle}>Templates</button>
                    </div>
                  </div>

                  <div style={{padding:'16px',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'14px',background:'rgba(255,255,255,0.04)'}}>
                    <h3 style={{marginTop:0}}>📣 Campaigns</h3>
                    <ul style={{lineHeight:'1.8'}}>
                      <li>Back-to-school promo – Pending assets</li>
                      <li>Parent webinar – Schedule + registration link</li>
                      <li>Referral push – Creative + CTA</li>
                    </ul>
                    <div style={{display:'flex',gap:'10px',marginTop:'8px'}}>
                      <button style={linkBtnStyle}>Campaign Board</button>
                      <button style={linkBtnStyle}>UTM Builder</button>
                    </div>
                  </div>
                </div>

                {/* Right column: KPIs & Assets */}
                <div style={{display:'grid',gap:'14px'}}>
                  <div style={cardStyle}>
                    <div style={{opacity:0.8}}>Weekly Reach</div>
                    <div style={{fontSize:'1.6rem',fontWeight:900}}>—</div>
                  </div>
                  <div style={cardStyle}>
                    <div style={{opacity:0.8}}>Newsletter Subs</div>
                    <div style={{fontSize:'1.6rem',fontWeight:900}}>—</div>
                  </div>
                  <div style={cardStyle}>
                    <div style={{opacity:0.8}}>Lead Magnet CVR</div>
                    <div style={{fontSize:'1.6rem',fontWeight:900}}>—%</div>
                  </div>

                  <div style={{padding:'16px',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'14px',background:'rgba(255,255,255,0.04)'}}>
                    <h3 style={{marginTop:0}}>🧰 Brand Assets</h3>
                    <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                      <button style={linkBtnStyle}>Logo & Colors</button>
                      <button style={linkBtnStyle}>Messaging</button>
                      <button style={linkBtnStyle}>Press Kit</button>
                      <button style={linkBtnStyle}>Social Profiles</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
