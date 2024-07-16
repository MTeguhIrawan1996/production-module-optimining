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
  IDownloadFrontProductionValues,
  useDownloadTask,
} from '@/services/graphql/mutation/download/useDownloadTask';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
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
import { sendGAEvent } from '@/utils/helper/analytics';
import { formatDate } from '@/utils/helper/dateFormat';
import dayjs from '@/utils/helper/dayjs.config';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';
import { useDownloadTaskStore } from '@/utils/store/useDownloadStore';

interface IDownloadButtonFrontProps
  extends Omit<
    IDownloadDataButtonProps,
    'methods' | 'submitForm' | 'fields' | 'isDibaledDownload'
  > {
  params: string;
  defaultValuesState: Partial<IDownloadFrontProductionValues>;
}

const DownloadButtonFront: React.FC<IDownloadButtonFrontProps> = ({
  params,
  defaultValuesState,
  ...rest
}) => {
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  const [downloadPanel, setDownloadTaskStore] = useDownloadTaskStore(
    (state) => [state.downloadPanel, state.setDownloadTaskStore],
    shallow
  );

  const defaultValues = {
    period: 'DATE_RANGE',
    startDate: null,
    endDate: null,
    year: null,
    month: null,
    week: null,
    shiftId: null,
    locationId: null,
    materialId: null,
  };

  const methods = useForm<IDownloadFrontProductionValues>({
    resolver: zodResolver(downloadFrontProductionValidation),
    defaultValues: defaultValues,
    mode: 'onTouched',
  });

  const startDate = methods.watch('startDate');
  const period = methods.watch('period');
  const year = methods.watch('year');
  const month = methods.watch('month');
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
      const segmentObj = {
        pit: 'PIT',
        dome: 'DOME',
      };
      sendGAEvent({
        event: 'Unduh',
        params: {
          category: 'Produksi',
          subCategory: 'Produksi - Front',
          subSubCategory: `Produksi - Front - ${segmentObj[params]}`,
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Proses Download berhasil',
        message: `Data front ${segmentObj[params]} sedang diproses`,
        icon: <IconCheck />,
      });
      setIsOpenModal((prev) => !prev);
      methods.reset();
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IDownloadFrontProductionValues>(error);
        if (errorArry.length) {
          errorArry.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Proses Donwload gagal',
          message: error.message,
          icon: <IconX />,
        });
      }
    },
  });

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
      disabled: !year,
      withErrorState: false,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, year, period, month, params]);

  const handleSubmitForm: SubmitHandler<
    IDownloadFrontProductionValues
  > = async (data) => {
    const startDate = formatDate(data.startDate, 'YYYY-MM-DD');
    const endDate = formatDate(data.endDate, 'YYYY-DD-MM');

    const segmentObj = {
      pit: 'PIT',
      dome: 'DOME',
    };
    await executeCreate({
      variables: {
        entity: `FRONT_${segmentObj[params]}`,
        timeFilterType: data.period === 'DATE_RANGE' ? data.period : 'PERIOD',
        timeFilter: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          year: data.year ? Number(data.year) : undefined,
          month: data.month ? Number(data.month) : undefined,
          week: data.week ? Number(data.week) : undefined,
        },
        columnFilter: {
          materialId: data.materialId || undefined,
          shiftId: data.shiftId || undefined,
          pitId: data.locationId || undefined,
        },
      },
    });
  };

  const handleSetValue = () => {
    const values = objectToArrayValue(defaultValuesState);
    values.forEach((v) => {
      methods.setValue(v.name, v.value || null);
    });
    methods.trigger(undefined, {
      shouldFocus: true,
    });
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
};

export default DownloadButtonFront;
