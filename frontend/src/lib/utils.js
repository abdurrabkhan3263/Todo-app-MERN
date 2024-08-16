import { clsx } from "clsx";
import { isDate } from "lodash";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return;
  let remindMe = new Date(date);

  let options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  let formattedDateParts = remindMe
    .toLocaleString("en-GB", options)
    .split(", ");
  let [day, month, year] = formattedDateParts[0].split("/");
  let formattedDateTime = `${year}-${month}-${day}T${formattedDateParts[1]}`;

  return formattedDateTime;
}
