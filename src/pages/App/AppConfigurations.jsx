import React, { useState, Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout } from '../Dashboard/Layout';
import { usePortalClients, usePortalData } from '../../hooks/react-query/usePortalData';
import { AppView } from './AppView';
import EmptyStateFeedback from '../../components/EmptyStateFeedback';
import {
  AppWindow,
  Pencil,
  MoreVertical,
  UserCircle,
  Settings2,
  ChevronLeft,
  CloudAlert,
  Trash,
  MousePointerClick,
  Loader
} from 'lucide-react';
import { useToggle } from 'react-use';
import PageHeader from '@/components/internal/PageHeader';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMediaQuery } from 'react-responsive';
import AlertDialog from '@/components/Modal/AlertDialog';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/hooks/react-query/queryKeys';
import queryClient from '@/hooks/react-query/queryClient';
import { toast } from 'react-toastify';

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
  <div className={`${isMobile ? 'w-full' : 'w-68'} border-r border-gray-200 overflow-y-auto`}>
    <PageHeader
      title="Clients"
      description="Select a client to view app configuration."
      titleFontSize="text-xl"
      descriptionFontSize="text-[15px]"
    />
    <ul>
      {
        clients.length === 0 && (
          <div>
            <p className="text-center mx-6 text-sm text-gray-500 mt-4">
              No clients found.
            </p>
          </div>
        )
      }
      {clients?.map((client) => (
        <li
          key={client.id}
          className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${currentSelectedMember === client.id ? 'bg-blue-50 border-l-3 border-blue-500' : ''}`}
          onClick={() => {
            setCurrentSelectedMember(client.id);
            if (isMobile) setShowClientList(false);
          }}
        >
          <UserCircle className="w-6 h-6 text-gray-400 mr-2" />
          <div>
            <p className="text-sm font-medium">{client.name}</p>
            <p className="text-xs text-gray-500">{client.role}</p>
          </div>
          {app.settings?.clientsSettings?.some(setting => setting.clientId === client.id) ? (
            <span className="ml-auto text-xs bg-green-100 text-green-800 py-0.5 px-1.5 rounded-full">
              Connected
            </span>
          ) : (
            <span className="ml-auto text-xs bg-red-100 text-red-800 py-0.5 px-1.5 rounded-full">
              Not Configured
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const AppHeader = ({
  app,
  navigate,
  onToggle,
  onDeleteWarning,
  currentSelectedMember,
  isMobile,
  setShowClientList
}) => {
  const handleBackClick = () => setShowClientList(true);
  const isTabletOrMobile = useMediaQuery({ maxWidth: 768 });

  const menu = (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex justify-center w-full p-[7px] text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        <MoreVertical className="w-5 h-5 text-gray-400" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 bg-white" align="end">
        <DropdownMenuItem
          onClick={() => navigate(`/apps/${app.id}/edit`)}
          className="cursor-pointer hover:bg-gray-100"
        >
          <Pencil className="w-4 h-4 mr-2" aria-hidden="true" />
          Edit App
        </DropdownMenuItem>
        {currentSelectedMember && (
          <>
            <DropdownMenuItem
              onClick={onToggle}
              className="cursor-pointer hover:bg-gray-100"
            >
              <Settings2 className="w-4 h-4 mr-2" aria-hidden="true" />
              Edit Client Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDeleteWarning}
              className="cursor-pointer hover:bg-gray-100"
            >
              <Trash className="w-4 h-4 mr-2" aria-hidden="true" />
              Delete Client Settings
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const action = (
    <div className="flex items-center gap-2">
      {isMobile && currentSelectedMember && (
        <button
          onClick={handleBackClick}
          className="mr-2 p-1 rounded-full hover:bg-gray-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {menu}
    </div>
  );

  return (
    <PageHeader
      showSidebar={isTabletOrMobile}
      title={app?.name || 'App'}
      description={'Manage your app settings and configurations.'}
      action={action}
      titleFontSize="text-xl"
      descriptionFontSize="text-[15px]"
    />
  );
};

export const AppConfigurations = () => {
  const { appId, clientId } = useParams();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [currentSelectedMember, setCurrentSelectedMember] = useState(clientId || null);
  const [showClientList, setShowClientList] = useState(!clientId);
  const { currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal, isLoading: isPortalLoading } = usePortalData(currentSelectedPortal);
  const { data: clients, isLoading: isClientsLoading } = usePortalClients(portal?.id);
  const app = portal?.portal_apps.find(app => app.id === appId);
  const [isOpen, toggleIsOpen] = useToggle(false);

  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isAutomaticApp = app?.settings?.setupType === 'automatic';

  useEffect(() => {
    if (clientId && clientId !== currentSelectedMember) {
      setCurrentSelectedMember(clientId);
      if (isMobile) setShowClientList(false);
    }
  }, [clientId, isMobile]);

  const handleClientSelection = (selectedClientId) => {
    setCurrentSelectedMember(selectedClientId);
    if (selectedClientId) {
      navigate(`/apps/${appId}/app-configurations/${selectedClientId}`, { replace: true });
    } else {
      navigate(`/apps/${appId}/app-configurations`, { replace: true });
    }
    if (isMobile) setShowClientList(false);
  };

  const handleClearClientSelection = () => {
    setCurrentSelectedMember(null);
    navigate(`/apps/${appId}/app-configurations`, { replace: true });
  };

  useEffect(() => {
    if (!isMobile) {
      setShowClientList(true);
    } else if (isMobile && !clientId) {
      setShowClientList(true);
    }
  }, [isMobile, clientId]);

  useEffect(() => {
    if (clientId && clients?.length) {
      const clientExists = clients.some(client => client.id === clientId);
      if (!clientExists) handleClearClientSelection();
    }
  }, [clientId, clients]);

  if (!portal?.portal_apps.filter(app => !app.is_default).length && appId === 'no-apps') {
    return (
      <Layout hideMobileNav>
        <PageHeader title="Apps" description="Manage your apps and their configurations." />
        <div className="mt-16">
          <EmptyStateFeedback
            IconComponent={AppWindow}
            title="Add an app to get started"
            message="You have not added any apps to your portal. Click the button below to add an app."
            buttonText="Add an app"
            onButtonClick={() => navigate('/apps/new')}
            centered
          />
        </div>
      </Layout>
    );
  }

  if (!app && !isPortalLoading) {
    return (
      <Layout hideMobileNav>
        <PageHeader title="Apps" description="Manage your apps and their configurations." />
        <div className="mt-16">
          <EmptyStateFeedback
            IconComponent={CloudAlert}
            title="App not found"
            message="The app you are looking for does not exist."
            buttonText="Go back to apps"
            onButtonClick={() => navigate('/apps')}
            centered
          />
        </div>
      </Layout>
    );
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleteLoading(true);
      const { data: appData, error: fetchError } = await supabase
        .from('portal_apps')
        .select('settings')
        .eq('id', appId)
        .single();

      if (fetchError) throw fetchError;

      const updatedClientSettings = (appData?.settings?.clientsSettings || []).filter(
        (setting) => setting.clientId !== currentSelectedMember
      );

      const { error: updateError } = await supabase
        .from('portal_apps')
        .update({
          settings: {
            ...appData.settings,
            clientsSettings: updatedClientSettings,
          },
        })
        .eq('id', appId);

      if (updateError) throw updateError;

      queryClient.setQueryData(queryKeys.portalData(currentSelectedPortal), (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          portal_apps: oldData.portal_apps.map(app =>
            app.id === appId
              ? { ...app, settings: { ...app.settings, clientsSettings: updatedClientSettings } }
              : app
          ),
        };
      });

      toast.success('Client settings deleted successfully');
    } catch (error) {
      toast.error('Failed to delete client settings');
      console.error(error);
    } finally {
      setIsDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <Layout hideMobileNav>
      {isPortalLoading || isClientsLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      ) : (
          <div className="flex h-full">
          {!isAutomaticApp && (!isMobile || (isMobile && showClientList)) && (
            <ClientList
              clients={clients}
              app={app}
              currentSelectedMember={currentSelectedMember}
              setCurrentSelectedMember={handleClientSelection}
              isMobile={isMobile}
              setShowClientList={setShowClientList}
            />
          )}
          <div className={`flex-1 flex flex-col overflow-hidden ${isMobile && showClientList && !isAutomaticApp ? 'hidden' : ''}`}>
            <AppHeader
              currentSelectedMember={currentSelectedMember}
              app={app}
              navigate={navigate}
              onToggle={toggleIsOpen}
              isMobile={isMobile}
              setShowClientList={setShowClientList}
              onDeleteWarning={() => setIsDeleteModalOpen(true)}
            />
            <div className="flex-1 overflow-y-auto">
              {isAutomaticApp ? (
                  <AppView isConnected={true} clientId={null} app={app} />
              ) : currentSelectedMember ? (
                <AppView
                  isConnected={app.settings?.clientsSettings?.some(setting => setting.clientId === currentSelectedMember)}
                  clientId={currentSelectedMember}
                  app={app}
                  onToggle={toggleIsOpen}
                  isOpen={isOpen}
                />
              ) : (
                <div className="flex mt-16 justify-center h-full text-sm text-gray-500">
                  <EmptyStateFeedback
                    IconComponent={MousePointerClick}
                    title="Select a client to view app configuration"
                    message="You have not selected any client. Click on a client from the list to view app configuration."
                    centered
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <AlertDialog
        title="Reset Settings for Client?"
        message="This action cannot be undone."
        confirmButtonText={isDeleteLoading ? 'Deleting...' : 'Delete'}
        cancelButtonText="Cancel"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        confirmButtonColor="bg-red-500"
      />
    </Layout>
  );
};
