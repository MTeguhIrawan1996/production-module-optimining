import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllMapType } from '@/services/graphql/query/plan/weekly/mining-map-plan/useReadAllMapType';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ISelectMapTypeRhfProps = {
  control: 'select-mapType-rhf';
  name: string;
  skipQuery?: boolean;
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'> &
  CommonProps;

const SelectMapTypeRhf: React.FC<ISelectMapTypeRhfProps> = ({
  control,
  label = 'mapType',
  placeholder = 'chooseMapType',
  name,
  skipQuery = false,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  const { miningMapTypesData } = useReadAllMapType({
    skip: skipQuery,
  });

  const { uncombinedItem } = useFilterItems({
    data: miningMapTypesData ?? [],
  });

  return (
    <Select
      {...field}
      data={uncombinedItem}
      radius="sm"
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      label={label ? t(`components.field.${label}`) : null}
      placeholder={
        placeholder
          ? t(`commonTypography.${placeholder}`, { ns: 'default' })
          : undefined
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

export default SelectMapTypeRhf;
