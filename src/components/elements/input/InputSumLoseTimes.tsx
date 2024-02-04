import {
  NumberInput as MantineNumberInput,
  NumberInputProps,
} from '@mantine/core';
import * as React from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { IWorkTimePlanActivities } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyWorkTimePlan';

import { CommonProps } from '@/types/global';

export type IInputSumLoseTimesProps = {
  control: 'input-sum-lose-times';
  name: string;
  labelWithTranslate?: boolean;
  indexOfHour?: number;
} & Omit<NumberInputProps, 'name'> &
  CommonProps;

const InputSumLoseTimes: React.FC<IInputSumLoseTimesProps> = ({
  control,
  label,
  labelWithTranslate = true,
  precision = 2,
  hideControls = true,
  disabled = true,
  name,
  indexOfHour,
  ...rest
}) => {
  const { t } = useTranslation('allComponents');

  const data: IWorkTimePlanActivities[] = useWatch({
    name,
  });

  const valueMemo = React.useMemo(() => {
    if (Array.isArray(data) && indexOfHour !== undefined) {
      const newData = data.filter((val) => val.isLoseTime);

      const value = newData.reduce(
        (acc: number, curr: IWorkTimePlanActivities) => {
          const currentHour = curr.weeklyWorkTimes[indexOfHour].hour || 0;
          const currentValue = acc + currentHour;

          return currentValue;
        },
        0
      );

      return value;
    }
  }, [data, indexOfHour]);

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

export default InputSumLoseTimes;
