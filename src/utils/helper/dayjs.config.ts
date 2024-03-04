import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import isLeapYear from 'dayjs/plugin/isLeapYear'; // dependent on isLeapYear plugin
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import 'dayjs/locale/id';
import 'dayjs/locale/en';

import i18n from '../../../i18n';

const language = i18n.language;

dayjs.extend(customParseFormat);
dayjs.locale(language);
dayjs.extend(localizedFormat);
dayjs.extend(duration);
// Set first day is SUNDAY
// and the week must contain WEDNESSDAY //FIXME: It dont work
dayjs.extend(updateLocale);
dayjs.extend(weekOfYear);
dayjs.updateLocale('id', { weekStart: 0 });
dayjs.updateLocale('en', { weekStart: 0 });
dayjs.extend(isoWeek);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);

export default dayjs;
