/**
 * Utility functions to handle Command+Click (Mac) or Ctrl+Click (Windows)
 * to open links in new tabs, even when using React Router
 */

/**
 * Check if modifier key (Command or Ctrl) is pressed
 */
export const isModifierKeyPressed = (event) => {
  return event.metaKey || event.ctrlKey;
};

/**
 * Handle click event - if modifier key is pressed, open in new tab
 * Otherwise, use the provided navigation function
 */
export const handleLinkClick = (event, path, navigate) => {
  if (isModifierKeyPressed(event)) {
    event.preventDefault();
    const baseUrl = window.location.origin;
    window.open(`${baseUrl}${path}`, '_blank', 'noopener,noreferrer');
  } else {
    // Let React Router handle normal clicks
    if (navigate) {
      navigate(path);
    }
  }
};

/**
 * Create onClick handler for buttons that should support Command+Click
 */
export const createLinkHandler = (path, navigate) => {
  return (event) => {
    if (isModifierKeyPressed(event)) {
      event.preventDefault();
      const baseUrl = window.location.origin;
      window.open(`${baseUrl}${path}`, '_blank', 'noopener,noreferrer');
    } else {
      if (navigate) {
        navigate(path);
      }
    }
  };
};

