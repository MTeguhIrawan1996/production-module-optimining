import { Group, Select, SelectProps, Text } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useReadAllHeavyEquipmentSelect } from '@/services/graphql/query/global-select/useReadAllHeavyEquipmentSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

export type ISelectHeavyEquipmentNativeProps = {
  control: 'select-heavy-equipment-native';
  categoryId?: string | null;
  skip?: boolean;
} & Omit<
  SelectProps,
  'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
>;

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  category: string;
}

const SelectHeavyEquipmentNative: React.FC<
  ISelectHeavyEquipmentNativeProps
> = ({ control, label, value, categoryId = null, name, skip, ...rest }) => {
  const { t } = useTranslation('allComponents');
  const [filterDataCommon, setFilterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );

  useReadAllHeavyEquipmentSelect({
    variables: {
      limit: null,
      isComplete: true,
      categoryId: categoryId === '' ? null : categoryId,
    },
    skip,
    onCompleted: (data) => {
      const item = data.companyHeavyEquipments.data.map((val) => {
        return {
          id: val.id,
          name: val.hullNumber || '',
          category: val.heavyEquipment.reference.type.category?.name || '-',
        };
      });
      setFilterDataCommon({ key: name || '', data: item });
    },
  });

  const SelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
    ({ label, category, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group>
          <Text size="sm" opacity={0.65}>
            {category}
          </Text>
          <Text size="sm">{label}</Text>
        </Group>
      </div>
    )
  );

  const { uncombinedItem } = useFilterItems({
    data: filterDataCommon.find((v) => v.key === name)?.data ?? [],
    withRest: true,
  });

  return (
    <Select
      value={value}
      radius="sm"
      name={name}
      data={uncombinedItem}
      itemComponent={SelectItem}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
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
