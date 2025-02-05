import React from 'react';
import IconPicker from '../../components/IconPicker';
import InputField from '../../components/InputField';
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
    console.log({
      field, value
    })
    setAppState({
      ...appState,
      settings: {
        ...appState.settings,
        [field]: value,
      },
    });
  };
  const trimExcessiveSpaces = (str) => {
    // Trim leading and trailing whitespace
    str = str.trim();

    // Replace sequences of more than one space with a single space
    // This preserves single spaces between words
    return str.replace(/\s{2,}/g, ' ');
  };

  return (
    <>
      <h1 className='font-semibold text-xl mb-7'>
        {mode === 'edit' ? 'Edit' : 'Create New Application'}
      </h1>

      <div className="my-4">
        <p className='block text-sm font-medium leading-6 text-gray-900'>Name - How it should appear in the sidebar</p>
        <InputField
          name="name"
          value={name}
          handleChange={handleInputChange}
          required
        />
      </div>

      <div className="my-4">
        <p className='block text-sm font-medium leading-6 text-gray-900 mb-1'>Select sidebar icon</p>
        <IconPicker icon={icon} onIconSelect={handleIconSelect} />
      </div>

      {mode !== 'edit' && (
        <div className="my-4">
          <div className="mt-2 relative">
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
          </div>
        </div>
      )}

      {setupType !== 'manual' && (
        <>
          <div className="my-4">
            <div className='mt-2.5 divide-y divide-gray-20'>
              <AppRadio
                value="embedded"
                label="Connected as embedded content"
                description="Shows directly into the portal"
                handleClick={(e) => handleSettingsChange('viewType', 'embedded')}
              />
              <AppRadio
                value="link"
                label="Connected as link"
                description="App opens in a new browser tab"
                handleClick={(e) => handleSettingsChange('viewType', 'link')}
              />
            </div>
          </div>

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
                value={content}
                onChange={e => handleSettingsChange('content', e.target.value)}
              />
            </div>
          </div>

          {viewType === 'embedded' && (
            <div className="flex items-center my-4">
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
              <p className='ml-4'>Auto size</p>
            </div>
          )}
        </>
      )}
    </>
  );
};
