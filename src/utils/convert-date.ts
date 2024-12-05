import { DateType } from "react-tailwindcss-datepicker";

export const convertDate = (date: string) => {
  if (!date) return null;

  const dates = new Date(date);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const format = `${dates.getDate()} ${months[dates.getMonth()]} ${dates.getFullYear()}`;
  return format;
};

export const formatDate = (date: DateType | undefined) => {
  if (!date) return undefined;

  const year = date?.getFullYear();
  const month = date?.getMonth() + 1 < 10 ? `0${date?.getMonth() + 1}` : `${date?.getMonth() + 1}`;
  const day = date?.getDate() < 10 ? `0${date?.getDate()}` : `${date?.getDate()}`;

  return [year, month, day].join("-");
};
