import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useReadAllMonthSelect } from '@/services/graphql/query/global-select/useReadAllMonthSelect';
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
  const { monthsData } = useReadAllMonthSelect({});

  const monthsItem = monthsData?.map((val) => {
    return {
      name: val.name,
      id: `${val.id}`,
    };
  });

  const { uncombinedItem } = useFilterItems({
    data: monthsItem ?? [],
  });

  return (
    <Select
      data={uncombinedItem}
      radius="lg"
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      styles={(theme) => ({
        item: {
          borderRadius: theme.spacing.xs,
        },
        dropdown: {
          borderRadius: theme.spacing.xs,
        },
      })}
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
