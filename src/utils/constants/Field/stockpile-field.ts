import { IDomeNameSelectInputRhfProps } from '@/components/elements/input/DomeNameSelectInputRhf';
import { IStockpileNameSelectInputRhfProps } from '@/components/elements/input/StockpileNameSelectInputRhf';

import { ControllerProps } from '@/types/global';

export const stockpileNameSelect = ({
  name = 'stockpileId',
  label = 'stockpileName',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IStockpileNameSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'stockpilename-select-input',
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

export const domeNameSelect = ({
  name = 'domeId',
  label = 'domeName',
  searchable = true,
  clearable = true,
  withAsterisk = true,
  colSpan = 6,
  ...rest
}: Partial<IDomeNameSelectInputRhfProps>) => {
  const field: ControllerProps = {
    control: 'domename-select-input',
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
