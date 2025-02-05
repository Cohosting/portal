import { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { supabase } from "../lib/supabase";

const getClientData = async (portal) => {
    const { data: clients } = await supabase.from('clients').select('*').eq('portal_id', portal.id);
    return clients;
}

const usePortalClientData = (portal) => {
    const [clientData, setClientData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isNotificationOpen, toggleNotification] = useToggle(false);

    useEffect(() => {
        if (!portal) return;

        (async () => {
            try {
                setLoading(true);
                const clients = await getClientData(portal);
                setClientData(clients);
            } catch (error) {
                console.error('Error fetching client data:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        })()
    }, [portal]);

    const refetch = async () => {
        try {
            const clients = await getClientData(portal);
            setClientData(clients);
        } catch (error) {
            console.error('Error fetching client data:', error);
            throw error;
        }
    }

    return {
        clientData,
        isNotificationOpen,
        toggleNotification,
        loading,
        refetch
    };
}

export default usePortalClientData;