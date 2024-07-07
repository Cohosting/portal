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
import { supabase } from '../../lib/supabase';

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (
    { email, password, personalInfoStep, businessDetailsStep },
    { dispatch, getState }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      const { user } = data;

      if (error) {
        throw error;
      }

      const cUser = await getOrCreateUser(user, {
        ...personalInfoStep,
        ...businessDetailsStep,
        is_profile_completed: false,
        uid: user.id,
        portals: [],
        email,
      });
      console.log({ cUser });

      dispatch(setUser(cUser));
      dispatch(setIsAuthenticated(true));
      dispatch(setStep(/* getState().auth.step */ 2));
    } catch (err) {
      console.error(err);
      dispatch(setError(err.message));
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
