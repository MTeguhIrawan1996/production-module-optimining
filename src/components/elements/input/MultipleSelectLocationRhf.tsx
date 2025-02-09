import { MultiSelect, MultiSelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllLocationselect } from '@/services/graphql/query/global-select/useReadAllLocationSelect';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IMultipleSelectLocationRhfProps = {
  control: 'multiple-select-location';
  name: string;
  categoryIds?: string[] | null;
  skipQuery?: boolean;
  skipSearchQuery?: boolean;
} & Omit<
  MultiSelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const MultipleSelectLocationRhf: React.FC<IMultipleSelectLocationRhfProps> = ({
  name,
  control,
  label,
  categoryIds = null,
  skipQuery = false,
  skipSearchQuery = true,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);

  const { allLocationsData } = useReadAllLocationselect({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
      categoryIds: categoryIds && categoryIds.length > 0 ? categoryIds : null,
    },
    skip: skipQuery,
  });

  const { uncombinedItem } = useCombineFilterItems({
    data: allLocationsData ?? [],
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
      onSearchChange={!skipSearchQuery ? setSearchTerm : undefined}
      searchValue={!skipSearchQuery ? searchTerm : undefined}
      data-control={control}
      placeholder={t('commonTypography.chooseLocation', {
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

export default MultipleSelectLocationRhf;
