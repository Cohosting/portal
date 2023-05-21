// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from 'firebase/functions';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDN_LYbxuk2m3-5Nehl3fp3aO0pDXqexuo',
  authDomain: 'portal-a229a.firebaseapp.com',
  projectId: 'portal-a229a',
  storageBucket: 'portal-a229a.appspot.com',
  messagingSenderId: '439335373135',
  appId: '1:439335373135:web:84c436cf984522fdee1d3a',
  measurementId: 'G-FRT2VS6RKJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Create a storage reference from our storage service
