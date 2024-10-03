import React, { useState, Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Layout } from '../Dashboard/Layout';
import { usePortalClients, usePortalData } from '../../hooks/react-query/usePortalData';
import { AppView } from './AppView';
import EmptyStateFeedback from '../../components/EmptyStateFeedback';
import { SquaresPlusIcon, PencilIcon, EllipsisVerticalIcon, UserCircleIcon, Cog6ToothIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useDisclosure } from '@chakra-ui/react';
import { Spinner } from '@phosphor-icons/react';

// Custom hook for handling window resize
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const ClientList = ({ clients, app, currentSelectedMember, setCurrentSelectedMember, isMobile, setShowClientList }) => (
  <div className={`${isMobile ? 'w-full' : 'w-64'} border-r border-gray-200 overflow-y-auto`}>
    <h2 className="text-base font-semibold p-3 border-b border-gray-200">Clients</h2>
    <ul>
      {clients?.map((client) => (
        <li
          key={client.id}
          className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${currentSelectedMember === client.id ? 'bg-blue-50 border-l-3 border-blue-500' : ''
            }`}
          onClick={() => {
            setCurrentSelectedMember(client.id);
            if (isMobile) setShowClientList(false);
          }}
        >
          <UserCircleIcon className="w-6 h-6 text-gray-400 mr-2" />
          <div>
            <p className="text-sm font-medium">{client.name}</p>
            <p className="text-xs text-gray-500">{client.role}</p>
          </div>
          {app.settings?.clientsSettings?.some(setting => setting.clientId === client.id) && (
            <span className="ml-auto text-xs bg-green-100 text-green-800 py-0.5 px-1.5 rounded-full">
              Connected
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const AppHeader = ({ app, navigate, onToggle, currentSelectedMember, isMobile, setShowClientList }) => (
  <div className="flex justify-between items-center border-b border-gray-200 px-3 py-[6px]">
    {isMobile && currentSelectedMember && (
      <button
        onClick={() => setShowClientList(true)}
        className="mr-2 p-1 rounded-full hover:bg-gray-200"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
    )}
    <h1 className="text-lg font-bold">{app?.name}</h1>
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex justify-center w-full p-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <EllipsisVerticalIcon
            className="w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <MenuItem>
              {({ active }) => (
                <button
                  className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  onClick={() => navigate(`/apps/${app.id}/edit`)}
                >
                  <PencilIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                  Edit App
                </button>
              )}
            </MenuItem>
            {currentSelectedMember && (
              <MenuItem>
                {({ active }) => (
                  <button
                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    onClick={() => onToggle()}
                  >
                    <Cog6ToothIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                    Edit Client Settings
                  </button>
                )}
              </MenuItem>
            )}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  </div>
);

export const AppConfigurations = () => {
  const { appId } = useParams();
  const [currentSelectedMember, setCurrentSelectedMember] = useState(null);
  const [showClientList, setShowClientList] = useState(true);
  const { currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal, isLoading: isPortalLoading } = usePortalData(currentSelectedPortal);
  const { data: clients, isLoading: isClientsLoading } = usePortalClients(portal?.id);
  const app = portal?.portal_apps.find(app => app.id === appId);
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
  const navigate = useNavigate();

  const { width } = useWindowSize();
  const isMobile = width < 768;

  const isAutomaticApp = app?.settings?.setupType === 'automatic';

  useEffect(() => {
    if (!isMobile) {
      setShowClientList(true);
    }
  }, [isMobile]);

  if (!portal?.portal_apps.filter((app) => !app.is_default).length && appId === 'no-apps') {
    return (
      <Layout>
        <div className="mt-16">
          <EmptyStateFeedback
            IconComponent={SquaresPlusIcon}
            title="Add an app to get started"
            message="You have not added any apps to your portal. Click the button below to add an app."
            buttonText="Add an app"
            onButtonClick={() => navigate('/apps/new')}
          />
        </div>
      </Layout>
    );
  }
  console.log({
    isAutomaticApp,
    isMobile,
    showClientList
  })
  return (
    <Layout>
      {
        isPortalLoading || isClientsLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className={`flex h-full  `}>
            {!isAutomaticApp && (!isMobile || (isMobile && showClientList)) && (
              <ClientList
                clients={clients}
                app={app}
                currentSelectedMember={currentSelectedMember}
                setCurrentSelectedMember={setCurrentSelectedMember}
                isMobile={isMobile}
                setShowClientList={setShowClientList}
              />
              )}
              <div className={`flex-1 flex flex-col overflow-hidden ${isMobile && showClientList && !isAutomaticApp ? 'hidden' : ''}`}>
                <AppHeader
                  currentSelectedMember={currentSelectedMember}
                  app={app}
                  navigate={navigate}
                  onToggle={onToggle}
                  isMobile={isMobile}
                  setShowClientList={setShowClientList}
                />
                <div className="flex-1 overflow-y-auto">
                  {isAutomaticApp ? (
                    <AppView
                      isConnected={true}
                      clientId={null}
                      app={app}
                    />
                  ) : currentSelectedMember ? (
                    <AppView
                      isConnected={app.settings?.clientsSettings?.some(setting => setting.clientId === currentSelectedMember)}
                      clientId={currentSelectedMember}
                      app={app}
                        onToggle={onToggle}
                        isOpen={isOpen}
                      />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-500">
                    {isMobile ? "Select a client to view app configuration" : "Select a client from the list to view app configuration"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

    </Layout>
  );
};