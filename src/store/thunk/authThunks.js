import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setUser,
  setIsAuthenticated,
  setStep,
  setError,
  setPortalURLValidation,
} from './../slices/authSlice';
import { supabase } from '../../lib/supabase';
import { signUpUserWithPortalAndSeat } from '../../utils/signupUtils';

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ email, password, personalInfoStep, businessDetailsStep }, { dispatch, getState }) => {
    try {
      // Early password validation
      if (password.length < 6) {
        const error = new Error("Password must be at least 6 characters long.");
        dispatch(setError(error.message));
        throw error;
      }

      // Check for offline status
      if (!navigator.onLine) {
        const error = new Error("You appear to be offline. Please connect to the internet and try again.");
        dispatch(setError(error.message));
        throw error;
      }

      const { data, error } = await supabase.auth.signUp({ email, password });
      const { user } = data;

      if (error) {
        console.log('error', error);
        throw error;
      }

      const { user: cUser, portal, seat } = await signUpUserWithPortalAndSeat(user, {});

      console.log({ user: cUser, portal, seat });

      dispatch(setUser(cUser));
      dispatch(setIsAuthenticated(true));

    } catch (err) {
      if (err instanceof TypeError && err.message.includes("fetch")) {
        dispatch(setError("Network error. Please check your internet connection."));
      } else {
        dispatch(setError(err.message));
      }
      console.error(err);
      throw err;
    }
  }
);

export const validatePortalURL = createAsyncThunk(
  'auth/validatePortalURL',
  async (url, { dispatch }) => {
    dispatch(setPortalURLValidation({ isAvailable: false, isChecking: true }));

    const { data, error } = await supabase
      .from('portals')
      .select('id')
      .eq('portal_url', url);

    if (error) {
      console.error('Error validating portal URL:', error);
      return {
        isAvailable: false,
        isChecking: false,
      };
    }

    return {
      isAvailable: data.length === 0,
      isChecking: false,
    };
  }
);
