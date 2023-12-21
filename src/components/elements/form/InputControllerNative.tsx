import * as React from 'react';
import 'dayjs/locale/id';

import {
  DateInputNative,
  SelectInputNative,
  SelectMonthNative,
  SelectWeekNative,
  SelectYearNative,
} from '@/components/elements';

import { InputControllerNativeProps } from '@/types/global';

const InputControllerNative: React.FC<InputControllerNativeProps> = (props) => {
  const { control } = props;

  switch (control) {
    case 'date-input-native':
      return <DateInputNative {...props} />;
    case 'select-input-native':
      return <SelectInputNative {...props} />;
    case 'select-year-native':
      return <SelectYearNative {...props} />;
    case 'select-month-native':
      return <SelectMonthNative {...props} />;
    case 'select-week-native':
      return <SelectWeekNative {...props} />;
    default:
      return null;
  }
};

export default InputControllerNative;
