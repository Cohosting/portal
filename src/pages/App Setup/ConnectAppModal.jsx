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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import queryString from 'query-string';

export const ConnectAppModal = ({ isOpen, onClose, extentionId, clientId }) => {
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
        const ref = doc(db, 'apps', extentionId);
        const snapshot = await getDoc(ref);
        const app = snapshot.data();
        await updateDoc(doc(db, 'apps', app.id), {
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
        });
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
        await updateDoc(doc(db, 'apps', extentionId), {
          settings: {
            ...editAppSettings.settings,
            clientsSettings: newClientsSettings,
          },
        });
      }

      setIsLoading(false);
      onClose();
    } catch (error) {
      console.log(`Error saving app settings: ${error}`);
    }
  };

  useEffect(() => {
    if (editAppSettings) return;
    const getExtention = async () => {
      const extention = await getDoc(doc(db, 'apps', extentionId));
      let data = extention.data();
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
    getExtention();

    return () => {};
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
        <ModalCloseButton onClick={() => {}} />
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
