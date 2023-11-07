/* eslint-disable unused-imports/no-unused-vars */
import { Select, SelectProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllSubDistrict } from '@/services/graphql/query/global-select/useReadAllSubDistrict';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ISubDistrictSelectInputRhfProps = {
  control: 'subdistrict-select-input';
  name: string;
  labelValue?: string;
  provinceId?: string;
  regencyId?: string;
} & Omit<
  SelectProps,
  'name' | 'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const SubDistrictSelectInputRhf: React.FC<ISubDistrictSelectInputRhfProps> = ({
  name,
  control,
  label,
  labelValue,
  defaultValue,
  provinceId,
  regencyId,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(searchTerm, 400);

  const { districtsData } = useReadAllSubDistrict({
    variables: {
      limit: 15,
      search: searchQuery === '' ? null : searchQuery,
      provinceId: provinceId === '' ? null : provinceId,
      regencyId: regencyId === '' ? null : regencyId,
    },
  });

  const { combinedItems, uncombinedItem } = useCombineFilterItems({
    data: districtsData ?? [],
    combinedId: defaultValue ?? '',
    combinedName: labelValue,
  });

  return (
    <Select
      {...field}
      radius={8}
      data={defaultValue ? combinedItems : uncombinedItem}
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
      placeholder={t('commonTypography.chooseSubDistrict', {
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

export default SubDistrictSelectInputRhf;
