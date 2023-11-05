/* eslint-disable unused-imports/no-unused-vars */
import { Flex, Select, SelectProps, Stack } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllHeavyEquipmentType } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentType';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

export interface ISelectTypesHeavyEquipment {
  id: string;
  key: number;
}

export type ISelectHeavyEquipmentTypesInputProps = {
  control: 'select-heavy-equipment-types-input';
  name: string;
  fields: ISelectTypesHeavyEquipment[];
  handleSetValue?: (value: string) => void;
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
>;

const SelectHeavyEquipmentTypesInput: React.FC<
  ISelectHeavyEquipmentTypesInputProps
> = ({
  name,
  control,
  label,
  fields,
  handleSetValue,
  handleClearValue,
  deleteFieldButton,
  error,
  ...rest
}) => {
  const [typeSearchTerm, setTypeSearchTerm] = React.useState<string>('');
  const [typeSearchQuery] = useDebouncedValue<string>(typeSearchTerm, 400);
  const { t } = useTranslation('allComponents');
  const {
    variant = 'light',
    color = 'red',
    onDeletedField,
    ...restDeletedField
  } = deleteFieldButton || {};

  const { typesData } = useReadAllHeavyEquipmentType({
    variables: {
      limit: 15,
      search: typeSearchQuery === '' ? null : typeSearchQuery,
    },
  });

  const { uncombinedItem: typeItems } = useCombineFilterItems({
    data: typesData ?? [],
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
          styles={(theme) => ({
            item: {
              borderRadius: theme.spacing.xs,
            },
            dropdown: {
              borderRadius: theme.spacing.xs,
            },
          })}
          name={name}
          data-control={control}
          label={label ? t(`components.field.${label}`) : null}
          data={typeItems}
          searchable={true}
          clearable={true}
          onSearchChange={setTypeSearchTerm}
          searchValue={typeSearchTerm}
          filter={(_, item) => !fields.some((val) => val.id === item.value)}
          onChange={(value) => {
            if (!value) {
              handleClearValue?.();
              return;
            }
            handleSetValue?.(value);
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

export default SelectHeavyEquipmentTypesInput;
