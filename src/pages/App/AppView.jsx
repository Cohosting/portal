import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppConfigurationModal } from './AppConfigurationModal';
import { isValidBrandUrl } from '../../utils/validationUtils';

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}


export const renderAppContent = (settings, isLoading, handleIframeLoad) => {
  return (
    <Box height={'100%'}>
      {settings.viewType === 'embedded' ? (
        <>
          {isValidURL(settings.content) ? (
            <>
              {isLoading ? (
                <Flex>
                  <Spinner />
                </Flex>
              ) : (
                <iframe
                  title='app-iframe'
                  style={{
                    overflow: 'hidden'
                  }}
                  src={isValidBrandUrl(settings.content)}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  onLoad={handleIframeLoad}
                />
              )}
            </>
          ) : (
            <Box>
              <Box
                dangerouslySetInnerHTML={{
                  __html: settings.content,
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Box>
          <Text>This is a link. For the clients, it will open in a new tab</Text>
          <Text
            textDecor={'underline'}
            cursor={'pointer'}
            onClick={() => window.open(settings.content, '_blank')}
            color={'blue'}
          >
            Open the link
          </Text>
        </Box>
      )}
    </Box>
  );
}



export const AppView = ({
  app,
  clientId,
  isConnected,
  isOpen,
  onToggle,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  let tempSettings = {};
  if (app?.settings?.setupType === 'manual') {
    tempSettings = app.settings.clientsSettings.find(
      clientSettings => clientSettings.clientId === clientId
    );
  } else {
    tempSettings = app?.settings;
  }
  console.log(tempSettings);

  return (
    <Box h={'100%'}>
      {app?.settings?.setupType === 'automatic' && (
        renderAppContent(tempSettings)
      )}

      {app?.settings?.setupType === 'manual' && (
        <>
          {isConnected ? (
            renderAppContent(tempSettings, isLoading, handleIframeLoad)
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
        <AppConfigurationModal
          clientId={clientId}
          appId={app?.id}
          isOpen={isOpen}
          onClose={onToggle}
        />
      )}
    </Box>
  );

}


