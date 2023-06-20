import {
  Box,
  Checkbox,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import React from 'react';
import IconPicker from './../../components/IconPicker';
export const AddAppForm = ({ appState, setAppState, mode }) => {
  const { name, icon, settings } = appState;
  const { setupType, viewType, content, autoSize } = settings;
  const handleIconSelect = icon => {
    setAppState({ ...appState, icon });
  };
  const handleInputChange = e => {
    setAppState({ ...appState, [e.target.name]: e.target.value });
  };
  const handleSettingsChange = (field, value) => {
    setAppState({
      ...appState,
      settings: {
        ...appState.settings,
        [field]: value,
      },
    });
  };

  return (
    <Box w={'80%'} margin={'auto'} mt={5}>
      <Text>Add app</Text>

      <Box my={4}>
        <Text>Name - How it should appear in the sidebar</Text>
        <Input onChange={handleInputChange} name="name" value={name} />
      </Box>

      <Box my={4}>
        <Text mb={1}>Select sidebar icon</Text>
        <IconPicker icon={icon} onIconSelect={handleIconSelect} />
      </Box>
      {mode !== 'edit' && (
        <Box my={4}>
          <Text>Setup type</Text>

          <Box mt={2}>
            <Select
              defaultValue={'automatic'}
              value={setupType}
              placeholder="Select option"
              onChange={e => {
                handleSettingsChange('setupType', e.target.value);
              }}
            >
              <option value="automatic">
                Automatic — All clients see the same content
              </option>
              <option value="manual">
                Manual — Manually connect content for each client
              </option>
            </Select>
          </Box>
        </Box>
      )}

      {setupType !== 'manual' && (
        <>
          <Box my={4}>
            <Text pb={2} borderBottom={'1px solid #eee'}>
              View Type
            </Text>

            <RadioGroup value={viewType} defaultValue={'embedded'}>
              <Stack>
                <Flex
                  borderBottom={'1px solid #eee'}
                  py={'10px'}
                  onClick={() => {
                    handleSettingsChange('viewType', 'embedded');
                  }}
                  cursor={'pointer'}
                >
                  <Radio value="embedded" />
                  <Box ml={2}>
                    <Text>Connected as emebedded content</Text>
                    <Text fontSize={'14px'}>
                      Shows directly into the portal
                    </Text>
                  </Box>
                </Flex>
                <Flex
                  onClick={() => {
                    handleSettingsChange('viewType', 'link');
                  }}
                  borderBottom={'1px solid #eee'}
                  py={'10px'}
                  cursor={'pointer'}
                >
                  <Radio value="link" />
                  <Box ml={2}>
                    <Text>Connected as link</Text>
                    <Text fontSize={'14px'}>
                      App opens in a new browser tab
                    </Text>
                  </Box>
                </Flex>
              </Stack>
            </RadioGroup>
          </Box>
          <Box my={4}>
            <Text>Content - can be public url</Text>
            <Textarea
              value={content}
              name="content"
              onChange={e => handleSettingsChange('content', e.target.value)}
              mt={1}
            />
          </Box>
          {viewType === 'embedded' && (
            <Box my={4}>
              <Checkbox
                isChecked={autoSize}
                onChange={e =>
                  handleSettingsChange('autoSize', e.target.checked)
                }
              >
                Auto size embed
              </Checkbox>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
