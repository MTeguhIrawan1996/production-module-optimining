// import dayjs from 'dayjs';
// // import customParseFormat from 'dayjs/plugin/customParseFormat';
// // import localizedFormat from 'dayjs/plugin/localizedFormat';
// // import 'dayjs/locale/id';

// // dayjs.locale('id');
// // dayjs.extend(localizedFormat);
// // dayjs.extend(customParseFormat);

import dayjs from './dayjs.config';

export const hourFromat = (
  value: string | Date | undefined | null,
  format?: 'hh:mm:ss A' | 'hh:mm A' | 'LLLL',
  elseReturn?: string | null
) => {
  return value
    ? dayjs(value, 'HH:mm:ss')
        .locale('id')
        .format(format ?? 'hh:mm:ss A')
    : elseReturn
    ? elseReturn
    : '-';
};
