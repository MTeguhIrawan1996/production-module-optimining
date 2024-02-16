import { Select, SelectProps } from '@mantine/core';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FieldErrorMessage from '@/components/elements/global/FieldErrorMessage';

import { useReadAllWeatherCondition } from '@/services/graphql/query/global-select/useReadAllWeatherCondition';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { CommonProps } from '@/types/global';

export type IWeatherConditionSelectInputRhfProps = {
  control: 'weather-condition-select-input';
  name: string;
} & Omit<
  SelectProps,
  | 'name'
  | 'data'
  | 'onSearchChange'
  | 'searchValue'
  | 'searchable'
  | 'placeholder'
> &
  CommonProps;

const WeatherConditionSelectInputRhf: React.FC<
  IWeatherConditionSelectInputRhfProps
> = ({ name, control, label, defaultValue, ...rest }) => {
  const { t } = useTranslation('allComponents');
  const { field, fieldState } = useController({ name });

  const { weatherConditionsdata } = useReadAllWeatherCondition({
    variables: {
      limit: null,
    },
  });

  const { uncombinedItem } = useFilterItems({
    data: weatherConditionsdata ?? [],
  });

  return (
    <Select
      {...field}
      radius={8}
      data={uncombinedItem}
      defaultValue={defaultValue}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      placeholder={t('commonTypography.chooseCondition', {
        ns: 'default',
      })}
      label={label ? t(`components.field.${label}`) : null}
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

export default WeatherConditionSelectInputRhf;
