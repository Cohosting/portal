export const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
};


export const isValidBrandUrl = url => {
  if (url.includes('https://airtable.com')) {
    let id = url.split('/')[3];
    return `https://airtable.com/embed/${id}?backgroundColor=gray&viewControls=on`;
  }
};

let generateRamdomId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
export const defaultAppList = [
  {
    name: 'Messages',
    id: generateRamdomId(),
    icon: 'messages',
    index: 0,
    isDefault: true,
  },
  {
    name: 'Billing',
    id: generateRamdomId(),
    icon: 'billing',
    index: 1,
    isDefault: true,
  },
  {
    name: 'Files',
    id: generateRamdomId(),
    icon: 'files',
    index: 2,
    isDefault: true,
  },
];

export const sortAppWithAboveSettings = (apps, customerId) => {
  /*     .filter(app => app.disabled === false)
   */

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
    });

  console.log({
    sortedApps,
  });
  return sortedApps;
};

export const unixToDateString = unixTimestamp => {
  // Create a new Date object with the Unix timestamp (in milliseconds)
  const dateObject = new Date(unixTimestamp * 1000);

  // Get the day, month, and year from the date object
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1; // Month starts from 0, so we add 1
  const year = dateObject.getFullYear();

  // Create the formatted date string
  const dateString = `${day}-${month}-${year}`;
  return dateString;
};

export const shuffleArray = array => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export function isValidEmail(email) {
  // Regular expression pattern for email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}