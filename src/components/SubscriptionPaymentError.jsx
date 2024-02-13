import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Flex,
    Spacer,
    Button,
    Heading,
    useDisclosure,
} from '@chakra-ui/react';
import { SetupPaymentMethod } from './UI/SetupPaymentMethod';

const SubscriptionPaymentError = ({ errorCode, errorDetails, }) => {
    const { isOpen, onClose, onToggle } = useDisclosure();
    let message;
    let actionButton;

    const onUpdatePayment = () => {
        onToggle()
    }
    if (!errorDetails) return;

    switch (errorDetails.code) {
        case 'insufficient_funds':
            message = (
                <>
                    Uh oh, looks like your payment method doesn't have enough funds. Would you like to update your payment information?
                </>
            );
            actionButton = <Button colorScheme={'green'} onClick={onUpdatePayment}>Update Payment</Button>;
            break;
        case 'invalid_card_number':
            message = 'Something seems off with your card number. Please double-check and try again.';
            break;
        case 'card_declined':
            message = 'Your card was declined. Please try a different card or contact your card issuer for more information.';
            actionButton = <Button colorScheme={'green'} onClick={onUpdatePayment}>Update Payment</Button>;
            break;

        case 'expired_card':
            message = 'Your card has expired. Please use a card with a valid expiration date.';
            break;
        case 'incorrect_cvc':
            message = 'The security code (CVC) you entered is incorrect. Please try again.';
            break;
        case 'lost_or_stolen_card':
            message = 'Your card has been reported lost or stolen. Please use a different card.';
            break;
        case 'processing_error':
            message = 'There was a problem processing your payment. Please try again later or contact support if the issue persists.';
            break;
        default:
            message = 'There was an issue processing your payment. Please try again later.';
    }

    return (
        <Alert my={3} alignItems={'flex-start'} display={'flex'} flexDir={'column'} status="error" bg="red.200" borderRadius="md" shadow="md">
            <Flex alignItems={'center'} justifyContent="space-between" p={4}>
                <AlertIcon color="red.500" />
                <Heading fontSize="md" fontWeight="medium" as="h2">
                    Payment Error
                </Heading>
                <Spacer />
            </Flex>
            <AlertDescription color="gray.600" pb={4}>
                {message}
                &nbsp;
                &nbsp;
                {actionButton}

            </AlertDescription>
            <SetupPaymentMethod forFailedPayment={true} isOpen={isOpen} handleClose={onToggle} />

        </Alert>
    );
};

export default SubscriptionPaymentError;