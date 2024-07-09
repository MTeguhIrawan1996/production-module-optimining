import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useReadAllYearSelect } from '@/services/graphql/query/global-select/useReadAllYearSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

export type ISelectYearNativeProps = {
  control: 'select-year-native';
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;

const SelectYearNative: React.FC<ISelectYearNativeProps> = ({
  control,
  label = 'year',
  placeholder = 'chooseYear',
  name,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const [filterDataCommon, setFilterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );
  useReadAllYearSelect({
    onCompleted: (data) => {
      const yearsItem = data.years.map((val) => {
        return {
          name: `${val}`,
          id: `${val}`,
        };
      });
      setFilterDataCommon({ key: name || '', data: yearsItem });
    },
  });

  const { uncombinedItem } = useFilterItems({
    data: filterDataCommon.find((v) => v.key === name)?.data ?? [],
  });

  return (
    <Select
      data={uncombinedItem}
      radius="sm"
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      label={label ? t(`components.field.${label}`) : null}
      name={name}
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
