import { zodResolver } from '@hookform/resolvers/zod';
import { Text } from '@mantine/core';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  DownloadPanel,
  GlobalAlert,
  PrimaryDownloadDataButton,
} from '@/components/elements';
import {
  IDownloadDataButtonProps,
  IDownloadFields,
} from '@/components/elements/button/PrimaryDownloadDataButton';

import { IDownloadFrontProductionValues } from '@/services/graphql/mutation/front-production/useDownloadFrontProduction';
import {
  globalDate,
  globalSelectMonthRhf,
  globalSelectPeriodRhf,
  globalSelectWeekRhf,
  globalSelectYearRhf,
  locationSelect,
  materialSelect,
} from '@/utils/constants/Field/global-field';
import { shiftSelect } from '@/utils/constants/Field/sample-house-field';
import { downloadFrontProductionValidation } from '@/utils/form-validation/front-production/front-production-validation';
import dayjs from '@/utils/helper/dayjs.config';

interface IDownloadButtonFrontProps
  extends Omit<
    IDownloadDataButtonProps,
    'methods' | 'submitForm' | 'fields' | 'isDibaledDownload'
  > {
  params: string;
}

const DownloadButtonFront: React.FC<IDownloadButtonFrontProps> = ({
  params,
  ...rest
}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const methods = useForm<IDownloadFrontProductionValues>({
    resolver: zodResolver(downloadFrontProductionValidation),
    defaultValues: {
      period: 'DATE_RANGE',
      startDate: null,
      endDate: null,
      year: null,
      month: null,
      shiftId: null,
      week: null,
      locationId: null,
      materialId: null,
    },
    mode: 'onBlur',
  });

  const startDate = methods.watch('startDate');
  const period = methods.watch('period');
  const year = methods.watch('year');
  const month = methods.watch('month');
  const isValid = methods.formState.isValid;

  const fieldRhf = React.useMemo(() => {
    const maxEndDate = dayjs(startDate || undefined)
      .add(dayjs.duration({ days: 29 }))
      .toDate();
    const periodItem = globalSelectPeriodRhf({
      colSpan: 12,
      name: 'period',
      label: 'period',
      clearable: false,
    });
    const startDateItem = globalDate({
      label: 'startDate2',
      name: 'startDate',
      clearable: true,
      withAsterisk: true,
      popoverProps: {
        withinPortal: true,
      },
    });
    const endDateItem = globalDate({
      label: 'endDate2',
      name: 'endDate',
      clearable: true,
      disabled: !startDate,
      withAsterisk: true,
      maxDate: maxEndDate,
      minDate: startDate || undefined,
      popoverProps: {
        withinPortal: true,
      },
    });
    const yearItem = globalSelectYearRhf({
      colSpan: 6,
      name: 'year',
      label: 'year',
      withAsterisk: true,
      withinPortal: true,
    });
    const monthItem = globalSelectMonthRhf({
      colSpan: 6,
      name: 'month',
      label: 'month',
      withAsterisk: true,
      withinPortal: true,
      disabled: !year,
    });
    const weekItem = globalSelectWeekRhf({
      colSpan: period === 'WEEK' ? 12 : 6,
      name: 'week',
      label: 'week',
      disabled: !year,
      year: year ? Number(year) : null,
      month: month ? Number(month) : null,
      withAsterisk: true,
      withinPortal: true,
    });
    const locationItem = locationSelect({
      colSpan: 6,
      name: 'locationId',
      label: params,
      limit: null,
      withAsterisk: false,
      categoryIds:
        params === 'pit'
          ? [`${process.env.NEXT_PUBLIC_PIT_ID}`]
          : [`${process.env.NEXT_PUBLIC_DOME_ID}`],
    });
    const shiftItem = shiftSelect({
      colSpan: 6,
      name: 'shiftId',
      withAsterisk: false,
    });
    const materialItem = materialSelect({
      colSpan: 12,
      name: 'materialId',
      label: 'material',
      withAsterisk: false,
    });

    const showMaterial = [
      {
        element: materialItem,
      },
    ];

    const showRangeDate = [
      {
        element: startDateItem,
      },
      {
        element: endDateItem,
        otherElement: () => (
          <GlobalAlert
            description={
              <Text fw={500} color="orange.4">
                Maksimal Rentang Waktu Dalam 30 Hari
              </Text>
            }
            color="orange.5"
            mt="xs"
            py={4}
          />
        ),
      },
    ];

    const showMonth = [
      {
        element: yearItem,
      },
      {
        element: monthItem,
      },
    ];
    const showWeek = [
      ...showMonth,
      {
        element: weekItem,
      },
    ];

    const field: IDownloadFields[] = [
      {
        element: periodItem,
      },
      ...(period === 'DATE_RANGE' ? showRangeDate : []),
      ...(period === 'MONTH' ? showMonth : []),
      ...(period === 'WEEK' ? showWeek : []),
      {
        element: locationItem,
      },
      {
        element: shiftItem,
      },
      ...(params === 'pit' ? showMaterial : []),
    ];

    return field;
  }, [startDate, year, month, params, period]);

  const handleSubmitForm: SubmitHandler<
    IDownloadFrontProductionValues
    // eslint-disable-next-line unused-imports/no-unused-vars
  > = async (data) => {
    setOpen((prev) => !prev);
    // await executeUpdate({
    //   variables: {
    //     weeklyPlanId: id,
    //     domeId: data.domeId,
    //   },
    // });
  };

  return (
    <>
      <PrimaryDownloadDataButton
        methods={methods}
        submitForm={handleSubmitForm}
        fields={fieldRhf}
        isDibaledDownload={!isValid}
        {...rest}
      />
      <DownloadPanel open={open} setOpen={() => setOpen((prev) => !prev)} />
    </>
  );
};

export default DownloadButtonFront;
