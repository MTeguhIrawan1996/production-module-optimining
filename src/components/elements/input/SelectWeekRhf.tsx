import { Select, SelectProps } from '@mantine/core';
import { Text } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllWeek2s } from '@/services/graphql/query/global-select/useReadAllWeekSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type ISelectWeekRhfProps = {
  control: 'select-week-rhf';
  name: string;
  year?: number | null;
  skipQuery?: boolean;
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'> &
  CommonProps;

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
}

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

  const { week2sData } = useReadAllWeek2s({
    variables: {
      year,
    },
    skip: skipQuery,
  });

  const weeksItem = week2sData?.map((val) => {
    return {
      name: t('commonTypography.nthWeek', {
        n: val.week, // week is started by 1 by default
        ns: 'default',
      }),
      id: `${val.week}`,
    };
  });

  const { uncombinedItem } = useFilterItems({
    data: weeksItem ?? [],
  });

  const SelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
    ({ label, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Text size="sm">{label}</Text>
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
