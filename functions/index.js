const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

admin.initializeApp();

const db = admin.firestore();
exports.signInWithEmailAndPassword = functions.https.onCall(
  async (data, context) => {
    const { email, password, portalId } = data;
    try {
      const usersRef = db.collection('portalMembers');
      console.log({
        action: 'authentication_attempt',
        email,
        portalId,
      });

      const querySnapshot = await usersRef
        .where('email', '==', email)
        .where('portalId', '==', portalId)
        .get();

      if (querySnapshot.empty) {
        console.log({
          action: 'authentication_failed',
          reason: 'empty_data',
          email,
          portalId,
        });
        return {
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        };
      } else {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const hashedPassword = userData.password;

        const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

        if (isPasswordMatch) {
          const token = jwt.sign({ email }, process.env.SECRET_KEY, {
            expiresIn: '1h',
          });
          return {
            success: true,
            message: 'User authenticated successfully!',
            token,
          };
        } else {
          console.log({
            action: 'authentication_failed',
            reason: 'token_validation',
            email,
            portalId,
          });
          return {
            success: false,
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          };
        }
      }
    } catch (error) {
      console.error({
        action: 'authentication_error',
        errorType: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        email,
      });
      return {
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'Error authenticating user',
      };
    }
  }
);

const getUserByEmail = async (email, portalId) => {
  try {
    const usersRef = db.collection('portalMembers');
    const querySnapshot = await usersRef
      .where('email', '==', email)
      .where('portalId', '==', portalId)
      .get();

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return {
        ...userData,
        // Include additional user data if needed
      };
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
  }

  return null;
};

exports.verifyToken = functions.https.onCall(async (data, context) => {
  try {
    const { token, portalId } = data;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Retrieve user data based on the decoded token, e.g., by querying Firestore
    const user = await getUserByEmail(decoded.email, portalId);

    if (user) {
      return {
        success: true,
        message: 'User authenticated successfully!',
        user,
      };
    } else {
      return {
        success: false,
        message: 'User not found!',
      };
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return {
      success: false,
      message: 'Error verifying token:',
    };
  }
});
