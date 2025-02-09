import { Flex, Group, Select, SelectProps, Stack } from '@mantine/core';
import { Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import {
  IHeavyEquipmentSelect,
  useReadAllHeavyEquipmentSelect,
} from '@/services/graphql/query/global-select/useReadAllHeavyEquipmentSelect';

import { CommonProps } from '@/types/global';

export type IHeavyEquipmentSelectInputRhfProps = {
  control: 'heavyEquipment-select-input';
  name: string;
  labelValue?: string;
  categoryId?: string | null;
  deleteButtonField?: Omit<IPrimaryButtonProps, 'label'>;
  skipSearchQuery?: boolean;
  limit?: number | null;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder' | 'limit'
> &
  CommonProps;

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  category: string;
}

const HeavyEquipmentSelectInputRhf: React.FC<
  IHeavyEquipmentSelectInputRhfProps
> = ({
  name,
  control,
  label,
  labelValue,
  defaultValue,
  categoryId = null,
  deleteButtonField,
  skipSearchQuery = false,
  limit = 15,
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

  const { heavyEquipmentSelect } = useReadAllHeavyEquipmentSelect({
    variables: {
      limit: limit,
      search: searchQuery === '' ? null : searchQuery,
      isComplete: true,
      categoryId: categoryId === '' ? null : categoryId,
    },
  });

  const renderItems = React.useCallback((value: IHeavyEquipmentSelect) => {
    return {
      label: value.hullNumber ?? '',
      value: value.id,
      category: value.heavyEquipment.reference.type.category?.name || '-',
    };
  }, []);

  const uncombinedItem = heavyEquipmentSelect?.map(renderItems) ?? [];

  const Items = heavyEquipmentSelect
    ?.filter((value) => value.id !== defaultValue ?? '')
    .map(renderItems);

  const selectedItem = {
    label: labelValue ?? '',
    value: defaultValue ?? '',
  };
  const combinedItems = [selectedItem, ...(Items ?? [])];

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

  return (
    <Stack spacing={8}>
      <Flex w="100%" align="flex-end" gap="sm">
        <Select
          {...field}
          radius={8}
          data={!currentValue || !defaultValue ? uncombinedItem : combinedItems}
          defaultValue={defaultValue}
          itemComponent={SelectItem}
          w="100%"
          labelProps={{
            style: { fontWeight: 400, fontSize: 16, marginBottom: 8 },
          }}
          descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
          onSearchChange={!skipSearchQuery ? setSearchTerm : undefined}
          searchValue={!skipSearchQuery ? searchTerm : undefined}
          data-control={control}
          placeholder={t('commonTypography.chooseHeavyEquipmentCode', {
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

export default HeavyEquipmentSelectInputRhf;
