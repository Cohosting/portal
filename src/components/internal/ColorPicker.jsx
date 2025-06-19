import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';

export const BrandColorPicker = ({
  onCompletePick, field, defaultColor, title
}) => {
  const [color, setColor] = useColor(defaultColor || '#000000');
  const [showPicker, setShowPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef();
  const debounceTimer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    // Cleanup debounce timer on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Debounced function to update parent
  const debouncedUpdate = useCallback((hexColor) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      onCompletePick(field, hexColor);
    }, 100); // 100ms debounce
  }, [field, onCompletePick]);

  // Handle live color changes with debounced parent updates
  const handleChange = (newColor) => {
    setColor(newColor);
    // Only update parent if not actively dragging or use debounced update
    if (!isDragging) {
      debouncedUpdate(newColor.hex);
    }
  };

  // Handle mouse down (start dragging)
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  // Handle mouse up (stop dragging)
  const handleMouseUp = () => {
    setIsDragging(false);
    // Immediately update parent when dragging stops
    onCompletePick(field, color.hex);
  };

  // Handle when user finishes changing color (for click events)
  const handleChangeComplete = (newColor) => {
    setColor(newColor);
    onCompletePick(field, newColor.hex);
  };

  const handleInputChange = (event) => {
    const newColorHex = event.target.value;
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newColorHex)) {
      setColor({ ...color, hex: newColorHex });
      onCompletePick(field, newColorHex);
    }
  };

  useEffect(() => {
    if (!defaultColor) return;
    setColor({ ...color, hex: defaultColor });
  }, [defaultColor]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 pl-0">
      <p className="text-sm font-semibold leading-6 text-gray-900 mb-2 sm:mb-0">{title}</p>
      <div className="flex items-center relative">
        <div
          onClick={() => setShowPicker(!showPicker)}
          className="w-9 h-9 border border-gray-300 rounded-lg cursor-pointer"
          style={{ backgroundColor: color.hex }}
        ></div>
        <input
          type="text"
          value={color.hex}
          onChange={handleInputChange}
          className="ml-2.5 h-9 bg-white w-[105px] border border-gray-300 rounded px-2"
        />
        {showPicker && (
          <div ref={ref} className="absolute top-full left-0 mt-2 z-10">
            <div onMouseUp={handleMouseUp}>
              <ColorPicker
                color={color}
                onChange={handleChange}
                hideInput={['rgb', 'hsv']}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};