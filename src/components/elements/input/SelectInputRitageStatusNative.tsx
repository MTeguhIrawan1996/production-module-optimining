import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

export type ISelectInputRitageStatusNatvie = {
  control: 'select-ritage-status-native';
} & Omit<
  SelectProps,
  'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
>;

const SelectInputRitageStatusNative: React.FC<
  ISelectInputRitageStatusNatvie
> = ({ control, label = 'ritageStatus', name, ...rest }) => {
  const { t } = useTranslation('allComponents');
  const [filterDataCommon, setFilterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );

  React.useEffect(() => {
    const data = [
      {
        id: 'true',
        name: t('commonTypography.complete', { ns: 'default' }),
      },
      {
        id: 'false',
        name: t('commonTypography.unComplete', { ns: 'default' }),
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
      placeholder={t('commonTypography.chooseRitageStatus', {
        ns: 'default',
      })}
      label={label ? t(`components.field.${label}`) : null}
      {...rest}
    />
  );
};

export default SelectInputRitageStatusNative;
