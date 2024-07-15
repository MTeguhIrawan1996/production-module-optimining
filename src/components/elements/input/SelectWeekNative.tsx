import { Select, SelectProps, Stack, Text } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { useReadAllWeek2s } from '@/services/graphql/query/global-select/useReadAllWeekSelect';
import { formatDate } from '@/utils/helper/dateFormat';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

export type ISelectWeekNativeProps = {
  control: 'select-week-native';
  year?: number | null;
  month?: number | null;
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;
interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  endDate: string;
  startDate: string;
}

const SelectWeekNative: React.FC<ISelectWeekNativeProps> = ({
  control,
  year = null,
  month = null,
  label = 'week',
  placeholder = 'chooseWeek',
  name,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
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
      setFilterDataCommon({ key: name || '', data: yearsItem });
    },
  });

  const { uncombinedItem } = useFilterItems({
    data: filterDataCommon.find((v) => v.key === name)?.data ?? [],
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
      data={uncombinedItem}
      radius="sm"
      name={name}
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
