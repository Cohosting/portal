import React, { useEffect, useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';

export const BrandColorPicker = ({
  onCompletePick, field, defaultColor, title
}) => {
  const [color, setColor] = useState(defaultColor);
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef();

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

  // Handle live color changes (just visual feedback, no parent update)
  const handleChange = (hexColor) => {
    setColor(hexColor);
  };

  // Handle when user finishes changing color (mouseup/click)
  const handleChangeComplete = (hexColor) => {
    setColor(hexColor);
    onCompletePick(field, hexColor);
  };

  // Add mouse up handler to detect when user stops dragging
  const handleMouseUp = () => {
    onCompletePick(field, color);
  };

  const handleInputChange = (event) => {
    const newColor = event.target.value;
    setColor(newColor);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
      onCompletePick(field, newColor);
    }
  };

  useEffect(() => {
    if (!defaultColor) return;
    setColor(defaultColor);
  }, [defaultColor]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 pl-0">
      <p className="text-sm font-semibold leading-6 text-gray-900 mb-2 sm:mb-0">{title}</p>
      <div className="flex items-center relative">
        <div
          onClick={() => setShowPicker(!showPicker)}
          className="w-9 h-9 border border-gray-300 rounded-lg cursor-pointer"
          style={{ backgroundColor: color }}
        ></div>
        <input
          type="text"
          value={color}
          onChange={handleInputChange}
          className="ml-2.5 h-9 bg-white w-[105px] border border-gray-300 rounded px-2"
        />
        {showPicker && (
          <div ref={ref} className="absolute top-full left-0 mt-2 z-10">
            <div onMouseUp={handleMouseUp}>
              <HexColorPicker
                color={color}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};