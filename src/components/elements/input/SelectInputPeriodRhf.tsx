import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ISelectInputPeriodRhf = {
  control: 'select-period-rhf';
  name: string;
  withErrorState?: boolean;
} & Omit<
  SelectProps,
  'data' | 'onSearchChange' | 'searchValue' | 'placeholder'
> &
  CommonProps;

const SelectInputPeriodRhf: React.FC<ISelectInputPeriodRhf> = ({
  control,
  label = 'period',
  name,
  withErrorState,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  const data = [
    {
      id: 'DATE_RANGE',
      name: 'Rentang waktu',
    },
    {
      id: 'MONTH',
      name: t('commonTypography.month', { ns: 'default' }),
    },
    {
      id: 'WEEK',
      name: t('commonTypography.week', { ns: 'default' }),
    },
  ];

  const { uncombinedItem } = useCombineFilterItems({
    data,
  });

  return (
    <Select
      {...field}
      radius="sm"
      data={uncombinedItem}
      name={name}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      placeholder={t('commonTypography.choosePeriod', {
        ns: 'default',
      })}
      label={label ? t(`components.field.${label}`) : null}
      error={
        withErrorState
          ? fieldState &&
            fieldState.error && (
              <FieldErrorMessage>{fieldState.error.message}</FieldErrorMessage>
            )
          : undefined
      }
      {...rest}
    />
  );
};

export default SelectInputPeriodRhf;
