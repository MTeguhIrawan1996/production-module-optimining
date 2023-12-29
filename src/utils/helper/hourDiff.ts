import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { secondsDuration } from '@/utils/helper/dateFormat';

dayjs.extend(customParseFormat); // Mengaktifkan plugin customParseFormat
dayjs.extend(utc); // Mengaktifkan plugin utc
dayjs.extend(timezone);

export const hourDiff = (startTime: string, endTime: string) => {
  if (startTime !== '' && endTime !== '') {
    const newStartTime = dayjs(startTime, 'HH:mm:ss');
    const newEndTime = dayjs(endTime, 'HH:mm:ss');
    const diffSeconds = newEndTime.diff(newStartTime, 'second');
    const newSecondsDuration = secondsDuration(diffSeconds);
    return newSecondsDuration;
  }
  return null;
};

export const timeToSecond = (startTime: string, endTime: string) => {
  if (startTime !== '' && endTime !== '') {
    const start = dayjs(startTime, 'HH:mm:ss');
    const end = dayjs(endTime, 'HH:mm:ss');
    const durationInSeconds = end.diff(start, 'second');
    return durationInSeconds;
  }
  return null;
};
