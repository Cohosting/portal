import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Textarea,
} from '@chakra-ui/react';
import IconPicker from '../../components/IconPicker';
import InputField from '../../components/InputField';
import Example from '../../components/Example';
import AppRadio from '../../components/Radio/AppRadio';
import { Switch } from '@headlessui/react';
import Select from '../../components/Select';

export const AppFormFields = ({ mode, appState, setAppState }) => {
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
    <>
      <h1 className=' font-semibold text-xl mb-7 '>
        {mode === 'edit' ? 'Edit' : 'Create New Application'}
      </h1>

      <Box my={4}>
        <Text className='block text-sm font-medium leading-6 text-gray-900'>Name - How it should appear in the sidebar</Text>
        <InputField
          name="name"
          value={name}
          handleChange={handleInputChange}
          required
        />

      </Box>

      <Box my={4}>
        <Text mb={1} className='block text-sm font-medium leading-6 text-gray-900' >Select sidebar icon</Text>
        <IconPicker icon={icon} onIconSelect={handleIconSelect} />
      </Box>

      {mode !== 'edit' && (
        <Box my={4}>
          <Box mt={2} pos={'relative'}>
            <Select
              list={['Automatic — All clients see the same content', 'Manual — Manually connect content for each client',]}
              selected={
                setupType === 'automatic'
                  ? 'Automatic — All clients see the same content'
                  : 'Manual — Manually connect content for each client'
              }
              setSelected={value => {
                if (value === 'Automatic — All clients see the same content') {
                  value = 'automatic';
                } else if (value === 'Manual — Manually connect content for each client') {
                  value = 'manual';
                }
                handleSettingsChange('setupType', value);
              }}
              label="Select setup type"
            />
          </Box>
        </Box>
      )}

      {setupType !== 'manual' && (
        <>
          <Box my={4}>
            <div className='mt-2.5 divide-y divide-gray-20'>
              <AppRadio
                value="embedded"
                label="Connected as embedded content"
                description="Shows directly into the portal"
                handleChange={(e) => handleSettingsChange('viewType', e.target.value)}
              />
              <AppRadio
                value="link"
                label="Connected as link"
                description="App opens in a new browser tab"
                handleChange={(e) => handleSettingsChange('viewType', e.target.value)}
              />
            </div>
          </Box>


          <div>
            <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
              Content - can be public url
            </label>
            <div className="mt-2">
              <textarea
                id="comment"
                name="comment"
                rows={4}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={''}
                onChange={e => handleSettingsChange('content', e.target.value)}

              />
            </div>
          </div>

          {viewType === 'embedded' && (
            <Flex alignItems={'center'} my={4}>
              <Switch
                checked={autoSize}
                onChange={value =>
                  handleSettingsChange('autoSize', value)
                }
                className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                />
              </Switch>
              <p className='ml-4' >Auto size</p>
            </Flex>
          )}
        </>
      )}
    </>
  );
};
