import {
  NumberInput as MantineNumberInput,
  NumberInputProps,
} from '@mantine/core';
import * as React from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { IWorkTimePlanActivities } from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyWorkTimePlan';

import { CommonProps } from '@/types/global';

type IValueInput = {
  loseTime: number | '';
  amountEffectiveWorkingHours: number | '';
};

export type IInputSumLoseTimesProps = {
  control: 'input-sum-lose-times';
  name: string;
  labelWithTranslate?: boolean;
  indexOfHour?: number;
  calculationType?: 'amountEffectiveWorkingHours' | 'loseTime';
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
  calculationType = 'loseTime',
  ...rest
}) => {
  const { t } = useTranslation('allComponents');

  const data: IWorkTimePlanActivities[] = useWatch({
    name,
  });

  const totalAllLoseTime = React.useMemo(() => {
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
    return 0;
  }, [data, indexOfHour]);

  const amountEffectiveWorkingHours = React.useMemo(() => {
    const nationalHoliday = data.find(
      (val) =>
        val.activityId === `${process.env.NEXT_PUBLIC_NATIONAL_HOLIDAY_ID}`
    );
    const workTime = data.find(
      (val) => val.activityId === `${process.env.NEXT_PUBLIC_WORKING_TIME_ID}`
    );
    const totalNationalHoliday =
      nationalHoliday?.weeklyWorkTimes[indexOfHour || 0].hour || 0;
    const totalWorkTime = workTime?.weeklyWorkTimes[indexOfHour || 0].hour || 0;
    const loseTime = totalNationalHoliday + totalAllLoseTime;
    return totalWorkTime - loseTime;
  }, [data, indexOfHour, totalAllLoseTime]);

  const value: IValueInput = {
    loseTime: totalAllLoseTime || '',
    amountEffectiveWorkingHours: amountEffectiveWorkingHours || '',
  };

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
      value={value[calculationType]}
      {...rest}
    />
  );
};

export default InputSumLoseTimes;
