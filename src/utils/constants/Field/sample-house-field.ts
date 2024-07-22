import { ISampleTypesSelectnputRhfProps } from '@/components/elements/input/SampleTypeSelectInputRhf';
import { IShiftSelectInputRhfProps } from '@/components/elements/input/ShiftSelectInputRhf';

import { ControllerProps } from '@/types/global';

export const shiftSelect = ({
  name = 'shiftId',
  label = 'shift',
  searchable = false,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IShiftSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'shift-select-input',
    name,
    label,
    searchable,
    clearable,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};

export const sampleTypeSelect = ({
  name = 'sampleTypeId',
  label = 'sampleType',
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<ISampleTypesSelectnputRhfProps>) => {
  const field: ControllerProps = {
    control: 'sample-type-select-input',
    name,
    label,
    clearable,
    withAsterisk,
    colSpan,
    ...rest,
  };
  return field;
};
