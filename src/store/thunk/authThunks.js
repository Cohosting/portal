import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {
  setUser,
  setIsAuthenticated,
  setStep,
  setStatus,
  setError,
  setPortalURLValidation,
} from './../slices/authSlice';
import { getOrCreateUser } from '../../lib/auth';
import { handleFirebaseError } from '../../utils/firebase';
import { auth, db } from '../../lib/firebase';

export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async (_, { dispatch }) => {
    dispatch(setStatus('loading'));
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async user => {
        if (user) {
          onSnapshot(
            doc(db, 'users', user.uid),
            snapshot => {
              const userData = { ...snapshot.data() };
              if (userData.isProfileCompleted === false) {
                dispatch(setStep(2));
              }
              dispatch(setUser(userData));
              dispatch(setIsAuthenticated(true));
              dispatch(setStatus('succeeded'));
              resolve();
            },
            error => {
              dispatch(setError(error.message));
              dispatch(setStatus('failed'));
              reject(error);
            }
          );
        } else {
          dispatch(setUser(null));
          dispatch(setIsAuthenticated(false));
          dispatch(setStatus('succeeded'));
          resolve();
        }
      });
    });
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (
    { email, password, personalInfoStep, businessDetailsStep },
    { dispatch, getState }
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const cUser = await getOrCreateUser(user, {
        ...personalInfoStep,
        ...businessDetailsStep,
        isProfileCompleted: false,
        uid: user.uid,
        portals: [],
        email,
      });

      dispatch(setUser(cUser));
      dispatch(setIsAuthenticated(true));
      dispatch(setStep(getState().auth.step));
    } catch (err) {
      console.error(err);
      handleFirebaseError(err.code, message => {
        dispatch(setError(message));
      });
      throw err;
    }
  }
);

export const validatePortalURL = createAsyncThunk(
  'auth/validatePortalURL',
  async (url, { dispatch }) => {
    dispatch(setPortalURLValidation({ isAvailable: false, isChecking: true }));
    const ref = collection(db, 'portals');
    const q = query(ref, where('portalURL', '==', url));
    const querySnapshot = await getDocs(q);
    return {
      isAvailable: querySnapshot.empty,
      isChecking: false,
    };
  }
);
