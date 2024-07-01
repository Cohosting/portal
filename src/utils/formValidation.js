import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import _ from 'lodash';

export const handlePortalURLValidation = async val => {
  const ref = collection(db, 'portals');
  const q = query(ref, where('portalURL', '==', val));
  const querySnapshot = await getDocs(q);
  return {
    isAvailable: querySnapshot.empty,
    isChecking: false,
  };
};


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
