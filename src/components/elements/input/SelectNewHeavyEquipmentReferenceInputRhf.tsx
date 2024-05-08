import { Flex, Select, SelectProps, Stack } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllHeavyEquipmentRefrence } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipment';
import { useReadOneHeavyEquipmentReference } from '@/services/graphql/query/heavy-equipment/useReadOneHeavyEquipment';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ISelectNewHeavyEquipmentReferenceRhfProps = {
  control: 'select-new-heavy-equipment-reference-input';
  name: string;
  deleteButtonField?: Omit<IPrimaryButtonProps, 'label'>;
  skipQuery?: boolean;
} & Omit<
  SelectProps,
  'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const SelectNewHeavyEquipmentReferenceInputRhf: React.FC<
  ISelectNewHeavyEquipmentReferenceRhfProps
> = ({
  name,
  control,
  label,
  deleteButtonField,
  skipQuery = false,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);
  const currentValue = field.value === '' ? null : field.value;
  const {
    variant = 'light',
    color = 'red',
    ...restDeleteButtonField
  } = deleteButtonField || {};

  const { heavyEquipmentsData } = useReadAllHeavyEquipmentRefrence({
    variables: {
      limit: 15,
      search: searchQuery === '' ? null : searchQuery,
    },
    skip: skipQuery,
    fetchPolicy: 'cache-first',
  });

  const { heavyEquipmentReferenceData } = useReadOneHeavyEquipmentReference({
    variables: {
      id: currentValue,
    },
    skip: !currentValue,
    fetchPolicy: 'cache-first',
  });

  const heavyEquipmentItem = heavyEquipmentsData?.map((val) => {
    return {
      name: val.modelName ?? '',
      id: val.id ?? '',
    };
  });

  const { uncombinedItem, combinedItems } = useCombineFilterItems({
    data: heavyEquipmentItem ?? [],
    combinedId: currentValue ?? '',
    combinedName: heavyEquipmentReferenceData?.modelName || '',
  });

  return (
    <Stack spacing={8}>
      <Flex w="100%" align="flex-end" gap="sm">
        <Select
          {...field}
          radius={8}
          w="100%"
          data={!currentValue ? uncombinedItem : combinedItems}
          onSearchChange={setSearchTerm}
          searchValue={searchTerm}
          labelProps={{
            style: { fontWeight: 400, fontSize: 16, marginBottom: 8 },
          }}
          descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
          data-control={control}
          placeholder={t('commonTypography.chooseModel', {
            ns: 'default',
          })}
          label={label ? t(`components.field.${label}`) : null}
          error={fieldState && fieldState.error ? true : false}
          {...rest}
        />
        {deleteButtonField ? (
          <PrimaryButton
            label={t('commonTypography.delete', { ns: 'default' })}
            variant={variant}
            color={color}
            {...restDeleteButtonField}
          />
        ) : null}
      </Flex>
      {fieldState && fieldState.error && (
        <FieldErrorMessage color="red">
          {fieldState.error.message}
        </FieldErrorMessage>
      )}
    </Stack>
  );
};

export default SelectNewHeavyEquipmentReferenceInputRhf;
