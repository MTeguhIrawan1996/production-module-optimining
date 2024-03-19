import { Select, SelectProps, Text } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useReadAllWeek2s } from '@/services/graphql/query/global-select/useReadAllWeekSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

export type ISelectWeekNativeProps = {
  control: 'select-week-native';
  year?: number | null;
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;
interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
}

const SelectWeekNative: React.FC<ISelectWeekNativeProps> = ({
  control,
  year = null,
  label = 'week',
  placeholder = 'chooseWeek',
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { week2sData } = useReadAllWeek2s({
    variables: {
      year,
    },
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
      data={uncombinedItem}
      radius="sm"
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
      {...rest}
    />
  );
};

export default SelectWeekNative;
