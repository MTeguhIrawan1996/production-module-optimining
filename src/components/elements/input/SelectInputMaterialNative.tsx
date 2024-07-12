import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useReadAllMaterialsMaster } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

import { CommonProps } from '@/types/global';

export type ISelectMaterialNativeProps = {
  control: 'select-material-native';
  name: string;
  parentId?: string | null;
  includeIds?: string[];
  isHaveParent?: boolean | null;
  skipQuery?: boolean;
} & Omit<
  SelectProps,
  | 'name'
  | 'data'
  | 'onSearchChange'
  | 'searchValue'
  | 'placeholder'
  | 'searchable'
> &
  CommonProps;

const SelectInputMaterialNative: React.FC<ISelectMaterialNativeProps> = ({
  name,
  control,
  label,
  defaultValue,
  isHaveParent = false,
  parentId = null,
  includeIds = null,
  skipQuery = false,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const [filterDataCommon, setFilterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );

  useReadAllMaterialsMaster({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
      isHaveParent: isHaveParent,
      parentId: parentId === '' ? null : parentId,
      includeIds: includeIds ? includeIds : null,
    },
    skip: skipQuery,
    fetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const item = data.materials.data.map((val) => {
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
      radius={8}
      w="100%"
      data={uncombinedItem}
      defaultValue={defaultValue}
      labelProps={{
        style: { fontWeight: 400, fontSize: 16, marginBottom: 8 },
      }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      placeholder={t('commonTypography.chooseMaterial', {
        ns: 'default',
      })}
      label={label ? t(`components.field.${label}`) : null}
      {...rest}
    />
  );
};

export default SelectInputMaterialNative;
