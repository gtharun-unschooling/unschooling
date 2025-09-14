import React from 'react';
import './Button.css';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full-width' : '';
  const loadingClass = loading ? 'btn-loading' : '';
  const disabledClass = disabled ? 'btn-disabled' : '';
  
  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    widthClass,
    loadingClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconElement = (
      <span className="btn-icon">
        {icon}
      </span>
    );

    return iconPosition === 'right' ? (
      <>
        <span className="btn-text">{children}</span>
        {iconElement}
      </>
    ) : (
      <>
        {iconElement}
        <span className="btn-text">{children}</span>
      </>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="btn-spinner"></div>
          <span className="btn-text">Loading...</span>
        </>
      ) : (
        renderIcon()
      )}
    </button>
  );
};

export default Button;