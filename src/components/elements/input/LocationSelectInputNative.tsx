import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useReadAllLocationselect } from '@/services/graphql/query/global-select/useReadAllLocationSelect';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

export type ILocationNativeProps = {
  control: 'select-location-native';
  categoryIds?: string[] | null;
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;

const LocationSelectInputNative: React.FC<ILocationNativeProps> = ({
  control,
  label = 'location',
  categoryIds,
  name,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const [filterDataCommon, setFilterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );
  // const [searchTerm, setSearchTerm] = React.useState<string>('');
  // const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);

  useReadAllLocationselect({
    variables: {
      // search: searchQuery === '' ? null : searchQuery,
      limit: null,
      categoryIds: categoryIds && categoryIds.length > 0 ? categoryIds : null,
    },
    onCompleted: (data) => {
      const monthItem = data.allLocations.data.map((val) => {
        return {
          name: val.name,
          id: val.id,
        };
      });
      setFilterDataCommon({ key: name || '', data: monthItem });
    },
  });

  const { uncombinedItem } = useCombineFilterItems({
    data: filterDataCommon.find((v) => v.key === name)?.data ?? [],
  });

  return (
    <Select
      radius="sm"
      data={uncombinedItem}
      name={name}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      // onSearchChange={setSearchTerm}
      data-control={control}
      // searchValue={searchTerm}
      placeholder={t('commonTypography.chooseLocation', {
        ns: 'default',
      })}
      label={label ? t(`components.field.${label}`) : null}
      {...rest}
    />
  );
};

export default LocationSelectInputNative;
