/* // portalContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchPortalData,
  fetchTeamMemberData,
  updateTeamMemberStatus,
  createCustomer,
  updateCustomerInPortal,
  updateSubscriptionStatus,
} from './../services/portalServices';
import { useSelector } from 'react-redux';

export const PortalContext = createContext();

export const PortalContextProvider = ({ children }) => {
  const { user } = useSelector(state => state.auth);
  const [portal, setPortal] = useState(null);
  const [currentPortal, setCurrentPortal] = useState(null);
  const [portalTeamMemberData, setPortalTeamMemberData] = useState(null);

    useEffect(() => {
    if (!user || !user?.portals.length) return;

    console.log(user);
    const getData = async () => {
      const data = await fetchPortalData(user.portals[0]);
      setPortal(data);
      setCurrentPortal(data?.id);
    };
    getData();
  }, [user]);

   useEffect(() => {
    if (!portal || !user || !currentPortal) return;
    const getTeamMemberData = async () => {
      const data = await fetchTeamMemberData(portal.id, user.email);
      setPortalTeamMemberData(data);
      if (data?.status === 'pending') {
        await updateTeamMemberStatus(data.id, 'active');
      }
    };
    getTeamMemberData();
  }, [portal, user, currentPortal]);

  useEffect(() => {
    if (
      !portal ||
      !portalTeamMemberData ||
      portalTeamMemberData.role !== 'owner'
    )
      return;
    const createUserCustomer = async () => {
      if (!portal.customerId) {
        const { customerId } = await createCustomer(
          portalTeamMemberData.uid,
          portalTeamMemberData.email
        );
        await updateCustomerInPortal(currentPortal, customerId);
      }
    };
    createUserCustomer();
  }, [portalTeamMemberData]);

  useEffect(() => {
    if (!portal || !user) return;
    const updateSubscription = async () => {
      const currentDate = new Date();
      const currentTimestamp = Math.floor(currentDate.getTime() / 1000);
      if (
        portal?.addOnSubscription?.items?.removeBranding &&
        currentTimestamp >=
          portal.addOnSubscription.items.removeBranding.will_expire
      ) {
        await updateSubscriptionStatus(currentPortal, {
          ...portal.addOnSubscription.items.removeBranding,
          active: false,
          will_expire: null,
        });
      }
    };
    updateSubscription();
  }, [portal, user]);

  return (
    <PortalContext.Provider
      value={{ portal, currentPortal, portalTeamMemberData }}
    >
      {children}
    </PortalContext.Provider>
  );
};
 */
