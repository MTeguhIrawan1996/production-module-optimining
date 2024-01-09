/* eslint-disable unused-imports/no-unused-vars */
import { Flex, Select, SelectProps, Stack } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllMaterialsMaster } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IMaterialSelectnputRhfProps = {
  control: 'material-select-input';
  name: string;
  labelValue?: string;
  deleteButtonField?: Omit<IPrimaryButtonProps, 'label'>;
  parentId?: string | null;
  includeIds?: string[];
  isHaveParent?: boolean | null;
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
  deleteButtonField,
  isHaveParent = false,
  parentId = null,
  includeIds = null,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const {
    variant = 'light',
    color = 'red',
    ...restDeleteButtonField
  } = deleteButtonField || {};

  const { materialsData } = useReadAllMaterialsMaster({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
      isHaveParent: isHaveParent,
      parentId: parentId === '' ? null : parentId,
      includeIds: includeIds ? includeIds : null,
    },
  });

  const { uncombinedItem } = useFilterItems({
    data: materialsData ?? [],
  });

  return (
    <Stack spacing={8}>
      <Flex w="100%" align="flex-end" gap="sm">
        <Select
          {...field}
          radius={8}
          w="100%"
          data={uncombinedItem}
          defaultValue={defaultValue}
          labelProps={{
            style: { fontWeight: 400, fontSize: 16, marginBottom: 8 },
          }}
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
          error={fieldState && fieldState.error ? true : false}
          {...rest}
        />
        {deleteButtonField ? (
          <PrimaryButton
            label={t('commonTypography.delete', { ns: 'default' })}
            variant={variant}
            color={color}
            {...restDeleteButtonField}
          />
        ) : null}
      </Flex>
      {fieldState && fieldState.error && (
        <FieldErrorMessage color="red">
          {fieldState.error.message}
        </FieldErrorMessage>
      )}
    </Stack>
  );
};

export default MaterialSelectInput;
