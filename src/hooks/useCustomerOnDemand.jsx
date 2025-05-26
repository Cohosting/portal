import { useCallback, useState } from 'react';
import { createCustomer, updateCustomerInPortal } from './../services/portalServices';

const useCustomerOnDemand = () => {
    const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

    // The function now accepts parameters
    const createCustomerIfNeeded = useCallback(async (portal, portalTeamMemberData, currentPortal) => {
        if (portal?.customerId || isCreatingCustomer) return;

        setIsCreatingCustomer(true);

        try {
            const { customerId } = await createCustomer(
                portalTeamMemberData.uid,
                portalTeamMemberData.email
            );
            return customerId
        } catch (error) {
            console.error('Error creating customer:', error);
        } finally {
            setIsCreatingCustomer(false);
        }
    }, [isCreatingCustomer]); // Adjusted dependency array

    return createCustomerIfNeeded;
};

export default useCustomerOnDemand;