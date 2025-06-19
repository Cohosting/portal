
// Updated colorUtils.js
import Color from 'color';

// Helper functions for color manipulation
export const lighten = (color, amount) => {
  try {
    return Color(color).lighten(amount).hex();
  } catch {
    return color;
  }
};

export const darken = (color, amount) => {
  try {
    return Color(color).darken(amount).hex();
  } catch {
    return color;
  }
};

export const alpha = (color, opacity) => {
  try {
    return Color(color).alpha(opacity).string();
  } catch {
    return color;
  }
};

export const getContrastColor = (backgroundColor) => {
  try {
    const color = Color(backgroundColor);
    return color.isLight() ? '#000000' : '#FFFFFF';
  } catch {
    return '#000000';
  }
};

// Derive all colors from base colors
export const deriveColors = (baseColors) => {
  const { primaryColor, backgroundColor, textColor } = baseColors;
  
  return {
    // Sidebar colors
    sidebarBgColor:        darken(backgroundColor, 0.1),
    sidebarTextColor:      textColor,
    sidebarPrimaryTextColor: textColor, // For logo, name, email - always readable
    sidebarHoverBgColor:   alpha(primaryColor, 0.1),
    sidebarActiveTextColor: primaryColor,
    sidebarActiveBgColor:   alpha(primaryColor, 0.15),

    // Accent and interactions
    accentColor:      primaryColor,
    accentHoverColor: darken(primaryColor, 0.1),
    accentLightColor: alpha(primaryColor, 0.1),

    // Login page colors
    loginFormTextColor:         textColor,
    loginButtonColor:           primaryColor,
    loginButtonTextColor:       getContrastColor(primaryColor),
    loginButtonHoverColor:      darken(primaryColor, 0.1),
    loginInputBorderColor:      lighten(textColor, 0.6),
    loginInputFocusBorderColor: primaryColor,
    loginInputBgColor:          backgroundColor,
    loginInputTextColor:        textColor,

    // Primary buttons (used throughout main content areas on white backgrounds)
    primaryButtonColor:      primaryColor,
    primaryButtonTextColor:  getContrastColor(primaryColor),
    primaryButtonHoverColor: darken(primaryColor, 0.1),

    // Message bubbles
    myMessageBgColor:        primaryColor,
    myMessageTextColor:      getContrastColor(primaryColor),
    oppositeMessageBgColor:  lighten(textColor, 0.85),
    oppositeMessageTextColor: textColor,

    // Message/Content area colors
    messageActiveItemBg:     alpha(primaryColor, 0.08),
    messageActiveItemBorder: primaryColor,
    messageActiveItemText:   darken(primaryColor, 0.2),
    // Removed messageHoverBg

    // Additional UI elements
    borderColor:   lighten(textColor, 0.7),
    dividerColor:  lighten(textColor, 0.8),
    disabledColor: lighten(textColor, 0.5),
    successColor:  '#10B981',
    errorColor:    '#EF4444',
    warningColor:  '#F59E0B',
  };
};

// Default brand settings
export const defaultBrandSettings = {
  brandName: '',
  baseColors: {
    primaryColor:    '#000000',
    backgroundColor: '#FFFFFF',
    textColor:       '#000000',
  },
  poweredByCopilot: false,
  assets: {
    squareIcon:       '',
    fullLogo:         '',
    squareLoginImage: '',
  },

  // flat map of per-token overrides
  advancedColors: {
    // sidebar
    sidebarBgColor:        null,
    sidebarTextColor:      null,
    sidebarPrimaryTextColor: null,
    sidebarHoverBgColor:   null,
    sidebarActiveTextColor: null,
    sidebarActiveBgColor:   null,

    // accent
    accentColor:      null,
    accentHoverColor: null,
    accentLightColor: null,

    // login
    loginFormTextColor:         null,
    loginButtonColor:           null,
    loginButtonTextColor:       null,
    loginButtonHoverColor:      null,
    loginInputBorderColor:      null,
    loginInputFocusBorderColor: null,
    loginInputBgColor:          null,
    loginInputTextColor:        null,

    // primary buttons
    primaryButtonColor:      null,
    primaryButtonTextColor:  null,
    primaryButtonHoverColor: null,

    // message bubbles
    myMessageBgColor:        null,
    myMessageTextColor:      null,
    oppositeMessageBgColor:  null,
    oppositeMessageTextColor: null,

    // messages
    messageActiveItemBg:     null,
    messageActiveItemBorder: null,
    messageActiveItemText:   null,
    // Removed messageHoverBg

    // UI elements
    dividerColor: null,
  },

  showAdvancedOptions: false,
};

// Merge derived + any non-null overrides in one go
export const getComputedColors = (brandSettings) => {
  // 1) Generate full derived palette from baseColors
  const derived = deriveColors(brandSettings.baseColors);

  // 2) Grab overrides (may be all-null by default)
  const overrides = brandSettings.advancedColors || {};

  // 3) Filter to only those overrides that are non-null
  const filteredOverrides = Object.fromEntries(
    Object.entries(overrides).filter(([_, value]) => value != null)
  );

  // 4) Merge overrides on top of derived
  const merged = { ...derived, ...filteredOverrides };

  // 5) Return full computed map including raw bases
  return {
    backgroundColor: brandSettings.baseColors.backgroundColor,
    primaryColor:    brandSettings.baseColors.primaryColor,
    textColor:       brandSettings.baseColors.textColor,
    ...merged,
  };
};
