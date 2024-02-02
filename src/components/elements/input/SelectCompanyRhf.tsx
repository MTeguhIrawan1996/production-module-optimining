import { Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllCompaniesMasterData } from '@/services/graphql/query/master-data-company/useReadAllMasterDataCompany';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ISelectCompanyRhfProps = {
  control: 'select-company-rhf';
  name: string;
  labelValue?: string;
  skipQuery?: boolean;
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'> &
  CommonProps;

const SelectCompanyRhf: React.FC<ISelectCompanyRhfProps> = ({
  control,
  label = 'company',
  placeholder = 'chooseCompany',
  name,
  labelValue,
  defaultValue,
  skipQuery = false,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);
  const currentValue = field.value === '' ? null : field.value;

  const { companiesData } = useReadAllCompaniesMasterData({
    variables: {
      search: searchQuery === '' ? null : searchQuery,
      limit: 15,
    },
    skip: skipQuery,
  });

  const { uncombinedItem, combinedItems } = useCombineFilterItems({
    data: companiesData ?? [],
    combinedId: defaultValue ?? '',
    combinedName: labelValue,
  });

  return (
    <Select
      {...field}
      data={!currentValue || !defaultValue ? uncombinedItem : combinedItems}
      radius={8}
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
      onSearchChange={setSearchTerm}
      searchValue={searchTerm}
      label={label ? t(`components.field.${label}`) : null}
      placeholder={
        placeholder
          ? t(`commonTypography.${placeholder}`, { ns: 'default' })
          : undefined
      }
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

export default SelectCompanyRhf;
