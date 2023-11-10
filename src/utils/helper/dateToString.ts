import dayjs from 'dayjs';

export const dateToString = (date: Date | string | null) => {
  const dateString = dayjs(date).format();
  return dateString;
};
export const stringToDate = (date: string | undefined) => {
  if (date) {
    const stringDate = dayjs(date).toDate();
    return stringDate;
  }
};
