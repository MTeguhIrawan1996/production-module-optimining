/* eslint-disable unused-imports/no-unused-vars */
import { Flex, Select, SelectProps, Stack } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllHeavyEquipmentRefrence } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipment';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export interface ISelectReferenceHeavyEquipment {
  id: string;
  key: number;
  name: string;
}

export type ISelectHeavyEquipmentReferenceInputProps = {
  control: 'select-heavy-equipment-reference-input';
  name: string;
  fields: ISelectReferenceHeavyEquipment[];
  handleSetValue?: (value: string, name?: string) => void;
  handleClearValue?: () => void;
  deleteFieldButton?: {
    onDeletedField: () => void;
  } & Omit<IPrimaryButtonProps, 'label' | 'onClick'>;
  error?: React.ReactNode;
} & Omit<
  SelectProps,
  | 'name'
  | 'data'
  | 'searchable'
  | 'clearable'
  | 'onSearchChange'
  | 'searchValue'
  | 'error'
> &
  CommonProps;

const SelectHeavyEquipmentReferenceInput: React.FC<
  ISelectHeavyEquipmentReferenceInputProps
> = ({
  name,
  control,
  label,
  fields,
  handleSetValue,
  handleClearValue,
  deleteFieldButton,
  value,
  key,
  error,
  ...rest
}) => {
  const [searchQueryTerm, setSearchQueryTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchQueryTerm, 400);
  const { t } = useTranslation('allComponents');
  const {
    variant = 'light',
    color = 'red',
    onDeletedField,
    ...restDeletedField
  } = deleteFieldButton || {};

  const currentValues = fields.find((val) => val.id === value);

  const { heavyEquipmentsData } = useReadAllHeavyEquipmentRefrence({
    variables: {
      limit: 15,
      search: searchQuery === '' ? null : searchQuery,
    },
  });

  const heavyEquipmentItem = heavyEquipmentsData?.map((val) => {
    return {
      name: val.modelName,
      id: val.id,
    };
  });

  const { combinedItems: typeItems, uncombinedItem: typeUncombineItem } =
    useCombineFilterItems({
      data: heavyEquipmentItem ?? [],
      combinedId: currentValues?.id,
      combinedName: currentValues?.name,
    });

  return (
    <Stack spacing={8}>
      <Flex w="100%" align="flex-end" gap="sm">
        <Select
          w="100%"
          radius={8}
          labelProps={{
            style: { fontWeight: 400, fontSize: 16, marginBottom: 8 },
          }}
          descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
          name={name}
          data-control={control}
          value={value}
          label={label ? t(`components.field.${label}`) : null}
          data={currentValues?.id !== '' ? typeItems : typeUncombineItem}
          searchable={true}
          clearable={true}
          onSearchChange={setSearchQueryTerm}
          searchValue={searchQueryTerm}
          filter={(_, item) => !fields.some((val) => val.id === item.value)}
          onChange={(value) => {
            if (!value) {
              handleClearValue?.();
              return;
            }
            const label = heavyEquipmentsData?.find((val) => val.id === value);
            handleSetValue?.(value, label?.modelName ?? '');
          }}
          {...rest}
        />
        {deleteFieldButton ? (
          <PrimaryButton
            label={t('commonTypography.delete', { ns: 'default' })}
            variant={variant}
            color={color}
            onClick={() => {
              onDeletedField?.();
            }}
            {...restDeletedField}
          />
        ) : null}
      </Flex>
      {error && <FieldErrorMessage color="red">{error}</FieldErrorMessage>}
    </Stack>
  );
};

export default SelectHeavyEquipmentReferenceInput;
