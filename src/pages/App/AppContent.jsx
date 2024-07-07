import { Box, Button, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { isValidBrandUrl } from '../../utils';
import { ConnectAppModal } from './ConnectAppModal';
import { ExtentionContent } from './AppView';

export const AppContent = ({
  extention,
  clientId,
  isConnected,
  isOpen,
  onToggle,
}) => {
  console.log(extention)
  return (
    <Box h={'100%'}>
      {extention?.settings?.setupType === 'automatic' && (
        <ExtentionContent settings={extention?.settings} />
      )}

      {extention?.settings?.setupType === 'manual' && (
        <>
          {isConnected ? (
            <ExtentionContent
              clientId={clientId}
              settingType={'manual'}
              settings={extention?.settings}
            />
          ) : (
            <Box height={'100%'} p={'50px'}>
              <Text>Embed an App</Text>
              <Text my={2}>
                You can embed an App like Google Data Studio here to share with
                clients.
              </Text>
              <Button
                onClick={() => onToggle()}
                bg={'black'}
                color={'white'}
                w={'sm'}
              >
                Connect
              </Button>
            </Box>
          )}
        </>
      )}

      {isOpen && (
        <ConnectAppModal
          clientId={clientId}
          extentionId={extention?.id}
          isOpen={isOpen}
          onClose={onToggle}
        />
      )}
    </Box>
  );
};
