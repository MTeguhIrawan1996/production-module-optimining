import { MultiSelect, MultiSelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllMapLocation } from '@/services/graphql/query/input-data-map/useReadAllMapLocation';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IMultipleSelectMapLocationRhfProps = {
  control: 'multiple-select-map-location';
  name: string;
  skipQuery?: boolean;
  skipSearchQuery?: boolean;
} & Omit<
  MultiSelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const MultipleSelectMapLocationRhf: React.FC<
  IMultipleSelectMapLocationRhfProps
> = ({
  name,
  control,
  label,
  skipQuery = false,
  skipSearchQuery = true,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);

  const { mapLocationData } = useReadAllMapLocation({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'name',
      search: searchQuery === '' ? null : searchQuery,
      page: 15,
    },
    skip: skipQuery,
  });

  const { uncombinedItem } = useCombineFilterItems({
    data:
      mapLocationData?.map((e) => ({
        id: e.locationId,
        ...e,
      })) ?? [],
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

export default MultipleSelectMapLocationRhf;
