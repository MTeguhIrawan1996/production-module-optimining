import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useReadAllStatusSelect } from '@/services/graphql/query/global-select/useReadAllStatusSelect';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

export type IStatusNativeProps = {
  control: 'select-status-native';
} & Omit<SelectProps, 'data' | 'onSearchChange' | 'searchValue'>;

const SelectStatusNative: React.FC<IStatusNativeProps> = ({
  control,
  label = 'status',
  placeholder = 'chooseStatus',
  ...rest
}) => {
  const { t } = useTranslation('allComponents');
  const { statusesData } = useReadAllStatusSelect({});

  const { uncombinedItem } = useFilterItems({
    data: statusesData ?? [],
  });

  return (
    <Select
      data={uncombinedItem}
      radius="lg"
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
      {...rest}
    />
  );
};

export default SelectStatusNative;
