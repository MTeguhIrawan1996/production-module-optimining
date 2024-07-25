import { Select, SelectProps, Stack } from '@mantine/core';
import { Text } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllWeek2s } from '@/services/graphql/query/global-select/useReadAllWeekSelect';
import { formatDate } from '@/utils/helper/dateFormat';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

import { CommonProps } from '@/types/global';

export type ISelectWeekRhfProps = {
  control: 'select-week-rhf';
  name: string;
  year?: number | null;
  month?: number | null;
  skipQuery?: boolean;
  withErrorState?: boolean;
  stateKey?: string;
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
  stateKey,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });
  const [filterDataCommon, setFilterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );

  useReadAllWeek2s({
    variables: {
      year,
      month,
    },
    onCompleted: (data) => {
      const yearsItem = data.week2s.map((val) => {
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
      setFilterDataCommon({ key: stateKey || '', data: yearsItem });
    },
    skip: skipQuery,
  });

  const { uncombinedItem } = useFilterItems({
    data: filterDataCommon.find((v) => v.key === stateKey)?.data ?? [],
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
