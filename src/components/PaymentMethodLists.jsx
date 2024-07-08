import { Flex, Box, Text, Icon, Stack, Divider, Button, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AiFillBank } from "react-icons/ai";
import { FaPlus, FaRegCreditCard } from "react-icons/fa";
import { SetupPaymentMethod } from "./UI/SetupPaymentMethod";
import { useSelector } from "react-redux";
import { usePortalData } from "../hooks/react-query/usePortalData";

const PaymentMethodList = ({ }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { isOpen, onToggle } = useDisclosure();

    const { user } = useSelector(state => state.auth)
    const { data: portal } = usePortalData(user.portals)
    useEffect(() => {
        if (!portal) return;

        const fetchPaymentMethods = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${process.env.REACT_APP_NODE_URL}/customers/${portal.customerId}/payment-methods`);
                const data = await response.json();
                console.log({ response })
                setPaymentMethods(data);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentMethods();
    }, [portal]);

    return (
        <Flex mx={3} direction="column" gap={4}>
            <Text fontWeight={700} fontSize={'26px'} >All payment methods</Text>
            {paymentMethods.map((paymentMethod) => (
                <Box
                    key={paymentMethod.id}
                    px={4}
                    py={3}
                    borderRadius="md"
                    boxShadow="md"
                    backgroundColor="gray.50"
                    _hover={{ backgroundColor: "gray.100" }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Icon
                                as={paymentMethod.type === "card" ? FaRegCreditCard : AiFillBank}
                                color={paymentMethod.type === "card" ? "purple.500" : "teal.500"}
                                mr={2}
                            />
                            <Text fontWeight="bold">{paymentMethod.type}</Text>
                        </Box>
                        {paymentMethod.isDefault && (
                            <Text color="green.500">Default</Text>
                        )}
                    </Stack>
                    <Divider my={2} />
                    <Text>
                        {paymentMethod.maskedNumber}{paymentMethod.type === "card" && ` (${paymentMethod.expDate})`}
                    </Text>
                </Box>
            ))}
            <Button colorScheme={"facebook"} borderRadius={'100%'} my={2} w={'50px'} height={'50px'} onClick={onToggle}><FaPlus /></Button>
            <SetupPaymentMethod
                isOpen={isOpen}
                handleClose={onToggle}
            />

            <Button onClick={async () => {
                const res = await fetch(`${process.env.REACT_APP_NODE_URL}/customers/create-customer-portal-session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        customerId: portal.customerId
                    }),

                });
                const data = await res.json();

                window.location.href = data.url

                console.log(data)
            }} colorScheme="green" w={'min-content'} my={3} mt={1} >Manage payment method</Button>
        </Flex>
    );
};

export default PaymentMethodList;