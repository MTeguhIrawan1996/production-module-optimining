import dayjs from 'dayjs';

export const dateToString = (date: Date | string | null) => {
  if (date) {
    const dateString = dayjs(date).format();
    return dateString;
  }
};
export const stringToDate = (date: string | null) => {
  if (date) {
    const stringDate = dayjs(date).toDate();
    return stringDate;
  }
};
