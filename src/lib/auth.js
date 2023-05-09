
 

import{ doc, getDoc, setDoc}  from 'firebase/firestore'
import { db } from './firebase';


export const getOrCreateUser = async  (firebaseUser, userCredentials  =  {}) =>  {
    let userObject = {
            ...userCredentials
        }
    const  ref = doc(db, 'users',  firebaseUser.uid);
    const snapshot = await getDoc(ref);

    let tempUser = {
      ...userObject,
      id: ref.id,
    };

    if (!snapshot.exists()) {
      await setDoc(ref, tempUser);
      return tempUser;
    } else {
      return snapshot.data();
    }

}