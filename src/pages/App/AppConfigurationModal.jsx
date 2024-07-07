import {
  Box,
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export const AppConfigurationModal = ({ isOpen, onClose, appId, clientId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [appSettings, setAppSettings] = useState({
    viewType: 'embedded',
    content: '',
    autoSize: true,
  });
  const [editAppSettings, setEditAppSettings] = useState(null);
  const { viewType, content, autoSize } = appSettings;

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      if (!editAppSettings) {


        // convert above code to supabase
        const { data: app } = await supabase
          .from('portal_apps')
          .select('*')
          .eq('id', appId)
          .single();
        await supabase
          .from('portal_apps')
          .update({
            settings: {
              ...app.settings,
              clientsSettings: [
                ...(app.settings.clientsSettings || []),
                {
                  ...appSettings,
                  clientId,
                },
              ],
            },
          })
          .eq('id', app.id);


      } else {
        let newClientsSettings = [...editAppSettings.settings.clientsSettings];
        const clientSettingsIndex = newClientsSettings.findIndex(
          client => client.clientId === clientId
        );
        if (clientSettingsIndex > -1) {
          newClientsSettings[clientSettingsIndex] = {
            ...appSettings,
            clientId,
          };
        } else {
          newClientsSettings = [
            ...newClientsSettings,
            {
              ...appSettings,
              clientId,
            },
          ];
        }

        const { error } = await supabase
          .from('portal_apps')
          .update({
            settings: {
              ...editAppSettings.settings,
              clientsSettings: newClientsSettings,
            },
          })
          .eq('id', editAppSettings.id);

        if (error) {
          throw error;
        }


      }

      setIsLoading(false);
      onClose();
    } catch (error) {
      console.log(`Error saving app settings: ${error}`);
    }
  };

  useEffect(() => {
    if (editAppSettings) return;
    const getAppData = async () => {

      const { data } = await supabase
        .from('portal_apps')
        .select('*')
        .eq('id', appId)
        .single();

      setEditAppSettings(data);

      // get settings for specific client
      const clientSettings = data.settings.clientsSettings.find(
        client => client.clientId === clientId
      );
      if (clientSettings) {
        setAppSettings(clientSettings);
      } else {
        console.log('no client settings');
      }
    };
    getAppData();

    return () => { };
  }, []);

  return (
    <Modal
      size={'2xl'}
      isOpen={isOpen}
      onClose={() => {
        console.log('clicked');
        setAppSettings({
          viewType: 'embedded',
          content: '',
          autoSize: true,
        });
        setEditAppSettings(null);

        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader p={3} borderBottom={'1px solid gray'}>
          <Text>Embed App</Text>
        </ModalHeader>
        <ModalCloseButton onClick={() => { }} />
        <ModalBody p={2} px={5}>
          <Box my={2}>
            <Text>View type</Text>
            <Select
              value={viewType}
              placeholder="Select option"
              onChange={e => {
                setAppSettings({
                  ...appSettings,
                  viewType: e.target.value,
                });
              }}
            >
              <option value="embedded">
                Show as embed - App shows directly in your Portal
              </option>
              <option value="link">
                Show as link - App opens in a new browser tab
              </option>
            </Select>
          </Box>
          <Box my={2}>
            <Text>Can be public Url</Text>
            <Textarea
              value={content}
              name="content"
              onChange={e => {
                setAppSettings({
                  ...appSettings,
                  content: e.target.value,
                });
              }}
              mt={1}
            />
          </Box>
          {viewType === 'embedded' && (
            <Flex my={2}>
              <Checkbox
                isChecked={autoSize}
                onChange={e => {
                  setAppSettings({
                    ...appSettings,
                    autoSize: e.target.checked,
                  });
                }}
              />
              <Text ml={2}>Auto size embed</Text>
            </Flex>
          )}
        </ModalBody>

        <ModalFooter>
          <Flex
            borderTop={'1px solid gray'}
            alignItems={'center'}
            justifyContent={'flex-end'}
            w={'100%'}
            pt={3}
          >
            <Button size={'md'} variant={'outline'}>
              Cancel
            </Button>
            <Button
              ml={2}
              size={'md'}
              isLoading={isLoading}
              onClick={handleSaveSettings}
            >
              Save
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
