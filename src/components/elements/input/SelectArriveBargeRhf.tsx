import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllArriveBargeSelect } from '@/services/graphql/query/global-select/useReadAllArriveBargeSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IArriveBargeRhfProps = {
  control: 'select-arrive-barge-rhf';
  name: string;
} & Omit<SelectProps, 'data' | 'name' | 'onSearchChange' | 'searchValue'> &
  CommonProps;

const SelectArriveBargeRhf: React.FC<IArriveBargeRhfProps> = ({
  control,
  label = 'arrive',
  placeholder = 'chooseArrive',
  name,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const { arriveBargeData } = useReadAllArriveBargeSelect({});
  const { uncombinedItem } = useFilterItems({
    data: arriveBargeData ?? [],
  });

  return (
    <Select
      {...field}
      data={uncombinedItem}
      radius={8}
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

export default SelectArriveBargeRhf;
