import React, { useEffect, useState, useRef } from 'react';
import { Box, Flex, Input, Square, useOutsideClick } from '@chakra-ui/react';
import { SketchPicker } from 'react-color';

export const BrandColorPicker = ({
  onCompletePick, field, defaultColor, title
}) => {
  const [color, setColor] = useState(defaultColor);
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef();

  useOutsideClick({
    ref: ref,
    handler: () => setShowPicker(false),
  });

  const handleChangeComplete = (color) => {
    setColor(color.hex);
    onCompletePick(field, color.hex);
  };

  const handleChange = (color) => {
    setColor(color.hex);
  };

  const handleInputChange = (event) => {
    const newColor = event.target.value;
    setColor(newColor);
    // Optionally, you can add validation for the input value to be a valid hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
      onCompletePick(field, newColor);
    }
  };

  useEffect(() => {
    if (!defaultColor) return;
    setColor(defaultColor);
  }, [defaultColor]);

  return (
    <Flex
      justifyContent={'space-between'}
      p={3}
      py={5}
      pl={0}
      flexDir={['column', 'row']}
      alignItems={['flex-start', 'center']}
    >
      <p className='text-sm font-semibold leading-6 text-gray-900'>{title}</p>
      <Box display="flex" alignItems="center" position={'relative'}>
        <Square
          onClick={() => setShowPicker(!showPicker)}
          size="35px"
          bg={color}
          border="1px solid #cacaca"
          borderRadius={'6px'}
          cursor="pointer"
        />
        <Input
          type="text"
          value={color}
          onChange={handleInputChange}
          ml="10px"
          h={'35px'}
          bg={'white'}
          w="105px"
        />
        {showPicker && (
          <Box ref={ref}>
            <SketchPicker
              color={color}
              onChange={handleChange}
              onChangeComplete={handleChangeComplete}
            />
          </Box>
        )}
      </Box>
    </Flex>
  );
};