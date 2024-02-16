import {
  NumberInput as MantineNumberInput,
  NumberInputProps,
} from '@mantine/core';
import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  IWorkTimeDay,
  IWorkTimePlanActivities,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyWorkTimePlan';

type IValueInput = {
  loseTime: number | '';
  amountEffectiveWorkingHours: number | '';
};

export type IDisplayLoseTimeAndEffectiveWorkProps = {
  name: string;
  labelWithTranslate?: boolean;
  indexOfHour?: number;
  calculationType?: 'amountEffectiveWorkingHours' | 'loseTime';
} & Omit<NumberInputProps, 'name'>;

const DisplayLoseTimeAndEffectiveWork: React.FC<
  IDisplayLoseTimeAndEffectiveWorkProps
> = ({
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
  const totalLoseTimeWeekWatch: number | '' = useWatch({
    name: 'totalLoseTimeWeek',
  });
  const { setValue } = useFormContext();
  const nationalHoliday = data.find(
    (val) => val.activityId === `${process.env.NEXT_PUBLIC_NATIONAL_HOLIDAY_ID}`
  );
  const workTime = data.find(
    (val) => val.activityId === `${process.env.NEXT_PUBLIC_WORKING_TIME_ID}`
  );
  const newData = data.filter((val) => val.isLoseTime);
  const newFlatData = newData.flatMap((val) => val.weeklyWorkTimes);

  const totalAllLoseTime = React.useMemo(() => {
    if (Array.isArray(data) && indexOfHour !== undefined) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newData, indexOfHour]);

  const amountEffectiveWorkingHours = React.useMemo(() => {
    const totalNationalHoliday =
      nationalHoliday?.weeklyWorkTimes[indexOfHour || 0].hour || 0;
    const totalWorkTime = workTime?.weeklyWorkTimes[indexOfHour || 0].hour || 0;

    const loseTime = totalNationalHoliday + totalAllLoseTime;
    return totalWorkTime - loseTime;
  }, [nationalHoliday, workTime, indexOfHour, totalAllLoseTime]);

  React.useEffect(() => {
    const totalLoseTimeWeek = newFlatData.reduce(
      (acc: number, curr: IWorkTimeDay) => {
        if (typeof curr.hour === 'number') {
          acc += curr.hour;
        }
        return acc;
      },
      0
    );
    setValue('totalLoseTimeWeek', totalLoseTimeWeek || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFlatData]);

  React.useEffect(() => {
    const totalNationalHolidayWeek = nationalHoliday?.weeklyWorkTimes.reduce(
      (acc: number, curr) => {
        if (typeof curr.hour === 'number') {
          const objValue = curr.hour || 0;
          acc += objValue;
        }

        return acc;
      },
      0
    );
    const totalWorkTimeWeek = workTime?.weeklyWorkTimes.reduce(
      (acc: number, curr) => {
        if (typeof curr.hour === 'number') {
          const objValue = curr.hour || 0;
          acc += objValue;
        }

        return acc;
      },
      0
    );

    if (totalLoseTimeWeekWatch) {
      const losetimeWeek =
        totalLoseTimeWeekWatch + (totalNationalHolidayWeek || 0);
      const totalEffectiveWorkHourWeek =
        (totalWorkTimeWeek || 0) - losetimeWeek;
      setValue('totalEffectiveWorkHourWeek', totalEffectiveWorkHourWeek);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nationalHoliday, workTime, totalLoseTimeWeekWatch]);

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

export default DisplayLoseTimeAndEffectiveWork;
