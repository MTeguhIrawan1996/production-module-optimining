import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useReadAllSampleType } from '@/services/graphql/query/global-select/useReadAllSampleTypes';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

import { CommonProps } from '@/types/global';

export type ISelectInputSampleTypeNativeProps = {
  control: 'select-input-sample-type-native';
  name: string;
  skip?: boolean;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const SelectInputSampleTypeNative: React.FC<
  ISelectInputSampleTypeNativeProps
> = ({ name, control, label, skip = false, ...rest }) => {
  const { t } = useTranslation('allComponents');
  const [filterDataCommon, setFilterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );

  useReadAllSampleType({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
    skip: skip || filterDataCommon.some((v) => v.key === name),
    onCompleted: (data) => {
      const item = data.sampleTypes.data.map((val) => {
        return {
          id: val.id,
          name: val.name,
        };
      });
      setFilterDataCommon({ key: name, data: item });
    },
  });

  const { uncombinedItem } = useFilterItems({
    data: filterDataCommon.find((v) => v.key === name)?.data ?? [],
  });

  return (
    <Select
      radius={8}
      data={uncombinedItem}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      placeholder={t('commonTypography.chooseSampleType', {
        ns: 'default',
      })}
      label={label ? t(`components.field.${label}`) : null}
      {...rest}
    />
  );
};

export default SelectInputSampleTypeNative;
