/* eslint-disable unused-imports/no-unused-vars */
import { Flex, Select, SelectProps, Stack } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import {
  ITypes,
  useReadAllActivityCategory,
} from '@/services/graphql/query/activity-category/useReadAllActivityCategoryMaster';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ISelectActivityCategoryRhfProps = {
  control: 'select-activity-category-rhf';
  name: string;
  labelValue?: string;
  deleteButtonField?: Omit<IPrimaryButtonProps, 'label'>;
  types?: ITypes[] | null;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const SelectActivityCategoryRhf: React.FC<ISelectActivityCategoryRhfProps> = ({
  name,
  control,
  label,
  labelValue,
  defaultValue,
  deleteButtonField,
  types = null,
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

  const { readAllActivityCategoryDataPure } = useReadAllActivityCategory({
    variables: {
      limit: 20,
      types: types,
      orderDir: 'desc',
      search: searchQuery === '' ? null : searchQuery,
    },
    fetchPolicy: 'cache-and-network',
  });

  const { combinedItems, uncombinedItem } = useCombineFilterItems({
    data: readAllActivityCategoryDataPure ?? [],
    combinedId: defaultValue ?? '',
    combinedName: labelValue,
  });

  return (
    <Stack spacing={8}>
      <Flex w="100%" align="flex-end" gap="sm">
        <Select
          {...field}
          radius={8}
          w="100%"
          data={!currentValue || !defaultValue ? uncombinedItem : combinedItems}
          defaultValue={defaultValue}
          labelProps={{
            style: { fontWeight: 400, fontSize: 16, marginBottom: 8 },
          }}
          descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
          onSearchChange={setSearchTerm}
          searchValue={searchTerm}
          data-control={control}
          placeholder={t('commonTypography.chooseCategory', {
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

export default SelectActivityCategoryRhf;
