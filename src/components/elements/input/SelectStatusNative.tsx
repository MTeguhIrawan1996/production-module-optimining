import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useReadAllStatusSelect } from '@/services/graphql/query/global-select/useReadAllStatusSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

export type IStatusNativeProps = {
  control: 'select-status-native';
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;

const SelectStatusNative: React.FC<IStatusNativeProps> = ({
  control,
  label = 'status',
  placeholder = 'chooseStatus',
  name,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const [filterDataCommon, setFilterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );
  useReadAllStatusSelect({
    onCompleted: (data) => {
      const yearsItem = data.statuses.data.map((val) => {
        return {
          id: val.id,
          name: val.name,
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

export default SelectStatusNative;
