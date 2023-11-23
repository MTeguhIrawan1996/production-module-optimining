import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/id';

dayjs.locale('id');
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

export const hourFromat = (
  //  formatDate
  value: string | Date | undefined | null,
  format?: 'hh:mm:ss A' | 'hh:mm A'
) => {
  return value
    ? dayjs(value, 'HH:mm:ss')
        .locale('id')
        .format(format ?? 'hh:mm:ss A')
    : '-';
};
