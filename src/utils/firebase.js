export const handleFirebaseError = (errorCode, callback) => {
  console.log(errorCode);
  switch (errorCode) {
    case 'auth/email-already-in-use':
      callback('The email address is already in use by another account.');
      break;
    case 'auth/invalid-login-credentials':
      callback('invalid crendentials');
      break;
    case 'auth/operation-not-allowed':
      callback(
        'Email/password accounts are not enabled. Please contact support.'
      );
      break;
    case 'auth/weak-password':
      callback('The password is too weak. Please choose a stronger password.');
      break;
    default:
      callback('An unknown error occurred. Please try again.');
  }
};
