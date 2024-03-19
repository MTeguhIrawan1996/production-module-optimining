import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useReadAllMonth2Select } from '@/services/graphql/query/global-select/useReadAllMonthSelect';
import dayjs from '@/utils/helper/dayjs.config';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

export type ISelectMonthNativeProps = {
  control: 'select-month-native';
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;

const SelectMonthNative: React.FC<ISelectMonthNativeProps> = ({
  control,
  label = 'month',
  placeholder = 'chooseMonth',
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { month2sData } = useReadAllMonth2Select({});

  const monthsItem = month2sData?.map((val) => {
    return {
      name: `${dayjs()
        .month(val.month - 1)
        .format('MMMM')}`,
      id: `${val.month}`,
    };
  });

  const { uncombinedItem } = useFilterItems({
    data: monthsItem ?? [],
  });

  return (
    <Select
      data={uncombinedItem}
      radius="sm"
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      label={label ? t(`components.field.${label}`) : null}
      placeholder={
        placeholder
          ? t(`commonTypography.${placeholder}`, { ns: 'default' })
          : undefined
      }
      {...rest}
    />
  );
};

export default SelectMonthNative;
