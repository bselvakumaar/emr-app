// Medflow EMR - Unified Theme Configuration
// Navy Blue Brand Identity from Official MedFlow Brand Guide

export const medflowTheme = {
  // Primary Brand Colors (from brand guide)
  primary: '#1e4d78',      // MedFlow Navy Blue
  accent: '#2878a8',       // MedFlow Medium Blue

  // Color Variations
  primaryLight: '#3a8cc2', // Light Blue
  primaryDark: '#152d4a',  // Deep Navy
  accentLight: '#5dade2',  // Sky Blue
  accentDark: '#1a3a5c',   // Dark Navy

  // Gradient Definitions
  gradients: {
    primary: 'linear-gradient(135deg, #152d4a 0%, #2878a8 100%)',
    primaryHover: 'linear-gradient(135deg, #1a3a5c 0%, #3a8cc2 100%)',
    green: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    blue: 'linear-gradient(135deg, #1e4d78 0%, #2878a8 100%)',
    subtle: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
  },

  // Shadow Colors
  shadows: {
    primary: 'rgba(30, 77, 120, 0.3)',
    accent: 'rgba(40, 120, 168, 0.3)',
    hover: 'rgba(30, 77, 120, 0.2)',
    focus: 'rgba(30, 77, 120, 0.1)'
  },

  // Component-specific Colors
  components: {
    buttons: {
      primary: 'linear-gradient(135deg, #1e4d78 0%, #2878a8 100%)',
      primaryHover: 'linear-gradient(135deg, #152d4a 0%, #3a8cc2 100%)',
      secondary: '#f1f5f9',
      secondaryHover: '#e2e8f0',
      focus: '#1e4d78',
      focusShadow: '0 0 0 3px rgba(30, 77, 120, 0.15)'
    },

    forms: {
      border: '#e5e7eb',
      focus: '#2878a8',
      focusShadow: '0 0 0 3px rgba(40, 120, 168, 0.12)',
      background: '#ffffff'
    },

    backgrounds: {
      primary: 'linear-gradient(135deg, #152d4a 0%, #2878a8 100%)',
      page: '#f8fafc',
      card: '#ffffff',
      overlay: 'rgba(15, 23, 42, 0.4)'
    },

    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      accent: '#1e4d78',
      muted: '#94a3b8',
      white: '#ffffff'
    },

    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#2878a8'
    }
  },

  // Logo Configuration
  logo: {
    main: '/medflow-logo-main.svg',
    icon: '/medflow-icon.svg',
    header: '/medflow-header-logo.svg',
    favicon: '/medflow-favicon.svg',
    fallback: {
      icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z',
      gradient: 'linear-gradient(135deg, #152d4a 0%, #2878a8 100%)'
    },
    sizes: {
      small: 32,   // Sidebar
      medium: 64,  // Page headers
      large: 120   // Login page
    }
  },

  // Typography
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    }
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },

  // Border Radius
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px'
  },

  // Transitions
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease'
  }
};

// CSS Custom Properties Generator
export const generateCSSVariables = (theme = medflowTheme) => {
  return {
    '--medflow-primary': theme.primary,
    '--medflow-accent': theme.accent,
    '--medflow-primary-light': theme.primaryLight,
    '--medflow-primary-dark': theme.primaryDark,
    '--medflow-accent-light': theme.accentLight,
    '--medflow-accent-dark': theme.accentDark,
    '--medflow-gradient': theme.gradients.primary,
    '--medflow-gradient-hover': theme.gradients.primaryHover,
    '--medflow-shadow-primary': theme.shadows.primary,
    '--medflow-shadow-accent': theme.shadows.accent,
    '--medflow-shadow-hover': theme.shadows.hover,
    '--medflow-shadow-focus': theme.shadows.focus
  };
};

// Theme Application Helper
export const applyMedflowTheme = (element = document.documentElement) => {
  const variables = generateCSSVariables();
  Object.entries(variables).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });
};

export default medflowTheme;
