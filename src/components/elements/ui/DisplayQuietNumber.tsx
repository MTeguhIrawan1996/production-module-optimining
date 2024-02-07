import {
  NumberInput as MantineNumberInput,
  NumberInputProps,
} from '@mantine/core';
import * as React from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { IMutationHeavyEquipmentAvailabilityPlanData } from '@/services/graphql/mutation/plan/weekly/useCreateHeavyEquipmentAvailabilityPlan';

import { CommonProps } from '@/types/global';

export type IDisplayQuietNumber = {
  control: 'display-quiet-number';
  name: string;
  labelWithTranslate?: boolean;
} & Omit<NumberInputProps, 'name'> &
  CommonProps;

const DisplayQuietNumber: React.FC<IDisplayQuietNumber> = ({
  control,
  label,
  labelWithTranslate = true,
  precision = 0,
  hideControls = true,
  disabled = true,
  name,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');

  const data: IMutationHeavyEquipmentAvailabilityPlanData = useWatch({
    name,
  });

  const valueMemo = React.useMemo(() => {
    return (
      (data.totalCount || 0) -
      (data.damagedCount || 0) -
      (data.withoutOperatorCount || 0)
    );
  }, [data]);

  return (
    <MantineNumberInput
      radius={8}
      name={name}
      disabled={disabled}
      hideControls={hideControls}
      labelProps={{ style: { fontWeight: 400, fontSize: 16, marginBottom: 8 } }}
      descriptionProps={{ style: { fontWeight: 400, fontSize: 14 } }}
      data-control={control}
      label={
        labelWithTranslate
          ? label
            ? t(`components.field.${label}`)
            : null
          : label
      }
      parser={(value) => value.replace(/\s|,/g, '.')}
      precision={precision}
      value={valueMemo || ''}
      {...rest}
    />
  );
};

export default DisplayQuietNumber;
