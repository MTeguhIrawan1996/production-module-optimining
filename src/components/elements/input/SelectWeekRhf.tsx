import { Select, SelectProps, Stack } from '@mantine/core';
import { Text } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllWeek2s } from '@/services/graphql/query/global-select/useReadAllWeekSelect';
import { formatDate } from '@/utils/helper/dateFormat';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ISelectWeekRhfProps = {
  control: 'select-week-rhf';
  name: string;
  year?: number | null;
  month?: number | null;
  skipQuery?: boolean;
  withErrorState?: boolean;
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'> &
  CommonProps;

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  endDate: string;
  startDate: string;
}

const SelectWeekRhf: React.FC<ISelectWeekRhfProps> = ({
  control,
  year = null,
  month = null,
  label = 'week',
  placeholder = 'chooseWeek',
  name,
  skipQuery = false,
  withErrorState = true,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  const { week2sData } = useReadAllWeek2s({
    variables: {
      year,
      month,
    },
    skip: skipQuery,
  });

  const weeksItem = week2sData?.map((val) => {
    return {
      id: `${val.week}`,
      name: t('commonTypography.nthWeek', {
        n: val.week, // week is started by 1 by default
        ns: 'default',
      }),
      startDate: val.detail.startDate,
      endDate: val.detail.endDate,
    };
  });

  const { uncombinedItem } = useFilterItems({
    data: weeksItem ?? [],
    withRest: true,
  });

  const SelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
    ({ endDate, startDate, label, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Stack spacing={2}>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {formatDate(startDate, 'DD MMM')} - {formatDate(endDate, 'DD MMM')}
          </Text>
        </Stack>
      </div>
    )
  );

  return (
    <Select
      {...field}
      data={uncombinedItem}
      radius={8}
      itemComponent={SelectItem}
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

export default SelectWeekRhf;
