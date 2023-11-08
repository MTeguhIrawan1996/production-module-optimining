import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/id';

dayjs.locale('id');
dayjs.extend(localizedFormat);

export const dateFromat = (
  //  formatDate
  value: string | Date | undefined,
  format?:
    | 'DD'
    | 'LL'
    | 'dddd, LL'
    | 'LLLL WIB'
    | 'hh:mm WIB'
    | 'DD, LL'
    | 'LL, hh:mm WIB'
    | 'DD, LL, hh:mm WIB'
) => {
  return value
    ? dayjs(value)
        .locale('id')
        .format(format ?? 'LL')
    : '-';
};
