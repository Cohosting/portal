import { Fragment, useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, Transition, TransitionChild } from '@headlessui/react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';

export const AppConfigurationModal = ({ isOpen, onClose, appId, clientId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [appSettings, setAppSettings] = useState({
    viewType: 'embedded',
    content: '',
    autoSize: true,
    setupType: 'manual',
  });
  const [editAppSettings, setEditAppSettings] = useState(null);
  const { viewType, content, autoSize } = appSettings;

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const { data: app } = await supabase
        .from('portal_apps')
        .select('*')
        .eq('id', appId)
        .single();

      const updatedSettings = editAppSettings
        ? updateClientSettings(editAppSettings.settings.clientsSettings)
        : [
          ...(app.settings.clientsSettings || []),
          { ...appSettings, clientId },
        ];

      await supabase
        .from('portal_apps')
        .update({
          settings: {
            ...app.settings,
            clientsSettings: updatedSettings,
          },
        })
        .eq('id', appId);

      toast.success('App settings saved');

      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error(`Error saving app settings: ${error}`);
    }
  };

  const updateClientSettings = (currentSettings) => {
    const index = currentSettings.findIndex(
      (client) => client.clientId === clientId
    );
    if (index > -1) {
      currentSettings[index] = { ...appSettings, clientId };
    } else {
      currentSettings.push({ ...appSettings, clientId });
    }
    return currentSettings;
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
      const clientSettings = data.settings.clientsSettings.find(
        (client) => client.clientId === clientId
      );
      clientSettings && setAppSettings(clientSettings);
    };
    getAppData();
  }, [appId, clientId, editAppSettings]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-[1000] inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                Embed App
              </Dialog.Title>
              <div className="mt-2 space-y-4">
                <div>
                  <label htmlFor="viewType" className="block text-sm font-medium text-gray-700">
                    View Type
                  </label>
                  <select
                    id="viewType"
                    name="viewType"
                    value={viewType}
                    onChange={(e) => setAppSettings({ ...appSettings, viewType: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="embedded">Show as embed - App shows directly in your Portal</option>
                    <option value="link">Show as link - App opens in a new browser tab</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Can be public URL
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows="3"
                    value={content}
                    onChange={(e) => setAppSettings({ ...appSettings, content: e.target.value })}
                    className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                {viewType === 'embedded' && (
                  <div className="flex items-start">
                    <input
                      id="autoSize"
                      name="autoSize"
                      type="checkbox"
                      checked={autoSize}
                      onChange={(e) => setAppSettings({ ...appSettings, autoSize: e.target.checked })}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label htmlFor="autoSize" className="ml-3 block text-sm font-medium text-gray-700">
                      Auto size embed
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-5 sm:mt-6 flex justify-end">
                <button
                  type="button"
                  className="mr-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-300 text-base font-medium text-gray-700 hover:bg-gray-400 sm:text-sm"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white ${isLoading ? 'cursor-not-allowed' : 'hover:bg-indigo-700'} sm:text-sm`}
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                >
                  {
                    isLoading ? 'Saving...' : 'Save'
                  }
                </button>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
