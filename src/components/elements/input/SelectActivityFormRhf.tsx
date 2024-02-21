import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllActivityForm } from '@/services/graphql/query/global-select/useReadAllActivityFormSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ISelectActivityFormRhfProps = {
  control: 'select-activity-form-rhf';
  name: string;
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

const SelectActivityFormRhf: React.FC<ISelectActivityFormRhfProps> = ({
  name,
  control,
  label,
  defaultValue,
  skipQuery = false,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  const { activityFormData } = useReadAllActivityForm({
    skip: skipQuery,
  });

  const { uncombinedItem } = useFilterItems({
    data: activityFormData ?? [],
  });

  return (
    <Select
      {...field}
      radius={8}
      data={uncombinedItem}
      defaultValue={defaultValue}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      placeholder={t('commonTypography.chooseActivityForm', { ns: 'default' })}
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

export default SelectActivityFormRhf;
