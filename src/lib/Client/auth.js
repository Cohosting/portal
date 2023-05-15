/* import bcrypt from 'bcryptjs';
import { collection, getDocs, query, where } from 'firebase/firestore';
import jwt from 'jsonwebtoken';
import { db } from '../firebase';

const secretKey = process.env.REACT_APP_SECRET_KEY;

// Function to store the session token securely
function storeSessionToken(token) {
  // Store the token securely on the client-side (e.g., in a cookie or local storage)
}

// Function to retrieve the session token
function retrieveSessionToken() {
  // Retrieve the token from client-side storage
  // Return the token
}

export const signInWithEmailAndPassword = async (email, password) => {
  try {
    const clientRef = collection(db, 'portalMembers');
    const q = query(clientRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('Invalid email or password.');
    } else {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const hashedPassword = userData.password;

      const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

      if (isPasswordMatch) {
        const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
        storeSessionToken(token);
        console.log({
          token,
        });
        // Store the token on the client-side (e.g., in a cookie or local storage)
      } else {
        console.log('Invalid email or password.');
      }
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
  }
};

// Function to verify the session token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log('Token verified successfully!');
    console.log('Decoded:', decoded);
    // Proceed with handling the authenticated request
  } catch (error) {
    console.error('Error verifying token:', error);
  }
}
 */
