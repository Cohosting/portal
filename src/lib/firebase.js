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
  apiKey: 'AIzaSyAFPm9LH9_tqgey0NSwBLhncXrMUThAiJM',
  authDomain: 'glassy-operand-412506.firebaseapp.com',
  projectId: 'glassy-operand-412506',
  storageBucket: 'glassy-operand-412506.appspot.com',
  messagingSenderId: '173858198628',
  appId: '1:173858198628:web:a4311e6b1a1cbf584b3b71',
  measurementId: 'G-6F682L0MFY',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Create a storage reference from our storage service
