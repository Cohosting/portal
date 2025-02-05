export function isValidEmail(email) {
  // Regular expression pattern for email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export const isValidBrandUrl = url => {
  if (url.includes('https://airtable.com')) {
    let id = url.split('/')[3];
    return `https://airtable.com/embed/${id}?backgroundColor=gray&viewControls=on`;
  }

  return url;
};
export function isValidURL(input) {
  // If there's no protocol specified, prepend 'https://'
  if (!/^https?:\/\//i.test(input)) {
    input = 'https://' + input;
  }

  try {
    const url = new URL(input);

    // Check for valid protocol
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    // Check for a more complete domain
    if (
      !url.hostname.includes('.') ||
      !url.hostname.split('.').some(part => part.length > 1)
    ) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
export const handleError = (value, text) => {
  if (!text) return false;
  let isError = true;
  if (value === 'email') {
    isError = text !== '' && text.includes('@') ? false : true;
  } else {
    isError = text === '' ? true : false;
  }
  return isError;
};
