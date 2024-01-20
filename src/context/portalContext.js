import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const PortalContext = createContext();

export const PortalContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [portal, setPortal] = useState(null);
  const [currentPortal, setCurrentPortal] = useState(null);
  const [portalTeamMemberData, setPortalTeamMemberData] = useState(null);

  useEffect(() => {
    if (!user) return;
    const getData = async () => {
      const id = user.portals[0];
      const ref = doc(db, 'portals', id);
      onSnapshot(ref, snapshot => {
        const data = snapshot.data();
        setPortal(data);
        setCurrentPortal(data?.id);
      });
    };
    getData();
  }, [user]);

  useEffect(() => {
    if (!portal || !user || !currentPortal) return;

    const getTeamMemberData = async () => {
      const ref = collection(db, 'teamMembers');
      const q = query(
        ref,
        where('portalId', '==', portal.id),
        where('email', '==', user.email)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());

      if (data.length > 0) {
        setPortalTeamMemberData(data[0]);
        if (data[0].status === 'pending') {
          // update the status
          const ref = doc(db, 'teamMembers', data[0].id);
          await updateDoc(ref, {
            status: 'active',
          });
        }
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

    // create stripe cusomter
    const createUserCustomer = async uid => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_NODE_URL}/create-customer`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: uid,
              email: portalTeamMemberData.email,
            }),
          }
        );

        const { customerId } = await response.json();

        // Update the customer ID in your database or state
        // For example, using Firebase Firestore
        await updateDoc(doc(db, 'portals', currentPortal), {
          customerId,
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (!portal.customerId) {
      createUserCustomer(portalTeamMemberData.uid);
    }
  }, [portalTeamMemberData]);
  useEffect(() => {
    if (!portal || !user) return;
    (async () => {
      const currentDate = new Date();
      const currentTimestamp = Math.floor(currentDate.getTime() / 1000);

      if (
        portal?.addOnSubscription?.items?.removeBranding &&
        (currentTimestamp ===
          portal.addOnSubscription.items.removeBranding.will_expire ||
          currentTimestamp >
            portal.addOnSubscription.items.removeBranding.will_expire)
      ) {
        try {
          await updateDoc(db, {
            'addOnSubscription.items.removeBranding': {
              ...portal.addOnSubscription.items.removeBranding,
              active: false,
              will_expire: null,
            },
          });
        } catch (err) {
          console.log(
            'Error while updating the portal remove branding active status and will_expire field removing'
          );
        }
      }
    })();
  }, [portal, user]);

  return (
    <PortalContext.Provider
      value={{ portal, currentPortal, portalTeamMemberData }}
    >
      {children}
    </PortalContext.Provider>
  );
};
