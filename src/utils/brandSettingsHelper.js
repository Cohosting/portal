export const createBrandSettings = (options = {}) => {
  const {
    brandName = '',
    primaryColor = '#3B82F6',
    backgroundColor = '#FFFFFF',
    textColor = '#1F2937',
    poweredByCopilot = false,
    assets = {},
    advancedOverrides = {}
  } = options;

  return {
    brandName,
    baseColors: {
      primaryColor,
      backgroundColor,
      textColor,
    },
    poweredByCopilot,
    assets: {
      squareIcon: assets.squareIcon || '',
      fullLogo: assets.fullLogo || '',
      squareLoginImage: assets.squareLoginImage || '',
    },
    advancedColors: {
      sidebar: {
        bgColor: advancedOverrides.sidebar?.bgColor || null,
        textColor: advancedOverrides.sidebar?.textColor || null,
        activeTextColor: advancedOverrides.sidebar?.activeTextColor || null,
        activeBgColor: advancedOverrides.sidebar?.activeBgColor || null,
        hoverBgColor: advancedOverrides.sidebar?.hoverBgColor || null,
      },
      login: {
        formTextColor: advancedOverrides.login?.formTextColor || null,
        buttonColor: advancedOverrides.login?.buttonColor || null,
        buttonTextColor: advancedOverrides.login?.buttonTextColor || null,
        buttonHoverColor: advancedOverrides.login?.buttonHoverColor || null,
        inputBorderColor: advancedOverrides.login?.inputBorderColor || null,
        inputFocusBorderColor: advancedOverrides.login?.inputFocusBorderColor || null,
      },
      messages: {
        activeItemBg: advancedOverrides.messages?.activeItemBg || null,
        activeItemBorder: advancedOverrides.messages?.activeItemBorder || null,
        activeItemText: advancedOverrides.messages?.activeItemText || null,
        hoverBg: advancedOverrides.messages?.hoverBg || null,
      },
      accent: {
        color: advancedOverrides.accent?.color || null,
        hoverColor: advancedOverrides.accent?.hoverColor || null,
        lightColor: advancedOverrides.accent?.lightColor || null,
      }
    },
    showAdvancedOptions: false,
  };
};



export const brandPresets = {
  // Clean blue theme
  blue: {
    primaryColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
  },
  
  // Professional dark theme
  professional: {
    primaryColor: '#38BDF8',
    backgroundColor: '#FFFFFF',
    textColor: '#1E293B',
    advancedOverrides: {
      sidebar: {
        bgColor: '#1E293B',
        textColor: '#CBD5E1',
      }
    }
  },
  
  // Modern purple theme
  modern: {
    primaryColor: '#8B5CF6',
    backgroundColor: '#FAFAFA',
    textColor: '#1F2937',
  },
  
  // Corporate green theme
  corporate: {
    primaryColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
  },
  
  // Minimal black theme
  minimal: {
    primaryColor: '#000000',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  }
};