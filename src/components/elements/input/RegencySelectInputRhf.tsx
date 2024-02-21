/* eslint-disable unused-imports/no-unused-vars */
import { Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllRegency } from '@/services/graphql/query/global-select/useReadAllRegency';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IRegencySelectInputRhfProps = {
  control: 'regency-select-input';
  name: string;
  labelValue?: string;
  provinceId?: string;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const RegencySelectInputRhf: React.FC<IRegencySelectInputRhfProps> = ({
  name,
  control,
  label,
  labelValue,
  defaultValue,
  provinceId = null,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);
  const currentValue = field.value;

  const { regenciesData } = useReadAllRegency({
    variables: {
      limit: 15,
      search: searchQuery === '' ? null : searchQuery,
      provinceId: provinceId === '' ? null : provinceId,
    },
  });

  const { combinedItems, uncombinedItem } = useCombineFilterItems({
    data: regenciesData ?? [],
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
      onSearchChange={setSearchTerm}
      searchValue={searchTerm}
      data-control={control}
      placeholder={t('commonTypography.chooseRegency', {
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

export default RegencySelectInputRhf;
