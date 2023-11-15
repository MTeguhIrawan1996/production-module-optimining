/* eslint-disable unused-imports/no-unused-vars */
import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllCompanyPermissionTypes } from '@/services/graphql/query/global-select/useReadAllCompanyPermissionTypes';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ICompanyPermissionTypesSelectInputRhfProps = {
  control: 'company-permission-types-select-input';
  name: string;
  labelValue?: string;
} & Omit<SelectProps, 'name' | 'data' | 'searchValue' | 'placeholder'> &
  CommonProps;

const CompanyPermissionTypeSelectInputRhf: React.FC<
  ICompanyPermissionTypesSelectInputRhfProps
> = ({ name, control, label, labelValue, defaultValue, ...rest }) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const currentValue = field.value;

  const { companyPermissionTypesdata } = useReadAllCompanyPermissionTypes({
    variables: {
      limit: null,
      orderDir: 'desc',
    },
  });

  const { combinedItems, uncombinedItem } = useCombineFilterItems({
    data: companyPermissionTypesdata ?? [],
    combinedId: defaultValue ?? '',
    combinedName: labelValue,
  });

  return (
    <Select
      {...field}
      radius={8}
      data={
        currentValue === '' || !defaultValue ? uncombinedItem : combinedItems
      }
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
      placeholder={t('commonTypography.chooseCompanyPermissionType', {
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

export default CompanyPermissionTypeSelectInputRhf;
