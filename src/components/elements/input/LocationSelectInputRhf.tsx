import { Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllLocationselect } from '@/services/graphql/query/global-select/useReadAllLocationSelect';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ILocationSelectInputRhfProps = {
  control: 'location-select-input';
  name: string;
  labelValue?: string;
  categoryId?: string | null;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const LocationSelectInputRhf: React.FC<ILocationSelectInputRhfProps> = ({
  name,
  control,
  label,
  labelValue,
  defaultValue,
  categoryId = null,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);
  const currentValue = field.value === '' ? null : field.value;

  const { allLocationsData } = useReadAllLocationselect({
    variables: {
      limit: 15,
      orderDir: 'desc',
      search: searchQuery === '' ? null : searchQuery,
      categoryId: categoryId === '' ? null : categoryId,
    },
  });

  const { combinedItems, uncombinedItem } = useCombineFilterItems({
    data: allLocationsData ?? [],
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

export default LocationSelectInputRhf;
