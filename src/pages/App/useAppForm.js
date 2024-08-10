import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase';
import { usePortalData } from '../../hooks/react-query/usePortalData';

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
  const { user } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(user?.portals);

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
    try {
      if (!appId) {
        const { data, error } = await supabase.from('portal_apps').upsert({
          ...appState,
          portal_id: portal.id,
        });

        if (error) {
          setIsError(error);
          setIsLoading(false);
          return;
        }
      } else {
        const { data, error } = await supabase
          .from('portal_apps')
          .update({
            ...appState,
            portal_id: portal.id,
          })
          .match({ id: appId });

        if (error) {
          setIsError(error);
          setIsLoading(false);
          return;
        }
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
  };
};
