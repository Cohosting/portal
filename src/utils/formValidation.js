import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import _ from 'lodash';

export const handlePortalURLValidation = _.debounce(
  async (val, setPortalURLValidation) => {
    setPortalURLValidation({ isAvailable: false, isChecking: true });
    const ref = collection(db, 'portals');
    const q = query(ref, where('portalURL', '==', val));
    const querySnapshot = await getDocs(q);
    setPortalURLValidation({
      isAvailable: querySnapshot.empty,
      isChecking: false,
    });
  },
  500
);

export const handleError = (value, text) => {
  if (!text) return false;
  let isError = true;
  if (value === 'email') {
    isError = text !== '' && text.includes('@') ? false : true;
  } else {
    isError = text === '' ? true : false;
  }
  return isError;
};
