import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useReadAllArriveBargeSelect } from '@/services/graphql/query/global-select/useReadAllArriveBargeSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

export type IArriveBargeNativeProps = {
  control: 'select-arrive-barge-native';
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;

const SelectArriveBargeNative: React.FC<IArriveBargeNativeProps> = ({
  control,
  label = 'arrive',
  placeholder = 'chooseArrive',
  name,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const [filterDataCommon, setFilterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );
  useReadAllArriveBargeSelect({
    onCompleted: (data) => {
      const item = data.factoryCategories.data.map((val) => {
        return {
          name: val.name,
          id: val.id,
        };
      });
      setFilterDataCommon({ key: name || '', data: item });
    },
  });

  const { uncombinedItem } = useFilterItems({
    data: filterDataCommon.find((v) => v.key === name)?.data ?? [],
  });

  return (
    <Select
      data={uncombinedItem}
      radius="sm"
      name={name}
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
