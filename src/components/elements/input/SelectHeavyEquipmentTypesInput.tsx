/* eslint-disable unused-imports/no-unused-vars */
import { Flex, Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';

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
} & Omit<
  SelectProps,
  | 'name'
  | 'data'
  | 'searchable'
  | 'clearable'
  | 'onSearchChange'
  | 'searchValue'
  | 'onChange'
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

  const datas = [
    {
      id: '2bae26b7-2c6f-49c6-968b-226c9ae3e8dd',
      name: '2WD Tractor',
      slug: '2wd-tractor',
      brand: {
        id: '3ca48f5e-f059-441d-bd90-ebdd7a3b4c79',
        name: 'John Deere',
      },
    },
    {
      id: 'c6693d14-9456-44ad-be56-ec4290f640a9',
      name: '4WD Tractor',
      slug: '4wd-tractor',
      brand: {
        id: '498e032d-3216-4c66-a283-5e10ea189f4d',
        name: 'Caterpilar',
      },
    },
    {
      id: '9dd6faa4-9265-45de-93e9-0fa6a0892c61',
      name: '4WD Tractor',
      slug: '4wd-tractor',
      brand: {
        id: '3ca48f5e-f059-441d-bd90-ebdd7a3b4c79',
        name: 'John Deere',
      },
    },
    {
      id: '1f807f58-035d-461f-8987-87ca67e72823',
      name: '4WD Tractor',
      slug: '4wd-tractor',
      brand: {
        id: '1c79121d-b46a-45da-99aa-df5281b7560c',
        name: 'Yanmar',
      },
    },
    {
      id: '70d530cf-9f51-48ba-a473-96a3f921d418',
      name: 'All Terrain Crane',
      slug: 'all-terrain-crane',
      brand: {
        id: 'b937010d-8771-4d4c-8310-a54312a5ce81',
        name: 'Terex',
      },
    },
    {
      id: '9ef8ef0d-8688-48c3-8ad9-a521cef038e3',
      name: 'All Terrain Crane',
      slug: 'all-terrain-crane',
      brand: {
        id: 'b461dd6a-c005-4f02-878e-664ae97eb9f6',
        name: 'Link-Belt',
      },
    },
    {
      id: '91531523-f4cd-49a2-9344-5bda09162b8c',
      name: 'Articulated Dump Truck',
      slug: 'articulated-dump-truck',
      brand: {
        id: '3ca48f5e-f059-441d-bd90-ebdd7a3b4c79',
        name: 'John Deere',
      },
    },
    {
      id: '94316eeb-4910-4393-9d40-87dfacd620b7',
      name: 'Articulated Dump Truck',
      slug: 'articulated-dump-truck',
      brand: {
        id: '1cc5d251-ccb6-480e-8175-ee0e7dfb17f6',
        name: 'Astra',
      },
    },
    {
      id: '760a70b1-141b-4ffa-a8f7-b9b8ed533b7b',
      name: 'Articulated Dump Truck',
      slug: 'articulated-dump-truck',
      brand: {
        id: '498e032d-3216-4c66-a283-5e10ea189f4d',
        name: 'Caterpilar',
      },
    },
    {
      id: '98d53d6d-d8c9-4368-8ec9-7f6df57dd1d6',
      name: 'Articulated Dump Truck',
      slug: 'articulated-dump-truck',
      brand: {
        id: 'b461dd6a-c005-4f02-878e-664ae97eb9f6',
        name: 'Link-Belt',
      },
    },
  ];

  const { uncombinedItem: typeItems } = useCombineFilterItems({
    data: datas ?? [],
  });

  return (
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
  );
};

export default SelectHeavyEquipmentTypesInput;
