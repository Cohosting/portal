import { Button, Flex } from '@chakra-ui/react';
import React from 'react';

export const ActionButtons = ({
  cancelText = 'Cancel',
  updateText = 'Update',
  onCancel,
  onUpdate,
  shouldShow = true,
  isLoading,
}) => {
  return (
    <Flex
      p={4}
      py={6}
      borderBottom={'1px solid #c7d1e0'}
      alignItems={'center'}
      justifyContent={'flex-end'}
      height={'45px'}
    >
      {shouldShow && (
        <>
          <Button size={'md'} onClick={onCancel} variant={'outine'}>
            {cancelText}
          </Button>
          <Button
            bg={'black'}
            color={'white'}
            isLoading={isLoading}
            size={'md'}
            onClick={onUpdate}
          >
            {updateText}
          </Button>
        </>
      )}
    </Flex>
  );
};
