import { Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useReadAllHeavyEquipmentSelect } from '@/services/graphql/query/global-select/useReadAllHeavyEquipmentSelect';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

export type ISelectHeavyEquipmentNativeProps = {
  control: 'select-heavy-equipment-native';
  labelValue?: string;
  categoryId?: string | null;
} & Omit<
  SelectProps,
  'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
>;

const SelectHeavyEquipmentNative: React.FC<
  ISelectHeavyEquipmentNativeProps
> = ({
  control,
  label,
  labelValue,
  defaultValue,
  value,
  categoryId = null,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);

  const { heavyEquipmentSelect } = useReadAllHeavyEquipmentSelect({
    variables: {
      limit: null,
      search: searchQuery === '' ? null : searchQuery,
      isComplete: true,
      categoryId: categoryId === '' ? null : categoryId,
    },
  });

  const heavyEquipmentItem = heavyEquipmentSelect?.map((val) => {
    return {
      name: val.hullNumber ?? '',
      id: val.id ?? '',
    };
  });

  const { uncombinedItem } = useCombineFilterItems({
    data: heavyEquipmentItem ?? [],
    combinedId: defaultValue ?? '',
    combinedName: labelValue,
  });

  return (
    <Select
      value={value}
      radius="sm"
      data={uncombinedItem}
      defaultValue={defaultValue}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      onSearchChange={setSearchTerm}
      searchValue={searchTerm}
      data-control={control}
      placeholder={t('commonTypography.chooseHeavyEquipmentCode', {
        ns: 'default',
      })}
      label={label ? t(`components.field.${label}`) : null}
      {...rest}
    />
  );
};

export default SelectHeavyEquipmentNative;
