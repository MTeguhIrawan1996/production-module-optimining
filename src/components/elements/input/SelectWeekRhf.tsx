import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllWeekSelect } from '@/services/graphql/query/global-select/useReadAllWeekSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ISelectWeekRhfProps = {
  control: 'select-week-rhf';
  name: string;
  year?: number | null;
  skipQuery?: boolean;
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'> &
  CommonProps;

const SelectWeekRhf: React.FC<ISelectWeekRhfProps> = ({
  control,
  year = null,
  label = 'week',
  placeholder = 'chooseWeek',
  name,
  skipQuery = false,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  const { weeksData } = useReadAllWeekSelect({
    variables: {
      year,
    },
    skip: skipQuery,
  });

  const weeksItem = weeksData?.map((val) => {
    return {
      name: `${val}`,
      id: `${val}`,
    };
  });

  const { uncombinedItem } = useFilterItems({
    data: weeksItem ?? [],
  });

  return (
    <Select
      {...field}
      data={uncombinedItem}
      radius={8}
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

export default SelectWeekRhf;
