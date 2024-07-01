import { collection, onSnapshot, query, where, } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";

const usePortalMembers = (portal) => {
    const [clients, setClients] = useState([]);
    const { isOpen: isOpenSuccess, onToggle: onToggleSuccess } = useDisclosure();

    useEffect(() => {
        if (!portal) return;

        const collecRef = collection(db, 'portalMembers');
        const q = query(collecRef, where('portalId', '==', portal.id));

        const unsubscribe = onSnapshot(q, querySnapshot => {
            const clients = querySnapshot.docs.map(doc => {
                const el = doc.data();
                return {
                    Name: generateNameComponent(el),
                    Email: generateEmailComponent(el, onToggleSuccess),
                    Status: el.status,
                    'Creation date': el.createdAt,
                };
            });
            setClients(clients);
        }, (error) => {
            console.error("Failed to fetch portal members:", error);
            // Handle the error appropriately
        });

        return () => unsubscribe();
    }, [portal]);

    return {
        clients,
        isOpenSuccess,
        onToggleSuccess,
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

export default usePortalMembers;