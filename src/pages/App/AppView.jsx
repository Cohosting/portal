import React, { useEffect, useState, useRef } from 'react';
import { AppConfigurationModal } from './AppConfigurationModal';
import { isValidBrandUrl, isValidURL } from '../../utils/validationUtils';
import Button from '../../components/internal/Button/Button';
import { useParams } from 'react-router-dom';
import EmptyStateFeedback from '@/components/EmptyStateFeedback';
import { Layers, Plug,   } from 'lucide-react';

const EllipsisText = ({ setupText, viewText }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    <p className="whitespace-nowrap">{setupText}</p>
    <span className="hidden md:inline">•</span>
    <p className="hidden sm:block whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
      {viewText}
    </p>
  </div>
);

export const renderAppText = (settings) => {
  console.log({ settings });
  if (!settings) {
    return <p className="text-sm text-gray-600">Nothing is configured for this app.</p>;
  }

  if (settings.setupType === 'automatic' && settings.viewType === 'embedded') {
    return <EllipsisText setupText="All clients see the same app content" viewText="Connected as embedded content" />;
  } else if (settings.setupType === 'automatic' && settings.viewType === 'link') {
    return <EllipsisText setupText="All clients see the same app content" viewText="Connected as link" />;
  } else if (settings.setupType === 'manual') {
    return <EllipsisText setupText="Manually connect content for each client" viewText="Connected as embedded content" />;
  }
};

export const renderAppContent = (settings, isLoading, setIsLoading) => {
  console.log({ isLoading });
  if (settings.viewType === 'embedded') {
    if (isValidURL(settings.content)) {
      return (
        <div className="w-full h-full">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          <iframe
            title="app-iframe"
            className={`w-full h-full ${isLoading ? 'hidden' : ''}`}
            src={settings.content.startsWith('http') ? settings.content : `https://${settings.content}`}
            onLoad={() => setIsLoading(false)}
            allowFullScreen

          />
        </div>
      );
    } else {
      return (
        <div className="w-full h-full p-4 px-6 bg-white   shadow-inner overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: settings.content }} />
        </div>
      );
    }
  } else {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <p className="text-sm text-gray-600 mb-2">This is a link. For the clients, it will open in a new tab.</p>
        <a
          href={settings.content.startsWith('http') ? settings.content : `https://${settings.content}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Open the link
        </a>
      </div>
    );
  }
};

export const AppView = ({ app, clientId, isConnected, isOpen, onToggle }) => {
  const [isLoading, setIsLoading] = useState(true);

  let tempSettings = app?.settings?.setupType === 'manual'
    ? app.settings.clientsSettings.find(clientSettings => clientSettings.clientId === clientId)
    : app?.settings;

console.log({
  tempSettings
})
 
  return (
    <div className="  flex flex-col">
 
      <div className="flex-grow overflow-hidden">
        {app?.settings?.setupType === 'automatic' && renderAppContent(tempSettings, isLoading, setIsLoading)}
        {app?.settings?.setupType === 'manual' && (
          <>
            {isConnected ? (
              renderAppContent(tempSettings, isLoading, setIsLoading)
            ) : (
 
              <div className='mt-16'>
                <EmptyStateFeedback

                centered
                  title={'Embed an App'}
                  message={'You can embed an App like Google Data Studio here to share with clients.'}
                   buttonText={'Connect'}
                   onButtonClick={onToggle}
                   IconComponent={Layers}
                   customButtonIcon={Plug}
                />
              </div>
            )}
          </>
        )}
      </div>
      {isOpen && (
        <AppConfigurationModal
          clientId={clientId}
          appId={app?.id}
          isOpen={isOpen}
          onClose={onToggle}
        />
      )}
    </div>
  );
};