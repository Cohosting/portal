import { doc, updateDoc } from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { useToast } from '@chakra-ui/react';

export function useApps(portal) {
    const [list, setList] = useState([]);
    const [previousList, setPreviousList] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();

    // Effect to track previous list and detect changes
    useEffect(() => {
        if (JSON.stringify(previousList) !== JSON.stringify(list)) {
            setHasChanges(true);
        } else {
            setHasChanges(false);
        }
    }, [list]);

    useEffect(() => {
        if (!portal) return;
        // sort the apps
        const apps = portal.apps.sort((a, b) => a.index - b.index);
        setList(apps);
        setPreviousList(apps);
    }, [portal]);


    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            const portalRef = doc(db, 'portals', portal.id);
            await updateDoc(portalRef, {
                apps: list,
            });

            setHasChanges(false);
            setIsLoading(false);
            toast({
                title: 'App order updated.',
                description: 'The order of your apps has been successfully updated.',
                status: 'success',
                duration: 5000,
                isClosable: true,
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
            const portalRef = doc(db, 'portals', portal.id);
            setList(newList);
            await updateDoc(portalRef, {
                apps: newList,
            });

            toast({
                title: 'App deleted.',
                description: 'The app has been successfully deleted.',
                status: 'success',
                duration: 5000,
                isClosable: true,
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
            const portalRef = doc(db, 'portals', portal.id);
            setList(newList);
            await updateDoc(portalRef, {
                apps: newList,
            });

            toast({
                title: 'App updated.',
                description: 'The app has been successfully updated.',
                status: 'success',
                duration: 5000,
                isClosable: true,
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
