import React, { useState } from 'react';
import {
  Asterisk,
  Hotel,
  SearchCode,
  Cloud,
} from 'lucide-react';

const IconPicker = ({ onIconSelect, icon }) => {
  const [selectedIcon, setSelectedIcon] = useState(icon || null);
  const [showIcons, setShowIcons] = useState(false);

  const icons = [
    { icon: <Asterisk />, name: 'Asterisk' },
    { icon: <Hotel />, name: 'Hotel' },
    { icon: <SearchCode />, name: 'SearchCode' },
  ];

  const handleBoxClick = () => {
    setShowIcons(!showIcons);
  };

  const handleIconClick = (icon) => {
    setSelectedIcon(icon.name);
    setShowIcons(false);
    onIconSelect(icon.name); // Notify parent of selection
  };

  return (
    <div>
      <div
        className="w-8 h-8 border border-solid border-gray-300 rounded flex items-center justify-center p-1 cursor-pointer"
        onClick={handleBoxClick}
      >
        {selectedIcon ? (
          <div className="selected-icon">
            {icons.find(i => i.name === selectedIcon)?.icon}
          </div>
        ) : (
            <Cloud className="w-full h-full" />
        )}
      </div>

      {showIcons && (
        <div className="bg-white p-1.5 rounded-lg shadow-md max-w-max mt-2">
          {icons.map((icon, index) => (
            <div
              className={`flex items-center gap-2 p-1 cursor-pointer hover:bg-gray-100 rounded ${selectedIcon === icon.name ? 'bg-gray-200' : ''}`}
              key={index}
              onClick={() => handleIconClick(icon)}
            >
              {icon.icon}
              <span className="text-sm">{icon.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconPicker;
