import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { isValidURL } from '../../utils/validationUtils';
import { useQueryClient } from 'react-query';
import { queryKeys } from '../../hooks/react-query/queryKeys';

export const useAppForm = () => {
  const [appState, setAppState] = useState({
    name: '',
    icon: '',
    settings: {
      autoSize: false,
      setupType: 'automatic',
      viewType: 'embedded',
      content: '',
      clientsSettings: [],
    },
  });
  const { appId } = useParams();
  const [mode, setMode] = useState('new');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!appId) {
      setIsFetching(false);
      setMode('new');
      return;
    }
    (async () => {
      // update this logic to supabase
      const getExtention = async () => {
        setIsFetching(true);

        const { data, error } = await supabase
          .from('portal_apps')
          .select('*')
          .eq('id', appId)
          .single();

        if (error) {
          setIsError(error);
          setIsFetching(false);
          return;
        }
        setAppState(data);
        setIsFetching(false);
        setMode('edit');
      };
      getExtention();
    })();
  }, [appId]);

  const handleSubmit = async () => {

    setIsLoading(true);
    console.log({
      content: appState.settings.content,
    });
    try {
      if (!appId) {
        // validate input
        if (!appState.name) {
          setIsError('Name is required');
          setIsLoading(false);
          return;
        }
        if (
          !appState.settings.setupType === 'manual' &&
          !appState.settings.content
        ) {
          setIsError('Content is required');
          setIsLoading(false);
          return;
        }
        // check valid url
        console.log({
          viewType: appState.settings.viewType,
          content: appState.settings.content,
          isValidURL: isValidURL(appState.settings.content),
        });
        if (
          appState.settings.viewType === 'link' &&
          !isValidURL(appState.settings.content)
        ) {
          setIsError('Invalid URL');
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.from('portal_apps').upsert({
          ...appState,
          name: appState.name.trim(),
          portal_id: portal.id,
        });

        await queryClient.invalidateQueries(queryKeys.portalData(portal.id));

        if (error) {
          setIsError(error);
          setIsLoading(false);
          return;
        }
      } else {
        // check valid url
        const isAutomaticApp = appState?.settings?.setupType === 'automatic';

        if (
          isAutomaticApp &&
          appState.settings.viewType === 'link' &&
          !isValidURL(appState.settings.content)
        ) {
          setIsError('Invalid URL');
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('portal_apps')
          .update({
            ...appState,
            portal_id: portal.id,
            name: appState.name.trim(),
         })
          .match({ id: appId });

        if (error) {
          setIsError(error);
          setIsLoading(false);
          return;
        }
        await queryClient.invalidateQueries(queryKeys.portalData(portal.id));
      }
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      console.log('Error creating apps: ', error);
      setIsError(error);
      setIsLoading(false);
    }
  };

  return {
    appState,
    setAppState,
    appId,
    isLoading,
    isFetching,
    handleSubmit,
    mode,
    isError,
  };
};
