import { Box } from '@chakra-ui/react';
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
      <Box
        w={'30px'}
        height={'30px'}
        border={'1px solid'}
        borderRadius={'4px'}
        onClick={handleBoxClick}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        p={1}
        cursor={'pointer'}
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
      </Box>

      {showIcons && (
        <Box
          bg={'white'}
          p={'5px'}
          borderRadius={'6px'}
          boxShadow={' rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'}
          className="icon-list"
          w={'max-content'}
        >
          {icons.map((icon, index) => (
            <Box
              my={1}
              cursor={'pointer'}
              key={index}
              className={`icon ${selectedIcon === icon.icon ? 'selected' : ''}`}
              onClick={() => handleIconClick(icon)}
            >
              {icon.icon}
              <span>{icon.name}</span>
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
};

export default IconPicker;
