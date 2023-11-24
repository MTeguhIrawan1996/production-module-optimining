/* eslint-disable unused-imports/no-unused-vars */
import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllMaterialsMaster } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IMaterialSelectnputRhfProps = {
  control: 'material-select-input';
  name: string;
  labelValue?: string;
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

const MaterialSelectInput: React.FC<IMaterialSelectnputRhfProps> = ({
  name,
  control,
  label,
  labelValue,
  defaultValue,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  const { materialsData } = useReadAllMaterialsMaster({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
  });

  const { uncombinedItem } = useFilterItems({
    data: materialsData ?? [],
  });

  return (
    <Select
      {...field}
      radius={8}
      data={uncombinedItem}
      defaultValue={defaultValue}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      styles={(theme) => ({
        item: {
          borderRadius: theme.spacing.xs,
        },
        dropdown: {
          borderRadius: theme.spacing.xs,
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

export default MaterialSelectInput;
