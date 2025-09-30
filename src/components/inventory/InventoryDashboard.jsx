import React, { useState, useEffect } from 'react';
import MaterialCatalog from './MaterialCatalog';

const InventoryDashboard = () => {
  const [stockSummary, setStockSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showMaterialCatalog, setShowMaterialCatalog] = useState(false);

  useEffect(() => {
    loadStockSummary();
  }, []);

  const loadStockSummary = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/inventory/stock');
      
      if (!response.ok) {
        throw new Error('Failed to load stock summary');
      }

      const data = await response.json();
      setStockSummary(data.stock_summary);
    } catch (err) {
      setError(err.message);
      // Fallback data
      setStockSummary({
        total_materials: 5,
        low_stock_items: 1,
        out_of_stock_items: 0,
        total_value: 1250.50
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaterialSelect = (materials) => {
    setSelectedMaterials(materials);
  };

  const createDelivery = async () => {
    if (selectedMaterials.length === 0) {
      alert('Please select materials for delivery');
      return;
    }

    try {
      const deliveryData = {
        child_id: 'sample_child',
        materials: selectedMaterials,
        scheduled_date: new Date().toISOString(),
        status: 'scheduled'
      };

      const response = await fetch('http://localhost:8000/api/deliveries/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deliveryData)
      });

      if (!response.ok) {
        throw new Error('Failed to create delivery');
      }

      const result = await response.json();
      alert(`Delivery created successfully! ID: ${result.delivery_id}`);
      setSelectedMaterials([]);
    } catch (err) {
      alert(`Error creating delivery: ${err.message}`);
    }
  };

  const containerStyle = {
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '30px'
  };

  const statCardStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  };

  const statValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px'
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: '#64748b'
  };

  const actionSectionStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '20px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginRight: '10px'
  };

  const selectedMaterialsStyle = {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#f0f9ff',
    borderRadius: '6px',
    border: '1px solid #0ea5e9'
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
          Loading inventory dashboard...
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
        <h1 style={{ margin: '0', color: '#1e293b' }}>
          📦 Inventory Management Dashboard
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Real-time inventory tracking and management
        </div>
      </div>

      {/* Stock Summary */}
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, color: '#1e293b' }}>
            {stockSummary?.total_materials || 0}
          </div>
          <div style={statLabelStyle}>Total Materials</div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, color: '#f59e0b' }}>
            {stockSummary?.low_stock_items || 0}
          </div>
          <div style={statLabelStyle}>Low Stock Items</div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, color: '#dc2626' }}>
            {stockSummary?.out_of_stock_items || 0}
          </div>
          <div style={statLabelStyle}>Out of Stock</div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, color: '#10b981' }}>
            ${stockSummary?.total_value?.toFixed(2) || '0.00'}
          </div>
          <div style={statLabelStyle}>Total Inventory Value</div>
        </div>
      </div>

      {/* Actions */}
      <div style={actionSectionStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          Quick Actions
        </h3>
        
        <button
          style={buttonStyle}
          onClick={() => setShowMaterialCatalog(!showMaterialCatalog)}
        >
          {showMaterialCatalog ? 'Hide' : 'Show'} Material Catalog
        </button>
        
        <button
          style={{
            ...buttonStyle,
            backgroundColor: selectedMaterials.length > 0 ? '#10b981' : '#9ca3af',
            cursor: selectedMaterials.length > 0 ? 'pointer' : 'not-allowed'
          }}
          onClick={createDelivery}
          disabled={selectedMaterials.length === 0}
        >
          Create Delivery ({selectedMaterials.length} items)
        </button>

        {selectedMaterials.length > 0 && (
          <div style={selectedMaterialsStyle}>
            <h4 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>
              Selected Materials:
            </h4>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              {selectedMaterials.map((material, index) => (
                <li key={index} style={{ fontSize: '14px', color: '#0c4a6e' }}>
                  {material.name} (Qty: {material.quantity})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Material Catalog */}
      {showMaterialCatalog && (
        <MaterialCatalog
          onMaterialSelect={handleMaterialSelect}
          selectedMaterials={selectedMaterials}
        />
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

export default InventoryDashboard;
