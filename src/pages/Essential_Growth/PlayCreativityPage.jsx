import React from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleBackButton from '../../components/ui/SimpleBackButton';
import PlayCreativityActivities from '../../components/PlayCreativityActivities';

const PlayCreativityPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/essential-growth');
  };

  return (
    <div>
      <PlayCreativityActivities onBackClick={handleBackClick} />
    </div>
  );
};

export default PlayCreativityPage;
