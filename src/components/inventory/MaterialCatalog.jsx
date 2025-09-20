import React, { useState, useEffect } from 'react';

const MaterialCatalog = ({ onMaterialSelect, selectedMaterials = [] }) => {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/inventory/materials');
      
      if (!response.ok) {
        throw new Error('Failed to load materials');
      }

      const data = await response.json();
      setMaterials(data.materials || []);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data if API fails
      setMaterials(getSampleMaterials());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleMaterials = () => {
    return [
      {
        materialId: 'art_001',
        name: 'Colored Pencils Set',
        category: 'Art Supplies',
        description: 'Set of 24 colored pencils for drawing and coloring activities',
        cost: 12.99,
        supplier: 'Art Supply Co',
        stockLevel: 50,
        minStockLevel: 10
      },
      {
        materialId: 'science_001',
        name: 'Magnifying Glass',
        category: 'Science Kits',
        description: '5x magnification glass for nature exploration',
        cost: 8.50,
        supplier: 'Science Tools Inc',
        stockLevel: 25,
        minStockLevel: 5
      },
      {
        materialId: 'craft_001',
        name: 'Construction Paper Pack',
        category: 'Craft Supplies',
        description: 'Assorted colors construction paper, 100 sheets',
        cost: 6.99,
        supplier: 'Craft Central',
        stockLevel: 75,
        minStockLevel: 15
      },
      {
        materialId: 'book_001',
        name: 'Children\'s Encyclopedia',
        category: 'Books',
        description: 'Age-appropriate encyclopedia for learning activities',
        cost: 24.99,
        supplier: 'Educational Books Ltd',
        stockLevel: 30,
        minStockLevel: 8
      },
      {
        materialId: 'game_001',
        name: 'Educational Board Game',
        category: 'Games',
        description: 'Math and logic board game for ages 6-10',
        cost: 19.99,
        supplier: 'Learning Games Co',
        stockLevel: 20,
        minStockLevel: 5
      }
    ];
  };

  const categories = ['all', ...new Set(materials.map(m => m.category))];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMaterialToggle = (material) => {
    const isSelected = selectedMaterials.some(m => m.materialId === material.materialId);
    if (isSelected) {
      onMaterialSelect?.(selectedMaterials.filter(m => m.materialId !== material.materialId));
    } else {
      onMaterialSelect?.([...selectedMaterials, { ...material, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (materialId, quantity) => {
    const updatedMaterials = selectedMaterials.map(m => 
      m.materialId === materialId ? { ...m, quantity: Math.max(1, quantity) } : m
    );
    onMaterialSelect?.(updatedMaterials);
  };

  const getStockStatus = (stockLevel, minStockLevel) => {
    if (stockLevel <= 0) return { status: 'out', color: '#dc2626', text: 'Out of Stock' };
    if (stockLevel <= minStockLevel) return { status: 'low', color: '#f59e0b', text: 'Low Stock' };
    return { status: 'good', color: '#10b981', text: 'In Stock' };
  };

  const containerStyle = {
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  };

  const filterStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    alignItems: 'center'
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white'
  };

  const materialGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px'
  };

  const materialCardStyle = {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s'
  };

  const selectedCardStyle = {
    ...materialCardStyle,
    borderColor: '#3b82f6',
    backgroundColor: '#f0f9ff'
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
          Loading materials catalog...
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
        <h3 style={{ margin: '0', color: '#1e293b' }}>
          📦 Materials Catalog
        </h3>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          {selectedMaterials.length} materials selected
        </div>
      </div>

      <div style={filterStyle}>
        <input
          type="text"
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...inputStyle, width: '200px' }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={selectStyle}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      <div style={materialGridStyle}>
        {filteredMaterials.map(material => {
          const isSelected = selectedMaterials.some(m => m.materialId === material.materialId);
          const selectedMaterial = selectedMaterials.find(m => m.materialId === material.materialId);
          const stockStatus = getStockStatus(material.stockLevel, material.minStockLevel);
          
          return (
            <div
              key={material.materialId}
              style={isSelected ? selectedCardStyle : materialCardStyle}
              onClick={() => handleMaterialToggle(material)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <h4 style={{ margin: '0', color: '#1e293b' }}>
                  {material.name}
                </h4>
                <div style={{
                  padding: '2px 6px',
                  backgroundColor: stockStatus.color,
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500'
                }}>
                  {stockStatus.text}
                </div>
              </div>
              
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>
                {material.description}
              </p>
              
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
                <div>Category: {material.category}</div>
                <div>Supplier: {material.supplier}</div>
                <div>Stock: {material.stockLevel} units</div>
                <div>Cost: ${material.cost}</div>
              </div>

              {isSelected && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '4px'
                }}>
                  <label style={{ fontSize: '12px', color: '#1e40af' }}>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={selectedMaterial?.quantity || 1}
                    onChange={(e) => handleQuantityChange(material.materialId, parseInt(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '60px',
                      padding: '4px',
                      border: '1px solid #3b82f6',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredMaterials.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#64748b',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h4>No materials found</h4>
          <p>Try adjusting your search or category filter.</p>
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

export default MaterialCatalog;
