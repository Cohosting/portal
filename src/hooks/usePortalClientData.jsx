import { useEffect, useState } from "react";
import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { supabase } from "../lib/supabase";

const usePortalClientData = (portal) => {
    const [clientData, setClientData] = useState([]);
    const { isOpen: isNotificationOpen, onToggle: toggleNotification } = useDisclosure();

    useEffect(() => {
        if (!portal) return;

        const getClientData = async () => {
            const { data: clients } = await supabase.from('clients').select('*').eq('portal_id', portal.id);


            setClientData(clients);

        }
        getClientData();


    }, [portal]);

    console.log(clientData)

    return {
        clientData,
        isNotificationOpen,
        toggleNotification,
    };
}





export default usePortalClientData;