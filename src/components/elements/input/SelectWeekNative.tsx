import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useReadAllWeekSelect } from '@/services/graphql/query/global-select/useReadAllWeekSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

export type ISelectWeekNativeProps = {
  control: 'select-week-native';
  year?: number | null;
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;

const SelectWeekNative: React.FC<ISelectWeekNativeProps> = ({
  control,
  year = null,
  label = 'week',
  placeholder = 'chooseWeek',
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { weeksData } = useReadAllWeekSelect({
    variables: {
      year,
    },
  });

  const weeksItem = weeksData?.map((val) => {
    return {
      name: `${val}`,
      id: `${val}`,
    };
  });

  const { uncombinedItem } = useFilterItems({
    data: weeksItem ?? [],
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

export default SelectWeekNative;
