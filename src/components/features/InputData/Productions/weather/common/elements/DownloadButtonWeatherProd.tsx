import { zodResolver } from '@hookform/resolvers/zod';
import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { shallow } from 'zustand/shallow';

import { GlobalAlert, PrimaryDownloadDataButton } from '@/components/elements';
import {
  IDownloadDataButtonProps,
  IDownloadFields,
} from '@/components/elements/button/PrimaryDownloadDataButton';

import {
  IDownloadWeatherProductionValues,
  useDownloadTask,
} from '@/services/graphql/mutation/download/useDownloadTask';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import {
  globalDate,
  globalSelectMonthRhf,
  globalSelectPeriodRhf,
  globalSelectWeekRhf,
  globalSelectYearRhf,
} from '@/utils/constants/Field/global-field';
import { shiftSelect } from '@/utils/constants/Field/sample-house-field';
import { downloadWeatherProductionValidation } from '@/utils/form-validation/weather-production/weather-production-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { formatDate } from '@/utils/helper/dateFormat';
import dayjs from '@/utils/helper/dayjs.config';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';
import { useDownloadTaskStore } from '@/utils/store/useDownloadStore';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';

interface IDownloadButtonWeatherProdProps
  extends Omit<
    IDownloadDataButtonProps,
    'methods' | 'submitForm' | 'fields' | 'isDibaledDownload'
  > {
  defaultValuesState?: Partial<IDownloadWeatherProductionValues>;
}

export default function DownloadButtonWeatherProd({
  defaultValuesState,
  ...rest
}: IDownloadButtonWeatherProdProps) {
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  const [downloadPanel, setDownloadTaskStore] = useDownloadTaskStore(
    (state) => [state.downloadPanel, state.setDownloadTaskStore],
    shallow
  );
  const [filterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon],
    shallow
  );

  const defaultValues: IDownloadWeatherProductionValues = {
    period: 'DATE_RANGE',
    startDate: null,
    endDate: null,
    year: null,
    month: null,
    week: null,
    shiftId: null,
  };

  const methods = useForm<IDownloadWeatherProductionValues>({
    resolver: zodResolver(downloadWeatherProductionValidation),
    defaultValues: defaultValues,
    mode: 'onTouched',
  });

  const startDate = methods.watch('startDate');
  const period = methods.watch('period');
  const year = methods.watch('year');
  const month = methods.watch('month');
  const week = methods.watch('week');
  const isValid = methods.formState.isValid;

  const [executeCreate, { loading }] = useDownloadTask({
    onCompleted: ({ createDownloadTasks }) => {
      setDownloadTaskStore({
        downloadPanel: {
          downloadIds: [
            ...(downloadPanel.downloadIds ? downloadPanel.downloadIds : []),
            createDownloadTasks.id,
          ],
        },
      });
      sendGAEvent({
        event: 'Unduh',
        params: {
          category: 'Produksi',
          subCategory: `Produksi - Cuaca - Download Data`,
          subSubCategory: '',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Download berhasil',
        message: `Data cuaca sedang diproses`,
        icon: <IconCheck />,
      });
      setIsOpenModal((prev) => !prev);
      methods.reset();
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IDownloadWeatherProductionValues>(error);
        if (errorArry.length) {
          errorArry.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Download gagal',
          message: error.message,
          icon: <IconX />,
        });
      }
    },
  });

  React.useEffect(() => {
    const weekDataState: any = filterDataCommon
      .find((v) => v.key === 'weekRhf')
      ?.data.find((o) => o.id === week);

    if (weekDataState && weekDataState.endDate) {
      const dateCurrentWeek = dayjs(weekDataState?.endDate);
      const currentMonthByWeek = dateCurrentWeek.month() + 1;

      methods.setValue(
        'month',
        currentMonthByWeek ? `${currentMonthByWeek}` : null
      );
      methods.trigger(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week, filterDataCommon]);

  const fieldRhf = React.useMemo(() => {
    const values = objectToArrayValue(defaultValues);

    const maxEndDate = dayjs(startDate || undefined)
      .add(dayjs.duration({ days: 29 }))
      .toDate();
    const periodItem = globalSelectPeriodRhf({
      colSpan: 12,
      name: 'period',
      label: 'period',
      clearable: false,
      withErrorState: false,
      withAsterisk: true,
      onChange: (value) => {
        methods.setValue('period', value);
        values
          .filter((v) => v.name !== 'period')
          .forEach((o) => {
            methods.setValue(o.name, null);
          });
        methods.trigger(undefined);
      },
    });
    const startDateItem = globalDate({
      label: 'startDate2',
      name: 'startDate',
      clearable: true,
      withAsterisk: true,
      withErrorState: false,
      popoverProps: {
        withinPortal: true,
      },
      onChange: (value) => {
        methods.setValue('startDate', value || null);
        methods.setValue('endDate', null);
        methods.trigger(undefined);
      },
    });
    const endDateItem = globalDate({
      label: 'endDate2',
      name: 'endDate',
      clearable: true,
      disabled: !startDate,
      withAsterisk: true,
      withErrorState: false,
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
      withErrorState: false,
      onChange: (value) => {
        methods.setValue('year', value || null);
        methods.setValue('month', null);
        methods.setValue('week', null);
        methods.trigger(undefined);
      },
    });
    const monthItem = globalSelectMonthRhf({
      colSpan: 6,
      name: 'month',
      label: 'month',
      withAsterisk: true,
      withinPortal: true,
      withErrorState: false,
      disabled: !year,
      onChange: (value) => {
        methods.setValue('month', value || null);
        methods.setValue('week', null);
        methods.trigger(undefined);
      },
    });
    const weekItem = globalSelectWeekRhf({
      colSpan: period === 'WEEK' ? 12 : 6,
      name: 'week',
      label: 'week',
      stateKey: 'weekRhf',
      disabled: !year,
      withErrorState: false,
      year: year ? Number(year) : null,
      month: month ? Number(month) : null,
      withAsterisk: true,
      withinPortal: true,
    });
    const shiftItem = shiftSelect({
      colSpan: 12,
      name: 'shiftId',
      withAsterisk: false,
    });

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
        element: shiftItem,
      },
    ];

    return field;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, year, period, month]);

  const handleSubmitForm: SubmitHandler<
    IDownloadWeatherProductionValues
  > = async (data) => {
    const startDate = formatDate(data.startDate, 'YYYY-MM-DD');
    const endDate = formatDate(data.endDate, 'YYYY-MM-DD');

    await executeCreate({
      variables: {
        entity: 'CUACA',
        timeFilterType: data.period === 'DATE_RANGE' ? data.period : 'PERIOD',
        timeFilter: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          year: data.year ? Number(data.year) : undefined,
          month: data.month ? Number(data.month) : undefined,
          week: data.week ? Number(data.week) : undefined,
        },
        columnFilter: {
          shiftId: data.shiftId || undefined,
        },
      },
    });
  };

  const handleSetValue = () => {
    if (defaultValuesState) {
      const values = objectToArrayValue(defaultValuesState);
      values.forEach((v) => {
        methods.setValue(v.name, v.value || null);
      });
      methods.trigger(undefined, {
        shouldFocus: true,
      });
    }
  };

  return (
    <PrimaryDownloadDataButton
      methods={methods}
      submitForm={handleSubmitForm}
      fields={fieldRhf}
      isDibaledDownload={!isValid}
      handleSetDefaultValue={handleSetValue}
      isOpenModal={isOpenModal}
      setIsOpenModal={setIsOpenModal}
      isLoadingSubmit={loading}
      {...rest}
    />
  );
}
