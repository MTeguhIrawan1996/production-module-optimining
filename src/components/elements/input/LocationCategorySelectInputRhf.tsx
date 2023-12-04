import { Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllLocationCategory } from '@/services/graphql/query/global-select/useReadAllLocationCategory ';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ILocationCategorySelectInputRhfProps = {
  control: 'location-category-select-input';
  name: string;
  labelValue?: string;
  excludeIds?: string[] | null;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const LocationCategorySelectInputRhf: React.FC<
  ILocationCategorySelectInputRhfProps
> = ({
  name,
  control,
  label,
  labelValue,
  excludeIds = null,
  defaultValue,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);
  const currentValue = field.value === '' ? null : field.value;

  const { locationCategoriesdata } = useReadAllLocationCategory({
    variables: {
      limit: 15,
      search: searchQuery === '' ? null : searchQuery,
      excludeIds: excludeIds,
    },
  });

  const { combinedItems, uncombinedItem } = useCombineFilterItems({
    data: locationCategoriesdata ?? [],
    combinedId: defaultValue ?? '',
    combinedName: labelValue,
  });

  return (
    <Select
      {...field}
      radius={8}
      data={!currentValue || !defaultValue ? uncombinedItem : combinedItems}
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
      onSearchChange={setSearchTerm}
      searchValue={searchTerm}
      data-control={control}
      placeholder={t('commonTypography.chooseLocationCategory', {
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

export default LocationCategorySelectInputRhf;
