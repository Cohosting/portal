import { Box } from '@chakra-ui/react';
import React from 'react'
const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.3s ease',
    zIndex:0,
  };
  
  const visibleOverlayStyle = {
    opacity: 1,
    visibility: 'visible',
  };
export const Overlay = ({isOpen}) => {
  return (
    <Box  sx={isOpen ? { ...overlayStyle, ...visibleOverlayStyle } : overlayStyle} height={'100%'} w={'100%'} bg={'red'}  />
  )
}
