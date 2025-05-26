import axiosInstance from '../api/axiosConfig';

export const verifyToken = async (token, portalId) => {
  try {
    const { data } = await axiosInstance.post('/auth/verify-token', {
      token,
      portalId,
    });

    return data;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error; // Rethrow to handle it in the calling context
  }
};
