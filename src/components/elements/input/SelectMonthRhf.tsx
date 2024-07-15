import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllMonth2Select } from '@/services/graphql/query/global-select/useReadAllMonthSelect';
import dayjs from '@/utils/helper/dayjs.config';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ISelectMonthRhfProps = {
  control: 'select-month-rhf';
  name: string;
  skipQuery?: boolean;
  withErrorState?: boolean;
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'> &
  CommonProps;

const SelectMonthRhf: React.FC<ISelectMonthRhfProps> = ({
  control,
  label = 'month',
  placeholder = 'chooseMonth',
  name,
  skipQuery = false,
  withErrorState = true,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  const { month2sData } = useReadAllMonth2Select({
    skip: skipQuery,
  });

  const monthsItem = month2sData?.map((val) => {
    return {
      name: `${dayjs()
        .month(val.month - 1)
        .format('MMMM')}`,
      id: `${val.month}`,
    };
  });

  const { uncombinedItem } = useFilterItems({
    data: monthsItem ?? [],
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

export default SelectMonthRhf;
