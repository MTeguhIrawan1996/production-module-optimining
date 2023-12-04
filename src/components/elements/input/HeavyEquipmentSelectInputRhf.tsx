import { Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllHeavyEquipmentSelect } from '@/services/graphql/query/global-select/useReadAllHeavyEquipmentSelect';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IHeavyEquipmentSelectInputRhfProps = {
  control: 'heavyEquipment-select-input';
  name: string;
  labelValue?: string;
  categorySlug?: string | null;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const HeavyEquipmentSelectInputRhf: React.FC<
  IHeavyEquipmentSelectInputRhfProps
> = ({
  name,
  control,
  label,
  labelValue,
  defaultValue,
  categorySlug,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);
  const currentValue = field.value === '' ? null : field.value;

  const { heavyEquipmentSelect } = useReadAllHeavyEquipmentSelect({
    variables: {
      limit: 15,
      search: searchQuery === '' ? null : searchQuery,
      isComplete: true,
      categorySlug: categorySlug === '' ? null : categorySlug,
    },
  });

  const heavyEquipmentItem = heavyEquipmentSelect?.map((val) => {
    return {
      name: val.hullNumber ?? '',
      id: val.id ?? '',
    };
  });

  const { combinedItems, uncombinedItem } = useCombineFilterItems({
    data: heavyEquipmentItem ?? [],
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
      placeholder={t('commonTypography.chooseHeavyEquipmentCode', {
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

export default HeavyEquipmentSelectInputRhf;
