// const moment = require('moment-timezone');
import moment from 'moment-timezone';
export const formattedMonthTime = timestamp => {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );

  const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits with leading zero
  const month = date.toLocaleString('default', { month: 'short' }); // Get the abbreviated month name

  return `${day} ${month}`;
};

export const getCurrentTimestamp = () => new Date().toISOString();

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

// Function to format dates
export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Get the user's timezone

export function getFirstDayOfNextMonthInUnix() {
  // Get the current date
  const now = moment();

  // Move to the first day of the next month
  const firstDayOfNextMonth = now.add(1, 'month').startOf('month');

  // Convert to Unix timestamp (in seconds)
  const unixTimestamp = firstDayOfNextMonth.unix();

  return unixTimestamp;
}

export const getFirstDayOfCurrentMonthInUnix = () => {
  // Get the current date
  const now = moment();

  // Move to the first day of the current month
  const firstDayOfCurrentMonth = now.startOf('month');

  // Convert to Unix timestamp (in seconds)
  const unixTimestamp = firstDayOfCurrentMonth.unix();

  return unixTimestamp;
};
