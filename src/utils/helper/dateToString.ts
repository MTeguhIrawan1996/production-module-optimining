import dayjs from 'dayjs';

export const dateToString = (date: Date | string | null) => {
  const dateString = dayjs(date).format();
  return dateString;
};
