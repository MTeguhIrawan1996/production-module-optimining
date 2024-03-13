/* eslint-disable unused-imports/no-unused-vars */
import { Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllHeavyEquipmentRefrence } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipment';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IModelSelectInputRhfProps = {
  control: 'model-select-input';
  name: string;
  labelValue?: string;
  brandId?: string;
  typeId?: string;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const ModelSelectInputRhf: React.FC<IModelSelectInputRhfProps> = ({
  name,
  control,
  label,
  labelValue,
  defaultValue,
  brandId = null,
  typeId = null,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);
  const currentValue = field.value;

  const { heavyEquipmentsData: modelRefrence } =
    useReadAllHeavyEquipmentRefrence({
      variables: {
        limit: 15,
        search: searchQuery === '' ? null : searchQuery,
        brandId: brandId === '' ? null : brandId,
        typeId: typeId === '' ? null : typeId,
      },
      fetchPolicy: 'cache-and-network',
    });
  const heavyEquipmentItem = modelRefrence?.map((val) => {
    return {
      name: val.modelName,
      id: val.id,
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
      data={
        currentValue === '' || !defaultValue ? uncombinedItem : combinedItems
      }
      defaultValue={defaultValue}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      onSearchChange={setSearchTerm}
      searchValue={searchTerm}
      data-control={control}
      placeholder={t('commonTypography.chooseModel', {
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

export default ModelSelectInputRhf;
