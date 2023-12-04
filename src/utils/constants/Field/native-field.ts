import { IDateInputNativeProps } from '@/components/elements/input/DateInputNative';
import { ISelectInputNativeProps } from '@/components/elements/input/SelectInputNative';

import { InputControllerNativeProps } from '@/types/global';

export const globalSelectNative = ({
  name = 'selectNative',
  label = 'selectNative',
  data = [],
  searchable = false,
  clearable = true,
  ...rest
}: Partial<ISelectInputNativeProps>) => {
  const field: InputControllerNativeProps = {
    control: 'select-input-native',
    name,
    label,
    data,
    searchable,
    clearable,
    ...rest,
  };
  return field;
};

export const globalDateNative = ({
  label = 'date',
  ...rest
}: Partial<IDateInputNativeProps>) => {
  const field: InputControllerNativeProps = {
    control: 'date-input-native',
    label,
    ...rest,
  };
  return field;
};
