import { DateTime } from "luxon";

export const formattedMonthTime = (timestamp) => {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );

  const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits with leading zero
  const month = date.toLocaleString("default", { month: "short" }); // Abbreviated month name

  return `${day} ${month}`;
};

export const getCurrentTimestamp = () => new Date().toISOString();

export const unixToDateString = (unixTimestamp) => {
  const dateObject = new Date(unixTimestamp * 1000);
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  return `${day}-${month}-${year}`;
};

export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function getFirstDayOfNextMonthInUnix() {
  const firstDayOfNextMonth = DateTime.local()
    .plus({ months: 1 })
    .startOf("month");
  return Math.floor(firstDayOfNextMonth.toSeconds()); // Unix timestamp in seconds
}

export const getFirstDayOfCurrentMonthInUnix = () => {
  const firstDayOfCurrentMonth = DateTime.local().startOf("month");
  return Math.floor(firstDayOfCurrentMonth.toSeconds()); // Unix timestamp in seconds
};
