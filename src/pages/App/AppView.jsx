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



export const renderAppText = (settings) => {
  // Input validation
  if (!settings) {
    return <p className="whitespace-nowrap">This is default app.</p>;
  }


  const EllipsisText = ({ setupText, viewText }) => (
    <>
      <p className="whitespace-nowrap">{setupText}</p>
      <svg viewBox="0 0 2 2" className=" max-md:hidden h-0.5 w-0.5 fill-current">
        <circle r={1} cx={1} cy={1} />
      </svg>
      <p className="whitespace-nowrap  visible max-sm:hidden overflow-hidden text-ellipsis max-w-full">
        {viewText}
      </p>
    </>
  );

  if (settings.setupType === 'automatic' && settings.viewType === 'embedded') {
    return <EllipsisText setupText={'All client see the same app content'} viewText={'Connected as embedded content'} />


  } else if (settings.setupType === 'automatic' && settings.viewType === 'link') {
    return <EllipsisText setupText={'All client see the same app content'} viewText={'Connected as link'} />


  } else if (settings.setupType === 'manual') {
    return <EllipsisText setupText={'Manually connect content for each client'} viewText={'Connected as embedded content'} />


  }
};



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
                    src={settings.content}
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


