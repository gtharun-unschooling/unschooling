import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const SimpleBackButton = ({ 
  onClick = null,
  size = 'medium'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  const sizeMap = {
    small: 24,
    medium: 32,
    large: 40
  };

  return (
    <IconButton
      onClick={handleClick}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: '#2d3748',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.05)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 1)',
          transform: 'scale(1.05)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          color: '#1a202c',
        },
        transition: 'all 0.2s ease',
        width: sizeMap[size],
        height: sizeMap[size],
      }}
      aria-label="Go back"
    >
      <ArrowBack sx={{ fontSize: sizeMap[size] * 0.6 }} />
    </IconButton>
  );
};

export default SimpleBackButton;
