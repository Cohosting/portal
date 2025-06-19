// src/pages/CustomizePortal/ColorCustomization.jsx
import React, { useState } from 'react';
import { BrandColorPicker } from '@/components/internal/ColorPicker';
import { Button } from '@/components/ui/button';
import SwitchComponent from '@/components/SwitchComponent';
import { RefreshCw, Palette, ChevronDown, ChevronRight } from 'lucide-react';
import { COLOR_GROUPS } from '@/utils/constant';

// Utility function to format camelCase to proper title case
const getWellFormattedTitle = (title) => {
  return title
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim(); // Remove any leading/trailing spaces
};

// Single color picker row
const EnhancedColorPicker = ({ title, value, onChange, placeholder, showReset, onReset }) => (
  <li className="py-5 px-4">
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {placeholder && value !== placeholder && (
          <p className="mt-1 text-xs text-gray-500">
            Default: <span className="font-mono">{placeholder}</span>
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <BrandColorPicker
          defaultColor={value || placeholder}
          onCompletePick={(_, c) => onChange(c)}
        />
        {showReset && value && value !== placeholder && (
          <button
            onClick={onReset}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            title="Reset"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  </li>
);

// Base colors section
export const BaseColorSection = ({ baseColors, handleUpdateBaseColor, Heading }) => (
  <div className="my-6 text-sm">
    <Heading text="Brand Colors" subText="Pick primary, background, and text colors." />
    <ul className="divide-y divide-gray-300 bg-white rounded-lg border border-gray-200">
      <EnhancedColorPicker
        title="Primary Color"
        value={baseColors.primaryColor}
        onChange={c => handleUpdateBaseColor('primaryColor', c)}
      />
      <EnhancedColorPicker
        title="Background Color"
        value={baseColors.backgroundColor}
        onChange={c => handleUpdateBaseColor('backgroundColor', c)}
      />
      <EnhancedColorPicker
        title="Text Color"
        value={baseColors.textColor}
        onChange={c => handleUpdateBaseColor('textColor', c)}
      />
    </ul>
  </div>
);

// Single collapsible color group
const ColorGroup = ({ title, description, keys, advancedColors, derivedColors, onChange, isOpen, onToggle }) => {
  // Count how many colors in this group have overrides
  const overrideCount = keys.filter(key => advancedColors[key] != null).length;

  return (
    <div className="border border-gray-200 rounded-lg ">
      {/* Group Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h5 className="font-medium text-gray-900">{title}</h5>
              {overrideCount > 0 && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  {overrideCount} customized
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {keys.length} colors
        </div>
      </button>

      {/* Group Content */}
      {isOpen && (
        <div className="bg-white">
          <ul className="divide-y divide-gray-200">
            {keys.map(key => (
              <EnhancedColorPicker
                key={key}
                title={getWellFormattedTitle(key)}
                value={advancedColors[key]}
                placeholder={derivedColors[key]}
                onChange={c => onChange(key, c)}
                showReset
                onReset={() => onChange(key, null)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Advanced overrides section with accordion
export const AdvancedColorSection = (props) => {
  const {
    advancedColors,
    derivedColors,
    handleUpdateAdvancedColor,
    showAdvancedOptions,
    toggleAdvancedOptions,
    resetAdvancedColors
  } = props;

  // Track which accordion groups are open
  const [openGroups, setOpenGroups] = useState({
    sidebar: false,
    login: false,
    buttons: false,
    messages: false,
    content: false
  });

  const toggleGroup = (groupKey) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Count total overrides
  const totalOverrides = Object.values(advancedColors).filter(v => v != null).length;

  return (
    <div className="my-6 text-sm">
      {/* Advanced Options Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-gray-600" />
          <div>
            <h4 className="font-medium text-gray-900">Advanced Color Customization</h4>
            {totalOverrides > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                {totalOverrides} color{totalOverrides !== 1 ? 's' : ''} customized
              </p>
            )}
          </div>
        </div>
        <SwitchComponent enabled={showAdvancedOptions} setEnabled={toggleAdvancedOptions} />
      </div>

      {/* Accordion Groups */}
      {showAdvancedOptions && (
        <div className="mt-6 space-y-4">
          {/* Reset All Button */}
          {totalOverrides > 0 && (
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetAdvancedColors} 
                className="text-sm flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset All ({totalOverrides})
              </Button>
            </div>
          )}

          {/* Color Group Accordions */}
          {COLOR_GROUPS.map(group => (
            <ColorGroup
              key={group.key}
              title={group.title}
              description={group.description}
              keys={group.keys}
              advancedColors={advancedColors}
              derivedColors={derivedColors}
              onChange={handleUpdateAdvancedColor}
              isOpen={openGroups[group.key]}
              onToggle={() => toggleGroup(group.key)}
            />
          ))}

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              💡 <strong>Tip:</strong> Most colors are automatically derived from your brand colors above. 
              Only customize these if you need specific <span className="underline decoration-dotted">control</span> over individual elements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};