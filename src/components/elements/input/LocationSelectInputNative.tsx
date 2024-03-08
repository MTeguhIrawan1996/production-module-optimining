import { Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useReadAllLocationselect } from '@/services/graphql/query/global-select/useReadAllLocationSelect';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

export type ILocationNativeProps = {
  control: 'select-location-native';
  categoryIds?: string[] | null;
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;

const LocationSelectInputNative: React.FC<ILocationNativeProps> = ({
  control,
  label = 'location',
  categoryIds,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);

  const { allLocationsData } = useReadAllLocationselect({
    variables: {
      search: searchQuery === '' ? null : searchQuery,
      limit: 15,
      categoryIds: categoryIds && categoryIds.length > 0 ? categoryIds : null,
    },
  });

  const { uncombinedItem } = useCombineFilterItems({
    data: allLocationsData ?? [],
  });

  return (
    <Select
      radius="sm"
      data={uncombinedItem}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      onSearchChange={setSearchTerm}
      data-control={control}
      searchValue={searchTerm}
      placeholder={t('commonTypography.chooseLocation', {
        ns: 'default',
      })}
      label={label ? t(`components.field.${label}`) : null}
      {...rest}
    />
  );
};

export default LocationSelectInputNative;
