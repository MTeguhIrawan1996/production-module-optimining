import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/id';

dayjs.locale('id');
dayjs.extend(localizedFormat);

export const formatDate = (
  //  formatDate
  value: string | Date | undefined | null,
  format?:
    | 'DD'
    | 'LL'
    | 'dddd, LL'
    | 'LLLL WIB'
    | 'hh:mm WIB'
    | 'DD, LL'
    | 'LL, hh:mm WIB'
    | 'DD, LL, hh:mm WIB'
    | 'hh:mm A'
    | 'hh:mm:ss'
    | 'HH:mm:ss'
) => {
  return value
    ? dayjs(value)
        .locale('id')
        .format(format ?? 'LL')
    : '-';
};

export const formatDate2 = (
  //  formatDate
  value: string | Date | undefined | null,
  format?:
    | 'DD'
    | 'LL'
    | 'dddd, LL'
    | 'LLLL WIB'
    | 'hh:mm WIB'
    | 'DD, LL'
    | 'LL, hh:mm WIB'
    | 'DD, LL, hh:mm WIB'
    | 'hh:mm A'
    | 'hh:mm:ss'
    | 'HH:mm:ss'
) => {
  return value
    ? dayjs(value)
        .locale('id')
        .format(format ?? 'LL')
    : null;
};
