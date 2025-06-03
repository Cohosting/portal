// Import necessary hooks and libraries
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePortalData } from './react-query/usePortalData';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

let defaultBrandSettings = {
    poweredByCopilot: false,
    sidebarBgColor: '#000000',
    sidebarTextColor: '#FFFFFF',
    sidebarActiveTextColor: '#FFFFFF',
    accentColor: '#000000',
    loginFormTextColor: '#000000',
    loginButtonColor: '#000000',
    loginButtonTextColor: '#000000',
    squareIcon: '',
    fullLogo: '',
    squareLoginImage: '',
}   

export const useCustomizePortalLogic = () => {
    const { user, currentSelectedPortal } = useSelector(state => state.auth);
    const { data: portal } = usePortalData(currentSelectedPortal);
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [previousSetting, setPreviousSetting] = useState({});
    const [brandSettings, setBrandSettings] = useState({});
    console.log({
        brandSettings
    })
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
            toast.success('Portal brand settings updated successfully', {
                position: 'bottom-center',
                style: {
                    fontSize: '16px',
                    width: '400px', // Increased width of the toast
                    maxWidth: '90%', // Ensure it doesn't exceed screen width on smaller devices
                },
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setPreviousSetting(brandSettings);
            setHasChanges(false);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(`Error while updating`, error);
        }
    };

    useEffect(() => {
        console.log({
            portal
        })
        if (portal && portal.brand_settings) {
            console.log(portal.brand_settings)
            setBrandSettings({
                ...defaultBrandSettings,
                ...portal.brand_settings,
            });
            setPreviousSetting({
                ...defaultBrandSettings,
                ...portal.brand_settings,
            })
        }
    }, [portal]);
    useEffect(() => {
        if (previousSetting !== null) {
            console.log({
                previousSetting,
            })
            const dataChanged = JSON.stringify(brandSettings) !== JSON.stringify(previousSetting);
            setHasChanges(dataChanged);
        }
    }, [brandSettings, previousSetting]);

    const resetBrandSettings = () => {
        setBrandSettings(previousSetting);
    }
    return {
        isLoading,
        hasChanges,
        brandSettings,
        handleUpdateState,
        handleUpdatePortalBrand,
        resetBrandSettings
    };
};