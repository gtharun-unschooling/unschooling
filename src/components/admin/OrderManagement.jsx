import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaBox, 
  FaTruck, 
  FaClipboardList, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaUser,
  FaChild,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaRecycle,
  FaHome,
  FaShoppingCart,
  FaPrint,
  FaDownload,
  FaArrowLeft,
  FaPlay,
  FaInfo,
  FaSearch,
  FaFilter,
  FaSort,
  FaCheck,
  FaTimes,
  FaEdit,
  FaEye,
  FaTrash,
  FaPlus,
  FaLayerGroup,
  FaChartBar
} from 'react-icons/fa';
import './OrderManagement.css';

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load mock orders data
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: {
            name: 'Arjun Kumar',
            email: 'arjun@example.com',
            phone: '+91 98765 43210',
            address: '123 Learning Street, Mumbai, Maharashtra 400001'
          },
          children: [
            { name: 'Riya', age: 7, learningLevel: 'intermediate' },
            { name: 'Arnav', age: 5, learningLevel: 'beginner' }
          ],
          plan: {
            name: 'Monthly Premium Plan',
            price: 17999,
            duration: '4 weeks'
          },
          status: 'pending',
          orderDate: '2025-08-12',
          deliveryDate: '2025-08-17',
          customization: ['Extra art supplies', 'Science experiment materials'],
          materials: {
            warehouse: ['Pencils', 'Paper', 'Scissors', 'Glue', 'Art supplies'],
            home: ['Water', 'Food coloring', 'Baking soda', 'Vinegar'],
            consumable: ['Paper', 'Glue sticks', 'Markers'],
            reusable: ['Scissors', 'Rulers', 'Containers']
          },
          priority: 'high',
          notes: 'Customer requested early delivery for birthday'
        },
        {
          id: 'ORD-002',
          customer: {
            name: 'Priya Sharma',
            email: 'priya@example.com',
            phone: '+91 98765 43211',
            address: '456 Education Road, Delhi, Delhi 110001'
          },
          children: [
            { name: 'Aarav', age: 9, learningLevel: 'advanced' }
          ],
          plan: {
            name: 'Weekly Premium Plan',
            price: 4999,
            duration: '4 weeks'
          },
          status: 'processing',
          orderDate: '2025-08-11',
          deliveryDate: '2025-08-16',
          customization: ['Digital learning resources', 'Parent guide materials'],
          materials: {
            warehouse: ['Advanced worksheets', 'Science kits', 'Art materials'],
            home: ['Computer/tablet', 'Internet connection'],
            consumable: ['Worksheets', 'Art paper', 'Science materials'],
            reusable: ['Science equipment', 'Art tools']
          },
          priority: 'medium',
          notes: 'Standard processing'
        },
        {
          id: 'ORD-003',
          customer: {
            name: 'Rajesh Patel',
            email: 'rajesh@example.com',
            phone: '+91 98765 43212',
            address: '789 Knowledge Lane, Bangalore, Karnataka 560001'
          },
          children: [
            { name: 'Diya', age: 6, learningLevel: 'beginner' },
            { name: 'Vihaan', age: 8, learningLevel: 'intermediate' }
          ],
          plan: {
            name: 'Monthly Basic Plan',
            price: 10999,
            duration: '4 weeks'
          },
          status: 'ready',
          orderDate: '2025-08-10',
          deliveryDate: '2025-08-15',
          customization: ['Basic materials only'],
          materials: {
            warehouse: ['Basic worksheets', 'Simple art supplies', 'Learning tools'],
            home: ['Basic household items'],
            consumable: ['Worksheets', 'Art paper'],
            reusable: ['Basic tools', 'Containers']
          },
          priority: 'low',
          notes: 'Ready for pickup'
        }
      ];
      setOrders([]);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || order.status === statusFilter;
      const matchesDate = !dateFilter || order.orderDate === dateFilter;
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'orderDate' || sortBy === 'deliveryDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'ready': return 'green';
      case 'shipped': return 'purple';
      case 'delivered': return 'green';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock />;
      case 'processing': return <FaClipboardList />;
      case 'ready': return <FaBox />;
      case 'shipped': return <FaTruck />;
      case 'delivered': return <FaCheckCircle />;
      default: return <FaClock />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Update selected order if it's the one being modified
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders(prev => prev.map(order => 
        selectedOrders.includes(order.id) 
          ? { ...order, status: bulkAction }
          : order
      ));
      
      setSelectedOrders([]);
      setBulkAction('');
      alert(`Successfully updated ${selectedOrders.length} orders to ${bulkAction} status`);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Failed to perform bulk action. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Status', 'Order Date', 'Delivery Date', 'Plan', 'Price'],
      ...filteredOrders.map(order => [
        order.id,
        order.customer.name,
        order.status,
        order.orderDate,
        order.deliveryDate,
        order.plan.name,
        `₹${order.plan.price.toLocaleString()}`
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderOrders = () => (
    <div className="orders-section">
      <div className="orders-header">
        <h2>📦 Customer Orders</h2>
        <div className="orders-stats">
          <div className="stat-item">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{filteredOrders.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{filteredOrders.filter(o => o.status === 'pending').length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Processing</span>
            <span className="stat-value">{filteredOrders.filter(o => o.status === 'processing').length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Ready</span>
            <span className="stat-value">{filteredOrders.filter(o => o.status === 'ready').length}</span>
          </div>
        </div>
      </div>

      <div className="orders-controls">
        <div className="search-filters">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Dates</option>
            <option value="2025-08-12">Today</option>
            <option value="2025-08-11">Yesterday</option>
            <option value="2025-08-10">2 days ago</option>
          </select>
        </div>
        
        <div className="sort-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="orderDate">Order Date</option>
            <option value="deliveryDate">Delivery Date</option>
            <option value="customer.name">Customer Name</option>
            <option value="plan.price">Price</option>
          </select>
          
          <button 
            className={`sort-btn ${sortOrder === 'asc' ? 'asc' : 'desc'}`}
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            <FaSort />
          </button>
        </div>
      </div>

      {selectedOrders.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-info">
            <span>{selectedOrders.length} orders selected</span>
            <button 
              className="btn-clear"
              onClick={() => setSelectedOrders([])}
            >
              <FaTimes /> Clear
            </button>
          </div>
          
          <div className="bulk-controls">
            <select 
              value={bulkAction} 
              onChange={(e) => setBulkAction(e.target.value)}
              className="bulk-select"
            >
              <option value="">Select Action</option>
              <option value="processing">Mark as Processing</option>
              <option value="ready">Mark as Ready</option>
              <option value="shipped">Mark as Shipped</option>
              <option value="delivered">Mark as Delivered</option>
            </select>
            
            <button 
              className="btn-primary"
              onClick={handleBulkAction}
              disabled={!bulkAction || isLoading}
            >
              {isLoading ? <div className="spinner"></div> : <FaLayerGroup />}
              Apply to {selectedOrders.length} Orders
            </button>
          </div>
        </div>
      )}
      
      <div className="orders-grid">
        {filteredOrders.map((order) => (
          <div key={order.id} className={`order-card ${selectedOrders.includes(order.id) ? 'selected' : ''}`}>
            <div className="order-selection">
              <input
                type="checkbox"
                checked={selectedOrders.includes(order.id)}
                onChange={() => toggleOrderSelection(order.id)}
              />
            </div>
            
            <div className="order-header">
              <h3>{order.id}</h3>
              <div className="order-badges">
                <span className={`status-badge ${order.status}`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className={`priority-badge ${order.priority}`}>
                  {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="order-customer">
              <h4><FaUser /> {order.customer.name}</h4>
              <p><FaEnvelope /> {order.customer.email}</p>
              <p><FaPhone /> {order.customer.phone}</p>
              <p><FaMapMarkerAlt /> {order.customer.address}</p>
            </div>
            
            <div className="order-children">
              <h4><FaChild /> Children ({order.children.length})</h4>
              {order.children.map((child, index) => (
                <div key={index} className="child-info">
                  <span>{child.name} ({child.age} years)</span>
                  <span className="level-badge">{child.learningLevel}</span>
                </div>
              ))}
            </div>
            
            <div className="order-plan">
              <h4>📋 Plan Details</h4>
              <p><strong>{order.plan.name}</strong></p>
              <p>₹{order.plan.price.toLocaleString()} • {order.plan.duration}</p>
            </div>
            
            <div className="order-dates">
              <p><FaCalendarAlt /> Order: {order.orderDate}</p>
              <p><FaTruck /> Delivery: {order.deliveryDate}</p>
            </div>
            
            {order.notes && (
              <div className="order-notes">
                <h4><FaInfo /> Notes</h4>
                <p>{order.notes}</p>
              </div>
            )}
            
            <div className="order-actions">
              <button 
                className="btn-primary"
                onClick={() => setSelectedOrder(order)}
              >
                <FaEye /> View Details
              </button>
              
              {order.status === 'pending' && (
                <button 
                  className="btn-secondary"
                  onClick={() => updateOrderStatus(order.id, 'processing')}
                  disabled={isLoading}
                >
                  <FaPlay /> Start Processing
                </button>
              )}
              
              {order.status === 'processing' && (
                <button 
                  className="btn-success"
                  onClick={() => updateOrderStatus(order.id, 'ready')}
                  disabled={isLoading}
                >
                  <FaCheck /> Mark Ready
                </button>
              )}
              
              {order.status === 'ready' && (
                <button 
                  className="btn-warning"
                  onClick={() => updateOrderStatus(order.id, 'shipped')}
                  disabled={isLoading}
                >
                  <FaTruck /> Mark Shipped
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredOrders.length === 0 && !isLoading && (
        <div className="no-orders">
          <FaBox />
          <h3>No orders found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
      
      <div className="orders-footer">
        <div className="footer-actions">
          <button className="btn-secondary" onClick={exportOrders}>
            <FaDownload /> Export Orders
          </button>
          <button className="btn-secondary">
            <FaPrint /> Print Summary
          </button>
        </div>
        
        <div className="footer-info">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
        </div>
      </div>
    </div>
  );

  const renderKitPreparation = () => (
    <div className="kit-preparation">
      <h2>🏭 Kit Preparation</h2>
      <div className="preparation-stats">
        <div className="stat-box">
          <h4>Pending Kits</h4>
          <p>{orders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="stat-box">
          <h4>In Progress</h4>
          <p>{orders.filter(o => o.status === 'processing').length}</p>
        </div>
        <div className="stat-box">
          <h4>Ready to Ship</h4>
          <p>{orders.filter(o => o.status === 'ready').length}</p>
        </div>
      </div>
      
      <div className="preparation-queue">
        <h3>Kit Preparation Queue</h3>
        {orders.filter(o => o.status === 'pending' || o.status === 'processing').map((order) => (
          <div key={order.id} className="kit-item">
            <div className="kit-header">
              <h4>{order.id} - {order.customer.name}</h4>
              <span className={`status-badge ${order.status}`}>
                {getStatusIcon(order.status)}
                {order.status}
              </span>
            </div>
            
            <div className="kit-materials">
              <h5>Materials Required:</h5>
              <div className="materials-grid">
                <div className="material-category">
                  <h6><FaBox /> Warehouse Items</h6>
                  <ul>
                    {order.materials.warehouse.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="material-category">
                  <h6><FaHome /> Home Items</h6>
                  <ul>
                    {order.materials.home.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="material-category">
                  <h6><FaShoppingCart /> Consumable Items</h6>
                  <ul>
                    {order.materials.consumable.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="material-category">
                  <h6><FaRecycle /> Reusable Items</h6>
                  <ul>
                    {order.materials.reusable.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="kit-actions">
              <button 
                className="btn-primary"
                onClick={() => updateOrderStatus(order.id, 'ready')}
                disabled={order.status !== 'processing'}
              >
                Mark Kit Ready
              </button>
              <button className="btn-secondary">
                <FaPrint /> Print Packing List
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWarehouseStatus = () => (
    <div className="warehouse-status">
      <h2>🏭 Warehouse Status</h2>
      
      <div className="warehouse-overview">
        <div className="overview-card">
          <h3>📦 Total Orders</h3>
          <p className="number">{orders.length}</p>
        </div>
        <div className="overview-card">
          <h3>⏳ Pending</h3>
          <p className="number pending">{orders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="overview-card">
          <h3>🔄 Processing</h3>
          <p className="number processing">{orders.filter(o => o.status === 'processing').length}</p>
        </div>
        <div className="overview-card">
          <h3>✅ Ready</h3>
          <p className="number ready">{orders.filter(o => o.status === 'ready').length}</p>
        </div>
      </div>
      
      <div className="warehouse-alerts">
        <h3>🚨 Warehouse Alerts</h3>
        <div className="alert-item warning">
          <FaExclamationTriangle />
          <span>Low stock on art supplies - Reorder needed</span>
        </div>
        <div className="alert-item info">
          <FaInfo />
          <span>5 kits ready for shipping today</span>
        </div>
        <div className="alert-item success">
          <FaCheckCircle />
          <span>All pending orders have materials available</span>
        </div>
      </div>
    </div>
  );

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;
    
    return (
      <div className="order-details-modal-overlay" onClick={() => setSelectedOrder(null)}>
        <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title">
              <h2>Order Details: {selectedOrder.id}</h2>
              <span className="order-status-badge">
                {getStatusIcon(selectedOrder.status)}
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </span>
            </div>
            <div className="modal-controls">
              <button 
                className="btn-back"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
              >
                <FaArrowLeft /> Back to Orders
              </button>
              <button 
                className="btn-close"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="modal-content">
            <div className="detail-section">
              <h3>👤 Customer Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Name:</label>
                  <span>{selectedOrder.customer.name}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedOrder.customer.email}</span>
                </div>
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{selectedOrder.customer.phone}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Address:</label>
                  <span>{selectedOrder.customer.address}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>👶 Children ({selectedOrder.children.length})</h3>
              <div className="children-grid">
                {selectedOrder.children.map((child, index) => (
                  <div key={index} className="child-card">
                    <div className="child-header">
                      <h4>{child.name}</h4>
                      <span className="age-badge">{child.age} years</span>
                    </div>
                    <div className="child-details">
                      <span className="level-badge">{child.learningLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="detail-section">
              <h3>📋 Plan & Customization</h3>
              <div className="plan-summary">
                <div className="plan-header">
                  <h4>{selectedOrder.plan.name}</h4>
                  <div className="plan-price">₹{selectedOrder.plan.price.toLocaleString()}</div>
                </div>
                <div className="plan-details">
                  <span className="plan-duration">{selectedOrder.plan.duration}</span>
                  <span className="plan-type">{selectedOrder.plan.name.includes('Premium') ? 'Premium' : 'Basic'}</span>
                </div>
              </div>
              
              {selectedOrder.customization.length > 0 && (
                <div className="customization-section">
                  <h4>Customizations Applied:</h4>
                  <div className="customization-tags">
                    {selectedOrder.customization.map((item, index) => (
                      <span key={index} className="customization-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="detail-section">
              <h3>📦 Materials Breakdown</h3>
              <div className="materials-breakdown">
                <div className="material-category">
                  <div className="category-header">
                    <FaBox className="category-icon" />
                    <h4>Warehouse Items (Included in Box)</h4>
                    <span className="item-count">{selectedOrder.materials.warehouse.length} items</span>
                  </div>
                  <div className="materials-list">
                    {selectedOrder.materials.warehouse.map((item, index) => (
                      <div key={index} className="material-item">
                        <span className="material-name">{item}</span>
                        <span className="material-status available">Available</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="material-category">
                  <div className="category-header">
                    <FaHome className="category-icon" />
                    <h4>Home Items (Customer Provides)</h4>
                    <span className="item-count">{selectedOrder.materials.home.length} items</span>
                  </div>
                  <div className="materials-list">
                    {selectedOrder.materials.home.map((item, index) => (
                      <div key={index} className="material-item">
                        <span className="material-name">{item}</span>
                        <span className="material-status home">From Home</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="material-category">
                  <div className="category-header">
                    <FaShoppingCart className="category-icon" />
                    <h4>Consumable Items</h4>
                    <span className="item-count">{selectedOrder.materials.consumable.length} items</span>
                  </div>
                  <div className="materials-list">
                    {selectedOrder.materials.consumable.map((item, index) => (
                      <div key={index} className="material-item">
                        <span className="material-name">{item}</span>
                        <span className="material-status consumable">One-time Use</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="material-category">
                  <div className="category-header">
                    <FaRecycle className="category-icon" />
                    <h4>Reusable Items</h4>
                    <span className="item-count">{selectedOrder.materials.reusable.length} items</span>
                  </div>
                  <div className="materials-list">
                    {selectedOrder.materials.reusable.map((item, index) => (
                      <div key={index} className="material-item">
                        <span className="material-name">{item}</span>
                        <span className="material-status reusable">Reusable</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>📅 Order Timeline</h3>
              <div className="timeline">
                <div className="timeline-item completed">
                  <div className="timeline-marker">
                    <FaCheckCircle />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>Order Placed</strong>
                      <span className="timeline-date">{selectedOrder.orderDate}</span>
                    </div>
                    <p>Customer completed order and customization</p>
                  </div>
                </div>
                
                <div className="timeline-item current">
                  <div className="timeline-marker">
                    <FaClock />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>Processing</strong>
                      <span className="timeline-date">In Progress</span>
                    </div>
                    <p>Kit preparation and materials gathering</p>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-marker">
                    <FaTruck />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>Expected Delivery</strong>
                      <span className="timeline-date">{selectedOrder.deliveryDate}</span>
                    </div>
                    <p>3-5 business days from order confirmation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <div className="action-group">
              <button className="btn-secondary">
                <FaPrint /> Print Order
              </button>
              <button className="btn-secondary">
                <FaDownload /> Download Packing List
              </button>
            </div>
            
            <div className="action-group">
              <button 
                className="btn-primary"
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, 'processing');
                  setSelectedOrder(null);
                }}
                disabled={selectedOrder.status !== 'pending'}
              >
                <FaPlay /> Start Processing
              </button>
              
              {selectedOrder.status === 'processing' && (
                <button 
                  className="btn-success"
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, 'ready');
                    setSelectedOrder(null);
                  }}
                >
                  <FaCheckCircle /> Mark Ready
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return renderOrders();
      case 'kit-preparation':
        return renderKitPreparation();
      case 'warehouse-status':
        return renderWarehouseStatus();
      default:
        return renderOrders();
    }
  };

  return (
    <div className="order-management">
      <div className="management-header">
        <h1>📦 Order Management System</h1>
        <p>Manage customer orders, kit preparation, and warehouse operations</p>
      </div>
      
      <div className="management-tabs">
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FaClipboardList /> Orders
        </button>
        <button 
          className={`tab-button ${activeTab === 'kit-preparation' ? 'active' : ''}`}
          onClick={() => setActiveTab('kit-preparation')}
        >
          <FaBox /> Kit Preparation
        </button>
        <button 
          className={`tab-button ${activeTab === 'warehouse-status' ? 'active' : ''}`}
          onClick={() => setActiveTab('warehouse-status')}
        >
          <FaTruck /> Warehouse Status
        </button>
      </div>
      
      <div className="management-content">
        {renderContent()}
      </div>
      
      {selectedOrder && renderOrderDetails()}
    </div>
  );
};

export default OrderManagement;
