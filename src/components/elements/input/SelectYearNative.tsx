import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useReadAllYearSelect } from '@/services/graphql/query/global-select/useReadAllYearSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

export type ISelectYearNativeProps = {
  control: 'select-year-native';
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;

const SelectYearNative: React.FC<ISelectYearNativeProps> = ({
  control,
  label = 'year',
  placeholder = 'chooseYear',
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { yearsData } = useReadAllYearSelect({});

  const yearsItem = yearsData?.map((val) => {
    return {
      name: `${val}`,
      id: `${val}`,
    };
  });

  const { uncombinedItem } = useFilterItems({
    data: yearsItem ?? [],
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

export default SelectYearNative;
