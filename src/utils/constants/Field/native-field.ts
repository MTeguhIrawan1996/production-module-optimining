import { IDateInputNativeProps } from '@/components/elements/input/DateInputNative';
import { IArriveBargeNativeProps } from '@/components/elements/input/SelectArriveBargeNative';
import { ISelectHeavyEquipmentNativeProps } from '@/components/elements/input/SelectHeavyEquipmentNative';
import { ISelectInputNativeProps } from '@/components/elements/input/SelectInputNative';
import { ISelectMonthNativeProps } from '@/components/elements/input/SelectMonthNative';
import { ISelectWeekNativeProps } from '@/components/elements/input/SelectWeekNative';
import { ISelectYearNativeProps } from '@/components/elements/input/SelectYearNative';

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

export const globalSelectYearNative = ({
  name = 'year',
  searchable = false,
  clearable = true,
  ...rest
}: Partial<ISelectYearNativeProps>) => {
  const field: InputControllerNativeProps = {
    control: 'select-year-native',
    name,
    searchable,
    clearable,
    ...rest,
  };
  return field;
};
export const globalSelectMonthNative = ({
  name = 'month',
  searchable = false,
  clearable = true,
  ...rest
}: Partial<ISelectMonthNativeProps>) => {
  const field: InputControllerNativeProps = {
    control: 'select-month-native',
    name,
    searchable,
    clearable,
    ...rest,
  };
  return field;
};

export const globalSelectWeekNative = ({
  name = 'week',
  searchable = false,
  clearable = true,
  ...rest
}: Partial<ISelectWeekNativeProps>) => {
  const field: InputControllerNativeProps = {
    control: 'select-week-native',
    name,
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

export const globalSelectArriveBargeNative = ({
  name = 'arrive',
  searchable = false,
  clearable = true,
  ...rest
}: Partial<IArriveBargeNativeProps>) => {
  const field: InputControllerNativeProps = {
    control: 'select-arrive-barge-native',
    name,
    searchable,
    clearable,
    ...rest,
  };
  return field;
};

export const globalSelectHeavyEquipmentNative = ({
  name = 'bargeCode',
  label = 'bargeCode',
  searchable = true,
  clearable = true,
  withAsterisk = false,
  ...rest
}: Partial<ISelectHeavyEquipmentNativeProps>) => {
  const field: InputControllerNativeProps = {
    control: 'select-heavy-equipment-native',
    name,
    label,
    searchable,
    clearable,
    withAsterisk,
    ...rest,
  };
  return field;
};
