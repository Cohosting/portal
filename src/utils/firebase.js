export const handleSupabaseError = (error, callback) => {
  console.log(error.message);
  switch (error.message) {
    case 'Invalid login credentials':
      callback('Invalid credentials. Please try again.');
      break;
    case 'Email not confirmed':
      callback('Your email address is not confirmed. Please check your inbox.');
      break;
    case 'User not found':
      callback('No user found with this email. Please sign up.');
      break;
    case 'Password too weak':
      callback('The password is too weak. Please choose a stronger password.');
      break;
    default:
      callback('An unknown error occurred. Please try again.');
  }
};
