import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { isValidBrandUrl } from '../../utils';
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
export const ExtentionContent = ({ settings, clientId, settingType }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  let tempSettings = {};
  if (settingType === 'manual') {
    tempSettings = settings.clientsSettings.find(
      clientSettings => clientSettings.clientId === clientId
    );
  } else {
    tempSettings = settings;
  }
  console.log(tempSettings)

  return (
    <Box height={'100%'}>
      {tempSettings.viewType === 'embedded' ? (
        <>
          {isValidURL(tempSettings.content) ? (
            <>
              {isLoading ? (
                <Flex>
                  <Spinner />
                </Flex>
              ) : (
                <iframe
                    style={{
                      overflow: 'hidden'
                    }}
                  src={isValidBrandUrl(tempSettings.content)}
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
                  __html: tempSettings.content,
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Box>
          <Text>This is link. For the clients it will oepn in a new tab</Text>
          <Text
            textDecor={'underline'}
            cursor={'pointer'}
            onClick={() => window.open(tempSettings.content, '_blank')}
            color={'blue'}
          >
            Open the link
          </Text>
        </Box>
      )}
    </Box>
  );
};
