export const verifyToken = async (token, portalId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NODE_URL}/client-auth/verifyToken`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, portalId }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error; // Rethrow to handle it in the calling context
  }
};
