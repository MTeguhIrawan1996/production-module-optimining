import { Group, Select, SelectProps, Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import {
  IEmployeesData,
  useReadAllCompanyEmploye,
} from '@/services/graphql/query/master-data-company/useReadAllEmploye';

import { CommonProps } from '@/types/global';

export type IEmployeeSelectInputRhfProps = {
  control: 'employee-select-input';
  name: string;
  labelValue?: string;
  positionId?: string | null;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  nip: string;
}

const EmployeeSelectInputRhf: React.FC<IEmployeeSelectInputRhfProps> = ({
  name,
  control,
  label,
  labelValue,
  defaultValue,
  positionId = null,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);
  const currentValue = field.value === '' ? null : field.value;
  const { employeesData } = useReadAllCompanyEmploye({
    variables: {
      limit: 15,
      search: searchQuery === '' ? null : searchQuery,
      isComplete: true,
      positionId: positionId === '' ? null : positionId,
    },
  });

  const renderItems = React.useCallback((value: IEmployeesData) => {
    return {
      label: value.humanResource?.name ?? '',
      value: value.id,
      nip: value.nip,
    };
  }, []);

  const uncombinedItem = employeesData?.map(renderItems) ?? [];

  const Items = employeesData
    ?.filter((value) => value.id !== defaultValue ?? '')
    .map(renderItems);

  const selectedItem = {
    label: labelValue ?? '',
    value: defaultValue ?? '',
  };
  const combinedItems = [selectedItem, ...(Items ?? [])];

  const SelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
    ({ label, nip, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group>
          <Text size="sm" opacity={0.65}>
            {nip}
          </Text>
          <Text size="sm">{label}</Text>
        </Group>
      </div>
    )
  );

  return (
    <Select
      {...field}
      radius={8}
      data={!currentValue || !defaultValue ? uncombinedItem : combinedItems}
      defaultValue={defaultValue}
      itemComponent={SelectItem}
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
      placeholder={t('commonTypography.chooseEmployee', {
        ns: 'default',
      })}
      label={label ? t(`components.field.${label}`) : null}
      filter={(value, item) =>
        item?.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
        item?.nip?.toLowerCase().includes(value.toLowerCase().trim())
      }
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

export default EmployeeSelectInputRhf;
