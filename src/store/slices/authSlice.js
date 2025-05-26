import { createSlice } from '@reduxjs/toolkit';
import { signupUser, validatePortalURL } from './../thunk/authThunks';
const initialState = {
  user: null,
  isAuthenticated: null,
  personalInfoStep: {
    name: '',
    found_on: 'Tiktok',
    company_name: '',
    portal_url: '',
  },
  businessDetailsStep: {
    industry: 'Accounting and bookkeeping',
    company_size: 'Just me',
    clients: `I don't have any clients yet`,
    type_of_service: 'Companies',
  },
  portalURLValidation: {
    isAvailable: false,
    isChecking: false,
  },
  step: 1,
  status: 'idle', // added to handle loading state
  error: null,
  email: '',
  password: '',
  currentSelectedPortal: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPersonalInfoStep: (state, action) => {
      // check for portal_url change aand  portal_url subdomain structurer validaty with isValidSubdomain
      console.log({
        state,
        action,
      });
      state.personalInfoStep = action.payload;
    },
    setBusinessDetailsStep: (state, action) => {
      state.businessDetailsStep = action.payload;
    },
    setPortalURLValidation: (state, action) => {
      state.portalURLValidation = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setCurrentSelectedPortal: (state, action) => {
      state.currentSelectedPortal = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signupUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(signupUser.fulfilled, state => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(signupUser.rejected, state => {
        state.status = 'failed';
      })
      .addCase(validatePortalURL.pending, state => {
        state.portalURLValidation.isChecking = true;
      })
      .addCase(validatePortalURL.fulfilled, (state, action) => {
        state.portalURLValidation = action.payload;
      })
      .addCase(validatePortalURL.rejected, state => {
        state.portalURLValidation.isChecking = false;
      });
  },
});

export const {
  setPersonalInfoStep,
  setBusinessDetailsStep,
  setPortalURLValidation,
  setStep,
  setUser,
  setIsAuthenticated,
  setStatus,
  setError,
  setEmail,
  setPassword,
  setCurrentSelectedPortal,
} = authSlice.actions;

export default authSlice.reducer;
