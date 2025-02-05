import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import { sortAndIndexData } from '../utils';

export function useApps(portal) {
    const [list, setList] = useState([]);
    const [previousList, setPreviousList] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Effect to track previous list and detect changes
    useEffect(() => {
        if (!previousList) return;
        if (JSON.stringify(previousList) !== JSON.stringify(list)) {
            setHasChanges(true);
        } else {
            setHasChanges(false);
        }
    }, [list]);

    useEffect(() => {
        if (!portal) return;
        // sort the apps
        const apps = sortAndIndexData(portal.portal_apps);
        setList(apps);
        setPreviousList(apps);
    }, [portal]);

    const handleUpdate = async () => {
        try {
            setIsLoading(true); 
            const { data, error } = await supabase
                .from('portal_apps')
                .upsert(list);

            if (error) {
                setIsLoading(false);
                console.log(`Could not update portal: ${error}`);
                return;
            }

            setHasChanges(false);
            setIsLoading(false);
            toast.success('The order of your apps has been successfully updated.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            setIsLoading(false);
            console.log(`Could not update portal: ${error}`);
        }
    };

    const handleDeleteApp = async id => {
        try {
            const newList = list.filter(item => item.id !== id);
            newList.forEach((item, index) => {
                item.index = index;
            });

            const { data, error } = await supabase
                .from('portal_apps')
                .delete()
                .eq('id', id);

            if (error) {
                console.log(`Error deleting app: ${error}`);
                return;
            }

            setList(newList);

            toast.success('The app has been successfully deleted.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.log(`Error deleting app: ${error}`);
        }
    };

    const markAsDisabled = async (id, value) => {
        try {
            const newList = list.map(item => {
                if (item.id === id) {
                    item.disabled = value;
                }
                return item;
            });
            const { data, error } = await supabase
                .from('portal_apps')
                .update({ disabled: value })
                .eq('id', id);

            if (error) {
                console.log(`Error updating app: ${error}`);
                return;
            }

            setList(newList);
            toast.success('The app has been successfully updated.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.log(`Error updating app: ${error}`);
        }
    };

    return {
        list,
        previousList,
        isLoading,
        hasChanges,
        setList,
        handleUpdate,
        handleDeleteApp,
        markAsDisabled,
    };
}
