import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useReadAllArriveBargeSelect } from '@/services/graphql/query/global-select/useReadAllArriveBargeSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

export type IArriveBargeNativeProps = {
  control: 'select-arrive-barge-native';
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;

const SelectArriveBargeNative: React.FC<IArriveBargeNativeProps> = ({
  control,
  label = 'arrive',
  placeholder = 'chooseArrive',
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { arriveBargeData } = useReadAllArriveBargeSelect({});

  const { uncombinedItem } = useFilterItems({
    data: arriveBargeData ?? [],
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

export default SelectArriveBargeNative;
