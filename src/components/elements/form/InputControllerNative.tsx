import * as React from 'react';
import 'dayjs/locale/id';

import { DateInputNative, SelectInputNative } from '@/components/elements';

import { InputControllerNativeProps } from '@/types/global';

const InputControllerNative: React.FC<InputControllerNativeProps> = (props) => {
  const { control } = props;

  switch (control) {
    case 'date-input-native':
      return <DateInputNative {...props} />;
    case 'select-input-native':
      return <SelectInputNative {...props} />;
    default:
      return null;
  }
};

export default InputControllerNative;
