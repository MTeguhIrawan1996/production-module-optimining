import { zodResolver } from '@hookform/resolvers/zod';
import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ZodType, ZodTypeDef } from 'zod';
import { shallow } from 'zustand/shallow';

import { GlobalAlert, PrimaryDownloadDataButton } from '@/components/elements';
import {
  IDownloadDataButtonProps,
  IDownloadFields,
} from '@/components/elements/button/PrimaryDownloadDataButton';

import {
  IDownloadBargingProductionValues,
  IDownloadOreProductionValues,
  IDownloadRitageProductionValues,
  useDownloadTask,
} from '@/services/graphql/mutation/download/useDownloadTask';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import {
  globalDate,
  globalSelectMonthRhf,
  globalSelectPeriodRhf,
  globalSelectRitageStatusRhf,
  globalSelectWeekRhf,
  globalSelectYearRhf,
  heavyEquipmentSelect,
  locationSelect,
} from '@/utils/constants/Field/global-field';
import { shiftSelect } from '@/utils/constants/Field/sample-house-field';
import { sendGAEvent } from '@/utils/helper/analytics';
import { formatDate } from '@/utils/helper/dateFormat';
import dayjs from '@/utils/helper/dayjs.config';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { objectToArrayValue } from '@/utils/helper/objectToArrayValue';
import { useDownloadTaskStore } from '@/utils/store/useDownloadStore';

import { IRitageConditional, RitageType } from '@/types/ritageProduction';

interface IDownloadButtonRitageProps<T>
  extends Omit<
    IDownloadDataButtonProps,
    'methods' | 'submitForm' | 'fields' | 'isDibaledDownload'
  > {
  ritage: RitageType;
  defaultValuesState?: Partial<IDownloadRitageProductionValues>;
  reslover: ZodType<T, ZodTypeDef, T>;
}

export default function DownloadButtonRitage<T>({
  defaultValuesState,
  ritage,
  reslover,
  ...rest
}: IDownloadButtonRitageProps<T>) {
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  const [downloadPanel, setDownloadTaskStore] = useDownloadTaskStore(
    (state) => [state.downloadPanel, state.setDownloadTaskStore],
    shallow
  );

  const oreDefaultValues: IDownloadOreProductionValues = {
    fromPitId: null,
  };
  const bargingDefaultValues: IDownloadBargingProductionValues = {
    stockpileId: null,
    domeId: null,
  };

  const ritageConditional: IRitageConditional = {
    ore: {
      label: 'Ore',
      entity: 'RITAGE_ORE',
      defaultValues: oreDefaultValues,
    },
    ob: {
      label: 'Overburden',
      entity: 'RITAGE_OVERBURDEN',
      defaultValues: oreDefaultValues,
    },
    quarry: {
      label: 'Quarry',
      entity: 'RITAGE_QUARRY',
      defaultValues: oreDefaultValues,
    },
    barging: {
      label: 'Barging',
      entity: 'RITAGE_BARGING',
      defaultValues: bargingDefaultValues,
    },
    topsoil: {
      label: 'Topsoil',
      entity: 'RITAGE_TOPSOIL',
      defaultValues: undefined,
    },
    moving: {
      label: 'Moving',
      entity: 'RITAGE_MOVING',
      defaultValues: undefined,
    },
  };

  const defaultValues = {
    period: 'DATE_RANGE',
    startDate: null,
    endDate: null,
    year: null,
    month: null,
    week: null,
    shiftId: null,
    heavyEquipmentCode: null,
    ritageStatus: null,
    ...(ritageConditional[ritage].defaultValues
      ? ritageConditional[ritage].defaultValues
      : {}),
  };

  const methods = useForm<IDownloadRitageProductionValues>({
    resolver: zodResolver(reslover),
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
      sendGAEvent({
        event: 'Unduh',
        params: {
          category: 'Produksi',
          subCategory: `Produksi - Data Ritase - ${ritageConditional[ritage].label}`,
          subSubCategory: '',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Download berhasil',
        message: `Data ritase ${ritageConditional[ritage].label} sedang diproses`,
        icon: <IconCheck />,
      });
      setIsOpenModal((prev) => !prev);
      methods.reset();
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IDownloadRitageProductionValues>(error);
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
      withAsterisk: false,
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
    const fromPitItem = locationSelect({
      colSpan: 6,
      name: 'fromPitId',
      label: ritage === 'quarry' ? 'fromLocation' : 'pit',
      limit: null,
      withAsterisk: false,
      skipSearchQuery: true,
      categoryIds: [`${process.env.NEXT_PUBLIC_PIT_ID}`],
    });
    const stockPileItem = locationSelect({
      colSpan: 6,
      name: 'stockpileId',
      label: 'stockpile',
      limit: null,
      withAsterisk: false,
      skipSearchQuery: true,
      categoryIds: [`${process.env.NEXT_PUBLIC_STOCKPILE_ID}`],
    });
    const domeItem = locationSelect({
      colSpan: 12,
      name: 'domeId',
      label: 'dome',
      limit: null,
      withAsterisk: false,
      skipSearchQuery: true,
      categoryIds: [`${process.env.NEXT_PUBLIC_DOME_ID}`],
    });
    const shiftItem = shiftSelect({
      colSpan: 6,
      name: 'shiftId',
      withAsterisk: false,
    });
    const ritageProblematic = globalSelectRitageStatusRhf({
      label: 'ritageStatus',
      name: 'ritageStatus',
    });
    const heavyEquipmentCodeItem = heavyEquipmentSelect({
      colSpan: ritage === 'moving' || ritage === 'topsoil' ? 12 : 6,
      name: 'heavyEquipmentCode',
      label: 'heavyEquipmentCode',
      withAsterisk: false,
      limit: null,
      skipSearchQuery: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
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

    const showLocation = [
      {
        element: fromPitItem,
      },
    ];
    const showLocationBarging = [
      {
        element: stockPileItem,
      },
      {
        element: domeItem,
      },
    ];

    const itemLocation: RitageType[] = ['ob', 'ore', 'quarry'];
    const itemLocationBarging: RitageType[] = ['barging'];

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
      {
        element: ritageProblematic,
      },
      {
        element: heavyEquipmentCodeItem,
      },
      ...(itemLocation.includes(ritage) ? showLocation : []),
      ...(itemLocationBarging.includes(ritage) ? showLocationBarging : []),
    ];

    return field;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, year, period, month]);

  const handleSubmitForm: SubmitHandler<
    IDownloadRitageProductionValues
  > = async (data) => {
    const startDate = formatDate(data.startDate, 'YYYY-MM-DD');
    const endDate = formatDate(data.endDate, 'YYYY-MM-DD');
    const otherMaterialKeys: RitageType[] = ['ore', 'ob', 'quarry'];
    const bargingKeys: RitageType[] = ['barging'];
    const otherColumnFilter = {
      fromPitId: data.fromPitId || undefined,
    };
    const bargingColumnFilter = {
      stockpileId: data.stockpileId || undefined,
      domeId: data.domeId || undefined,
    };

    await executeCreate({
      variables: {
        entity: ritageConditional[ritage].entity,
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
          companyHeavyEquipmentId: data.heavyEquipmentCode || undefined,
          isRitageProblematic: data.ritageStatus
            ? data.ritageStatus === 'true'
              ? false
              : true
            : undefined,
          ...(otherMaterialKeys.includes(ritage) ? otherColumnFilter : {}),
          ...(bargingKeys.includes(ritage) ? bargingColumnFilter : {}),
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
