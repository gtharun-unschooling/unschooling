// src/components/BackButton.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BackButton() {
  const navigate = useNavigate();

  const styles = {
    button: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,0.85)',
      border: 'none',
      borderRadius: '50%',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      cursor: 'pointer',
      fontSize: '1.5rem',
      transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
      outline: 'none',
      margin: 0,
      padding: 0,
    },
    buttonHover: {
      background: '#f3f4f6',
      boxShadow: '0 4px 16px rgba(102,126,234,0.15)',
      transform: 'scale(1.07)',
    },
    icon: {
      color: '#764ba2',
      fontWeight: 700,
      pointerEvents: 'none',
      userSelect: 'none',
    },
  };

  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => navigate(-1)}
      style={{ ...styles.button, ...(hovered ? styles.buttonHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Go back"
    >
      <span style={styles.icon}>←</span>
    </button>
  );
}
