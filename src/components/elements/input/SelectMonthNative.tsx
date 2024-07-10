import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useReadAllMonth2Select } from '@/services/graphql/query/global-select/useReadAllMonthSelect';
import dayjs from '@/utils/helper/dayjs.config';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

export type ISelectMonthNativeProps = {
  control: 'select-month-native';
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;

const SelectMonthNative: React.FC<ISelectMonthNativeProps> = ({
  control,
  label = 'month',
  placeholder = 'chooseMonth',
  name,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const [filterDataCommon, setFilterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );

  useReadAllMonth2Select({
    onCompleted: (data) => {
      const monthItem = data.month2s.map((val) => {
        return {
          name: `${dayjs()
            .month(val.month - 1)
            .format('MMMM')}`,
          id: `${val.month}`,
        };
      });
      setFilterDataCommon({ key: name || '', data: monthItem });
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

export default SelectMonthNative;
