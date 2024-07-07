// Import necessary hooks and libraries
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { usePortalData } from './react-query/usePortalData';
import { supabase } from '../lib/supabase';

export const useCustomizePortalLogic = () => {
    const { user } = useSelector(state => state.auth);
    // WARNING: Maybe in future we switch between portals, so passing portals as an array and selecting the first one for now
    const { data: portal } = usePortalData(user?.portals);
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [previousSetting, setPreviousSetting] = useState({});
    const [brandSettings, setBrandSettings] = useState({});
    const toast = useToast();

    // Logic to handle state updates
    const handleUpdateState = (key, value) => {
        setBrandSettings({
            ...brandSettings,
            [key]: value,
        });
    };

    // Logic to handle portal brand update
    const handleUpdatePortalBrand = async () => {
        try {
            setIsLoading(true);
            const { error } = await supabase.from('portals').update({
                brand_settings: brandSettings,
            }).eq('id', portal.id);

            if (error) {
                throw error;
            }


            toast({
                title: 'Settings updated.',
                description: 'The Setting has been successfully updated.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(`Error while updating`, error);
        }
    };

    useEffect(() => {
        if (portal && portal.brand_settings) {
            setBrandSettings(portal.brand_settings);
            setPreviousSetting(portal.brand_settings)
        }
    }, [portal]);
    useEffect(() => {
        if (previousSetting !== null) {
            const dataChanged = JSON.stringify(brandSettings) !== JSON.stringify(previousSetting);
            setHasChanges(dataChanged);
        }
    }, [brandSettings, previousSetting]);
    return {
        isLoading,
        hasChanges,
        brandSettings,
        handleUpdateState,
        handleUpdatePortalBrand,
    };
};