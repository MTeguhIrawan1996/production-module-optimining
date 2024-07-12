import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

export type ISelectInputQuarterNatvie = {
  control: 'select-quarter-native';
} & Omit<
  SelectProps,
  'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
>;

const SelectInputQuarterNative: React.FC<ISelectInputQuarterNatvie> = ({
  control,
  label = 'quarter',
  name,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const [filterDataCommon, setFilterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );

  React.useEffect(() => {
    const data = [
      {
        id: '1',
        name: t('commonTypography.nthQuarter', {
          n: '1',
          ns: 'default',
        }),
      },
      {
        id: '2',
        name: t('commonTypography.nthQuarter', {
          n: '2',
          ns: 'default',
        }),
      },
      {
        id: '3',
        name: t('commonTypography.nthWeek', {
          n: '3',
          ns: 'default',
        }),
      },
      {
        id: '4',
        name: t('commonTypography.nthWeek', {
          n: '4',
          ns: 'default',
        }),
      },
    ];
    setFilterDataCommon({ key: name || '', data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const { uncombinedItem } = useCombineFilterItems({
    data: filterDataCommon.find((v) => v.key === name)?.data ?? [],
  });

  return (
    <Select
      radius="sm"
      data={uncombinedItem}
      name={name}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      placeholder={t('commonTypography.chooseQuarter', {
        ns: 'default',
      })}
      label={label ? t(`components.field.${label}`) : null}
      {...rest}
    />
  );
};

export default SelectInputQuarterNative;
