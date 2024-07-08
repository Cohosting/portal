import React, { useEffect, useState } from 'react';
import { Box, Flex, Input, Square, Text, useOutsideClick } from '@chakra-ui/react';
import { SketchPicker } from 'react-color';

export const BrandColorPicker = ({
  onCompletePick, field, defaultColor, title
}) => {
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


    <Flex
      borderTop={'1px solid gray'}
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
        <Input type="text" value={color} readOnly ml="10px" h={'35px'} bg={'white'} w="105px" />
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
    </Flex>
  );
};
