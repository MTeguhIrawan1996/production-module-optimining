import { MultiSelect, MultiSelectProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllMaterialsMaster } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IMultipleSelectMaterialRhfProps = {
  control: 'multiple-select-material';
  name: string;
  parentId?: string | null;
  includeIds?: string[];
  isHaveParent?: boolean | null;
  skipQuery?: boolean;
} & Omit<
  MultiSelectProps,
  | 'name'
  | 'data'
  | 'onSearchChange'
  | 'searchValue'
  | 'placeholder'
  | 'searchable'
> &
  CommonProps;

const MultipleSelectMaterialRhf: React.FC<IMultipleSelectMaterialRhfProps> = ({
  name,
  control,
  label,
  isHaveParent = false,
  parentId = null,
  includeIds = null,
  skipQuery = false,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  const { materialsData } = useReadAllMaterialsMaster({
    variables: {
      limit: null,
      orderDir: 'asc',
      orderBy: 'createdAt',
      isHaveParent: isHaveParent,
      parentId: parentId === '' ? null : parentId,
      includeIds: includeIds ? includeIds : null,
    },
    skip: skipQuery,
  });

  const { uncombinedItem } = useCombineFilterItems({
    data: materialsData ?? [],
  });

  return (
    <MultiSelect
      {...field}
      radius={8}
      data={uncombinedItem}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      styles={(theme) => ({
        item: {
          borderRadius: theme.spacing.xs,
        },
        dropdown: {
          borderRadius: theme.spacing.xs,
        },
        value: {
          backgroundColor: theme.colors.brand[3],
        },
      })}
      data-control={control}
      placeholder={t('commonTypography.chooseMaterial', {
        ns: 'default',
      })}
      label={label ? t(`components.field.${label}`) : null}
      error={
        fieldState &&
        fieldState.error && (
          <FieldErrorMessage>{fieldState.error.message}</FieldErrorMessage>
        )
      }
      {...rest}
    />
  );
};

export default MultipleSelectMaterialRhf;
