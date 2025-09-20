import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const RewardSystem = () => {
  const [user] = useAuthState(auth);
  const [rewardData, setRewardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedChild, setSelectedChild] = useState('all');

  useEffect(() => {
    if (user) {
      loadRewardData();
    }
  }, [user, selectedCategory, selectedChild]);

  const loadRewardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/gamification/rewards?user_id=${user.uid}&category=${selectedCategory}&child_id=${selectedChild}`);
      
      if (!response.ok) {
        throw new Error('Failed to load reward data');
      }

      const data = await response.json();
      setRewardData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setRewardData(getSampleRewardData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleRewardData = () => {
    return {
      currentPoints: 3450,
      totalPointsEarned: 12450,
      totalPointsSpent: 9000,
      availableRewards: [
        {
          rewardId: "sticker_pack_1",
          title: "Animal Sticker Pack",
          description: "A collection of cute animal stickers",
          category: "digital",
          cost: 100,
          icon: "🐾",
          rarity: "common",
          isAvailable: true,
          image: "https://via.placeholder.com/100x100/3b82f6/ffffff?text=Stickers"
        },
        {
          rewardId: "extra_playtime",
          title: "Extra Playtime",
          description: "30 minutes of extra playtime",
          category: "privilege",
          cost: 200,
          icon: "⏰",
          rarity: "common",
          isAvailable: true,
          image: "https://via.placeholder.com/100x100/10b981/ffffff?text=Playtime"
        },
        {
          rewardId: "choose_dinner",
          title: "Choose Dinner",
          description: "Pick what the family has for dinner",
          category: "privilege",
          cost: 300,
          icon: "🍕",
          rarity: "rare",
          isAvailable: true,
          image: "https://via.placeholder.com/100x100/f59e0b/ffffff?text=Dinner"
        },
        {
          rewardId: "art_supplies",
          title: "Art Supplies Kit",
          description: "New set of colored pencils and markers",
          category: "physical",
          cost: 500,
          icon: "🎨",
          rarity: "rare",
          isAvailable: true,
          image: "https://via.placeholder.com/100x100/8b5cf6/ffffff?text=Art"
        },
        {
          rewardId: "movie_night",
          title: "Movie Night",
          description: "Choose a movie for family movie night",
          category: "privilege",
          cost: 400,
          icon: "🎬",
          rarity: "rare",
          isAvailable: true,
          image: "https://via.placeholder.com/100x100/ef4444/ffffff?text=Movie"
        },
        {
          rewardId: "science_kit",
          title: "Science Experiment Kit",
          description: "Complete kit for fun science experiments",
          category: "physical",
          cost: 800,
          icon: "🧪",
          rarity: "epic",
          isAvailable: true,
          image: "https://via.placeholder.com/100x100/06b6d4/ffffff?text=Science"
        },
        {
          rewardId: "trip_to_zoo",
          title: "Trip to the Zoo",
          description: "Family trip to the local zoo",
          category: "experience",
          cost: 1500,
          icon: "🦁",
          rarity: "legendary",
          isAvailable: true,
          image: "https://via.placeholder.com/100x100/84cc16/ffffff?text=Zoo"
        },
        {
          rewardId: "new_book",
          title: "New Book",
          description: "Choose a new book from the bookstore",
          category: "physical",
          cost: 600,
          icon: "📚",
          rarity: "rare",
          isAvailable: true,
          image: "https://via.placeholder.com/100x100/6366f1/ffffff?text=Book"
        }
      ],
      earnedRewards: [
        {
          rewardId: "sticker_pack_1",
          title: "Animal Sticker Pack",
          description: "A collection of cute animal stickers",
          category: "digital",
          cost: 100,
          icon: "🐾",
          earnedAt: "2024-01-15T10:30:00Z",
          status: "used"
        },
        {
          rewardId: "extra_playtime",
          title: "Extra Playtime",
          description: "30 minutes of extra playtime",
          category: "privilege",
          cost: 200,
          icon: "⏰",
          earnedAt: "2024-01-18T14:20:00Z",
          status: "used"
        },
        {
          rewardId: "choose_dinner",
          title: "Choose Dinner",
          description: "Pick what the family has for dinner",
          category: "privilege",
          cost: 300,
          icon: "🍕",
          earnedAt: "2024-01-20T16:45:00Z",
          status: "pending"
        }
      ],
      rewardHistory: [
        {
          type: "earned",
          title: "Animal Sticker Pack",
          points: 100,
          timestamp: "2024-01-15T10:30:00Z",
          description: "Earned by completing 5 activities"
        },
        {
          type: "spent",
          title: "Extra Playtime",
          points: -200,
          timestamp: "2024-01-18T14:20:00Z",
          description: "Redeemed for 30 minutes extra playtime"
        },
        {
          type: "earned",
          title: "Choose Dinner",
          points: 300,
          timestamp: "2024-01-20T16:45:00Z",
          description: "Earned by maintaining 7-day streak"
        }
      ],
      categories: [
        { id: "all", name: "All Rewards", count: 8 },
        { id: "digital", name: "Digital", count: 1 },
        { id: "privilege", name: "Privileges", count: 3 },
        { id: "physical", name: "Physical", count: 3 },
        { id: "experience", name: "Experiences", count: 1 }
      ]
    };
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRarityName = (rarity) => {
    switch (rarity) {
      case 'common': return 'Common';
      case 'rare': return 'Rare';
      case 'epic': return 'Epic';
      case 'legendary': return 'Legendary';
      default: return 'Common';
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'digital': return 'Digital';
      case 'privilege': return 'Privileges';
      case 'physical': return 'Physical';
      case 'experience': return 'Experiences';
      default: return 'Other';
    }
  };

  const handleRedeemReward = async (rewardId) => {
    try {
      const response = await fetch('http://localhost:8000/api/gamification/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          reward_id: rewardId,
          child_id: selectedChild
        })
      });

      if (!response.ok) {
        throw new Error('Failed to redeem reward');
      }

      // Reload data after successful redemption
      loadRewardData();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredRewards = rewardData?.availableRewards?.filter(reward => {
    return selectedCategory === 'all' || reward.category === selectedCategory;
  }) || [];

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

  const filterStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '14px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const rewardCardStyle = {
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
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
          Loading reward system...
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
          🎁 Reward System
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Earn points and redeem amazing rewards!
        </div>
      </div>

      {/* Points Summary */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            💰 Current Points
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {rewardData?.currentPoints || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              points available
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📈 Total Earned
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              {rewardData?.totalPointsEarned || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              points earned
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🛒 Total Spent
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
              {rewardData?.totalPointsSpent || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              points spent
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={filterStyle}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={selectStyle}
        >
          {rewardData?.categories?.map(category => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.count})
            </option>
          ))}
        </select>

        <select
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Children</option>
          <option value="child1">Child 1</option>
          <option value="child2">Child 2</option>
        </select>
      </div>

      <div style={gridStyle}>
        {/* Available Rewards */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🎁 Available Rewards ({filteredRewards.length})
          </h3>
          {filteredRewards.length > 0 ? (
            filteredRewards.map((reward, index) => (
              <div key={index} style={rewardCardStyle}>
                <div style={{ fontSize: '32px' }}>{reward.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>
                    {reward.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {reward.description}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    {getCategoryName(reward.category)} • {getRarityName(reward.rarity)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                    {reward.cost} pts
                  </div>
                  <button
                    style={{
                      ...buttonStyle,
                      backgroundColor: reward.cost <= (rewardData?.currentPoints || 0) ? '#10b981' : '#6b7280',
                      cursor: reward.cost <= (rewardData?.currentPoints || 0) ? 'pointer' : 'not-allowed'
                    }}
                    onClick={() => handleRedeemReward(reward.rewardId)}
                    disabled={reward.cost > (rewardData?.currentPoints || 0)}
                  >
                    {reward.cost <= (rewardData?.currentPoints || 0) ? 'Redeem' : 'Not Enough Points'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
              No rewards available for the selected category.
            </div>
          )}
        </div>

        {/* Earned Rewards */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            ✅ Earned Rewards ({rewardData?.earnedRewards?.length || 0})
          </h3>
          {rewardData?.earnedRewards?.length > 0 ? (
            rewardData.earnedRewards.map((reward, index) => (
              <div key={index} style={rewardCardStyle}>
                <div style={{ fontSize: '32px' }}>{reward.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>
                    {reward.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {reward.description}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Earned: {new Date(reward.earnedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  backgroundColor: reward.status === 'used' ? '#10b981' : '#f59e0b',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {reward.status}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
              No rewards earned yet. Keep learning to earn your first reward!
            </div>
          )}
        </div>
      </div>

      {/* Reward History */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          📊 Reward History
        </h3>
        {rewardData?.rewardHistory?.map((entry, index) => (
          <div key={index} style={{
            padding: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: '500', color: '#1e293b' }}>
                {entry.title}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {entry.description}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                {new Date(entry.timestamp).toLocaleDateString()}
              </div>
            </div>
            <div style={{
              padding: '4px 8px',
              backgroundColor: entry.points > 0 ? '#10b981' : '#ef4444',
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {entry.points > 0 ? '+' : ''}{entry.points} pts
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RewardSystem;
