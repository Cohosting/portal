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

            const formattedClientData = clients.map(client => {
                return {
                    Name: generateNameComponent(client),
                    Email: generateEmailComponent(client, toggleNotification),
                    Status: client.status,
                    'Creation Date': client.created_at,
                };
            }
            );
            setClientData(formattedClientData);

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

// Helper Functions
function generateNameComponent(el) {
    return (
        <Flex alignItems={'center'}>
            <Flex
                alignItems={'center'}
                justifyContent={'center'}
                w={'30px'}
                h={'30px'}
                bg={'#7cae7a'}
                color={'white'}
                borderRadius={'4px'}
            >
                {el.name[0]}
            </Flex>
            <Box ml={3}>
                <Text>{el.name}</Text>
            </Box>
        </Flex>
    );
}

function generateEmailComponent(el, onToggleSuccess) {
    return (
        <Box>
            <Text>{el.email}</Text>
            {el.status === 'restricted' && (
                <Button mt={1} colorScheme='green' size={'xs'} onClick={onToggleSuccess}>
                    Invite
                </Button>
            )}
        </Box>
    );
}

export default usePortalClientData;