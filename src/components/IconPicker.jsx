import React, { useState } from 'react';
import { Fa500Px, FaAirbnb, FaAlgolia, FaAws } from 'react-icons/fa';

const IconPicker = ({ onIconSelect, icon }) => {
  const [selectedIcon, setSelectedIcon] = useState(icon || null);
  const [showIcons, setShowIcons] = useState(false);

  const icons = [
    { icon: <Fa500Px />, name: 'Icon 1' },
    { icon: <FaAirbnb />, name: 'Icon 2' },
    { icon: <FaAlgolia />, name: 'Icon 3' },
    // Add more icons here
  ];

  const handleBoxClick = () => {
    setShowIcons(!showIcons);
  };

  const handleIconClick = icon => {
    setSelectedIcon(icon.name);
    setShowIcons(false);
    onIconSelect(icon.name); // Pass the selected icon outside the component
  };

  return (
    <div>
      <div
        className="w-8 h-8 border border-solid border-gray-300 rounded flex items-center justify-center p-1 cursor-pointer"
        onClick={handleBoxClick}
      >
        {selectedIcon ? (
          <div className="selected-icon">
            {icons.find(icon => icon.name === selectedIcon).icon}
          </div>
        ) : (
          <FaAws
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        )}
      </div>

      {showIcons && (
        <div
          className="bg-white p-1.5 rounded-lg shadow-md max-w-max"
        >
          {icons.map((icon, index) => (
            <div
              className={`my-1 cursor-pointer icon ${selectedIcon === icon.icon ? 'selected' : ''}`}
              key={index}
              onClick={() => handleIconClick(icon)}
            >
              {icon.icon}
              <span>{icon.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconPicker;
