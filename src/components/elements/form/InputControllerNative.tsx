import * as React from 'react';

import {
  DateInputNative,
  LocationSelectInputNative,
  SelectArriveBargeNative,
  SelectCompanyNative,
  SelectHeavyEquipmentNative,
  SelectInputMaterialNative,
  SelectInputNative,
  SelectInputPeriodNative,
  SelectInputShiftNative,
  SelectMonthNative,
  SelectStatusNative,
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
    case 'select-arrive-barge-native':
      return <SelectArriveBargeNative {...props} />;
    case 'select-heavy-equipment-native':
      return <SelectHeavyEquipmentNative {...props} />;
    case 'select-status-native':
      return <SelectStatusNative {...props} />;
    case 'select-company-native':
      return <SelectCompanyNative {...props} />;
    case 'select-location-native':
      return <LocationSelectInputNative {...props} />;
    case 'select-period-native':
      return <SelectInputPeriodNative {...props} />;
    case 'select-shift-native':
      return <SelectInputShiftNative {...props} />;
    case 'select-material-native':
      return <SelectInputMaterialNative {...props} />;
    default:
      return null;
  }
};

export default InputControllerNative;
