import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/id';

dayjs.locale('id');
dayjs.extend(localizedFormat);
dayjs.extend(duration);

export const formatDate = (
  value: string | Date | undefined | null,
  format?:
    | 'DD'
    | 'LL'
    | 'LTS'
    | 'YYYY-MM-DD'
    | 'YYYY-DD-MM'
    | 'DD/MM/YYYY'
    | 'MM/DD/YYYY'
    | 'dddd, LL'
    | 'LLLL WIB'
    | 'hh:mm WIB'
    | 'DD, LL'
    | 'LL, hh:mm WIB'
    | 'DD, LL, hh:mm WIB'
    | 'hh:mm A'
    | 'hh:mm:ss A'
    | 'hh:mm:ss'
    | 'HH:mm:ss'
) => {
  return value
    ? dayjs(value)
        .locale('id')
        .format(format ?? 'LL')
    : null;
};

export const secondsDuration = (duration: number | null) => {
  const secondsToMinutes =
    dayjs.duration(duration ?? 0, 'seconds').asMinutes() / 60;
  return secondsToMinutes.toFixed(2);
};
