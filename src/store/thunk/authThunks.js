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
        console.log(`error`, error);
        throw error;
      }

      const {
        user: cUser,
        portal,
        seat,
      } = await signUpUserWithPortalAndSeat(user, {});

      console.log({
        user: cUser,
        portal,
        seat,
      });

      dispatch(setUser(cUser));
      dispatch(setIsAuthenticated(true));
      // dispatch(setStep(/* getState().auth.step */ 2));
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
