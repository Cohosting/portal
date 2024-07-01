// portalService.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const fetchPortalData = async portalId => {
  const ref = doc(db, 'portals', portalId);
  const snapshot = await getDoc(ref);
  return snapshot.data();
};

export const fetchTeamMemberData = async (portalId, userEmail) => {
  const ref = collection(db, 'teamMembers');
  const q = query(
    ref,
    where('portalId', '==', portalId),
    where('email', '==', userEmail)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data())[0]; // Assuming there's only one match
};

export const updateTeamMemberStatus = async (memberId, status) => {
  const ref = doc(db, 'teamMembers', memberId);
  await updateDoc(ref, { status });
};

export const createCustomer = async (uid, email) => {
  const response = await fetch(
    `${process.env.REACT_APP_NODE_URL}/create-customer`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: uid, email }),
    }
  );
  return response.json();
};

export const updateCustomerInPortal = async (portalId, customerId) => {
  await updateDoc(doc(db, 'portals', portalId), { customerId });
};

export const updateSubscriptionStatus = async (
  portalId,
  subscriptionDetails
) => {
  await updateDoc(doc(db, 'portals', portalId), {
    'addOnSubscription.items.removeBranding': subscriptionDetails,
  });
};
