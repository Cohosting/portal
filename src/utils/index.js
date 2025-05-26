import { nanoid } from 'nanoid';

export const generateInvoiceNumber = () => {
  const year = new Date().getFullYear().toString().slice(-2); // e.g., '25' for 2025
  const id = nanoid(8).toUpperCase(); // 8-character unique ID (alphanumeric)

  return `INV-${year}-${id}`;
};

export const sortAppWithAboveSettings = (apps, customerId) => {
  let sortedApps = apps
    .sort((a, b) => a.index - b.index)
    .filter(app => {
      if (app.settings?.setupType === 'manual') {
        let result = app.settings.clientsSettings.find(
          client => client.clientId === customerId
        );
        if (result) {
          return app;
        }
      } else {
        return app;
      }
    })
    .filter(app => !app.disabled === true);

  console.log({
    sortedApps,
  });
  return sortedApps;
};

export const shuffleArray = array => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export const sortAndIndexData = data => {
  // Separate non-null and null index elements
  const nonNullIndexElements = data.filter(item => item.index !== null);
  const nullIndexElements = data.filter(item => item.index === null);

  // Sort non-null index elements by their index
  nonNullIndexElements.sort((a, b) => a.index - b.index);

  // Assign new indices to null index elements
  nullIndexElements.forEach((item, idx) => {
    item.index = nonNullIndexElements.length + idx;
  });

  // Concatenate sorted non-null elements with newly indexed null elements
  return [...nonNullIndexElements, ...nullIndexElements];
};

// Generate a more secure random password
export const generateSecurePassword = () => {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let password = '';
  for (let i = 0; i < 16; i++) {
    // Generate 16 characters long password for more security
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password.trim();
};

