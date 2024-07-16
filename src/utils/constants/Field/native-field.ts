import { IDateInputNativeProps } from '@/components/elements/input/DateInputNative';
import { ILocationNativeProps } from '@/components/elements/input/LocationSelectInputNative';
import { IArriveBargeNativeProps } from '@/components/elements/input/SelectArriveBargeNative';
import { ICompanyNativeProps } from '@/components/elements/input/SelectCompanyNative';
import { ISelectHeavyEquipmentNativeProps } from '@/components/elements/input/SelectHeavyEquipmentNative';
import { ISelectMaterialNativeProps } from '@/components/elements/input/SelectInputMaterialNative';
import { ISelectInputNativeProps } from '@/components/elements/input/SelectInputNative';
import { ISelectInputPeriodNatvie } from '@/components/elements/input/SelectInputPeriodNative';
import { ISelectInputQuarterNatvie } from '@/components/elements/input/SelectInputQuarterNative';
import { ISelectInputRitageStatusNatvie } from '@/components/elements/input/SelectInputRitageStatusNative';
import { ISelectShiftNativeProps } from '@/components/elements/input/SelectInputShiftNative';
import { ISelectMonthNativeProps } from '@/components/elements/input/SelectMonthNative';
import { IStatusNativeProps } from '@/components/elements/input/SelectStatusNative';
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
export const globalSelectQuarterNative = ({
  name = 'quarter',
  searchable = false,
  clearable = true,
  ...rest
}: Partial<ISelectInputQuarterNatvie>) => {
  const field: InputControllerNativeProps = {
    control: 'select-quarter-native',
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

export const globalSelectStatusNative = ({
  name = 'status',
  searchable = false,
  clearable = true,
  ...rest
}: Partial<IStatusNativeProps>) => {
  const field: InputControllerNativeProps = {
    control: 'select-status-native',
    name,
    searchable,
    clearable,
    ...rest,
  };
  return field;
};
export const globalSelectCompanyNative = ({
  name = 'company',
  searchable = true,
  clearable = true,
  ...rest
}: Partial<ICompanyNativeProps>) => {
  const field: InputControllerNativeProps = {
    control: 'select-company-native',
    name,
    searchable,
    clearable,
    ...rest,
  };
  return field;
};

export const globalSelectLocationNative = ({
  name = 'location',
  searchable = true,
  clearable = true,
  ...rest
}: Partial<ILocationNativeProps>) => {
  const field: InputControllerNativeProps = {
    control: 'select-location-native',
    name,
    searchable,
    clearable,
    ...rest,
  };
  return field;
};
export const globalSelectPeriodNative = ({
  name = 'period',
  searchable = false,
  clearable = true,
  ...rest
}: Partial<ISelectInputPeriodNatvie>) => {
  const field: InputControllerNativeProps = {
    control: 'select-period-native',
    name,
    searchable,
    clearable,
    ...rest,
  };
  return field;
};
export const globalSelectShiftNative = ({
  name = 'shift',
  searchable = false,
  clearable = true,
  ...rest
}: Partial<ISelectShiftNativeProps>) => {
  const field: InputControllerNativeProps = {
    control: 'select-shift-native',
    name,
    searchable,
    clearable,
    ...rest,
  };
  return field;
};
export const globalSelectMaterialNative = ({
  name = 'shift',
  clearable = true,
  ...rest
}: Partial<ISelectMaterialNativeProps>) => {
  const field: InputControllerNativeProps = {
    control: 'select-material-native',
    name,
    clearable,
    ...rest,
  };
  return field;
};
export const globalSelectRitageStatusNative = ({
  name = 'ritageStatus',
  clearable = true,
  ...rest
}: Partial<ISelectInputRitageStatusNatvie>) => {
  const field: InputControllerNativeProps = {
    control: 'select-ritage-status-native',
    name,
    clearable,
    ...rest,
  };
  return field;
};
