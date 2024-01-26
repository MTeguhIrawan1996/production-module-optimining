import { Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useReadAllCompaniesMasterData } from '@/services/graphql/query/master-data-company/useReadAllMasterDataCompany';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

export type ICompanyNativeProps = {
  control: 'select-company-native';
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;

const SelectCompanyNative: React.FC<ICompanyNativeProps> = ({
  control,
  label = 'company',
  placeholder = 'chooseCompany',
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);

  const { companiesData } = useReadAllCompaniesMasterData({
    variables: {
      search: searchQuery === '' ? null : searchQuery,
      limit: 15,
    },
  });

  const { uncombinedItem } = useFilterItems({
    data: companiesData ?? [],
  });

  return (
    <Select
      data={uncombinedItem}
      radius="lg"
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
      {...rest}
    />
  );
};

export default SelectCompanyNative;
