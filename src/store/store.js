// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import logger from 'redux-logger';
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // devTools: process.env.NODE_ENV !== 'production', // Enable DevTools only in development
  // middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

export default store;
