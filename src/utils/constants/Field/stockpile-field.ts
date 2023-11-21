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
    control: 'stockpileName-select-input',
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
