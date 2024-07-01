// Import necessary hooks and libraries
import { useContext, useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@chakra-ui/react';
import { db } from '../lib/firebase';
import { useSelector } from 'react-redux';
import { usePortalData } from './react-query/usePortalData';

export const useCustomizePortalLogic = () => {
    const { user } = useSelector(state => state.auth);
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
            const ref = doc(db, 'portals', portal.id);
            await updateDoc(ref, {
                brandSettings,
            });
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
        if (portal && portal.brandSettings) {
            setBrandSettings(portal.brandSettings);
            setPreviousSetting(portal.brandSettings)
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