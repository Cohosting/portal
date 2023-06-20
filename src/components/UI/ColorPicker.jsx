import React, { useEffect, useState } from 'react';
import { Box, Input, Square, useOutsideClick } from '@chakra-ui/react';
import { SketchPicker } from 'react-color';

export const ColorPicker = ({ onCompletePick, field, defaultColor }) => {
  const [color, setColor] = React.useState(defaultColor);
  const [showPicker, setShowPicker] = useState(false);
  // Outside click

  const ref = React.useRef();
  useOutsideClick({
    ref: ref,
    handler: () => setShowPicker(false),
  });
  const handleChangeComplete = color => {
    setColor(color.hex);
    onCompletePick(field, color.hex);
  };

  const handleChange = color => {
    setColor(color.hex);
  };

  useEffect(() => {
    if (!defaultColor) return;
    setColor(defaultColor);
  }, [defaultColor]);

  return (
    <Box display="flex" alignItems="center" position={'relative'}>
      <Square
        onClick={() => setShowPicker(!showPicker)}
        size="45px"
        bg={color}
        border="1px solid #cacaca"
        borderRadius={'6px'}
        cursor="pointer"
      />
      <Input type="text" value={color} readOnly ml="10px" w="110px" />
      {showPicker && (
        <Box ref={ref}>
          <SketchPicker
            styles={{
              default: {
                picker: {
                  position: 'absolute',
                  top: '50px',
                  left: '0px',
                  zIndex: '1',
                },
              },
            }}
            onChange={handleChange}
            color={color}
            onChangeComplete={handleChangeComplete}
          />
        </Box>
      )}
    </Box>
  );
};
