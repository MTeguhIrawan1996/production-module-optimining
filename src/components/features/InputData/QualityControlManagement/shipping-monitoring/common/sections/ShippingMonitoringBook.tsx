import { Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  DashboardCard,
  GlobalAlert,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';
import { IFilterButtonProps } from '@/components/elements/button/FilterButton';
import DownloadButtonShippingMonitoring from '@/components/features/InputData/QualityControlManagement/shipping-monitoring/common/elements/DownloadButtonShippingMonitoring';

import { useDeleteShippingMonitoring } from '@/services/graphql/mutation/shipping-monitoring/useDeleteShippingMonitoring';
import {
  IReadAllShippingMonitoringRequest,
  useReadAllShippingMonitoring,
} from '@/services/graphql/query/shipping-monitoring/useReadAllShippingMonitoring';
import {
  globalDateNative,
  globalSelectArriveBargeNative,
  globalSelectHeavyEquipmentNative,
  globalSelectMonthNative,
  globalSelectPeriodNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import { formatDate } from '@/utils/helper/dateFormat';
import dayjs from '@/utils/helper/dayjs.config';
import { newNormalizedFilterBadge } from '@/utils/helper/normalizedFilterBadge';
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ShippingMonitoringBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [filterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );
  const [
    hasHydrated,
    {
      page,
      search,
      period,
      startDate,
      endDate,
      week,
      year,
      month,
      bargeHeavyEquipmentId,
      factoryCategoryId,
      filterBadgeValue,
    },
    setBargingMonitoringState,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
      state.bargingMonitoringState,
      state.setBargingMonitoringState,
    ],
    shallow
  );
  const [id, setId] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(search, 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-monitoring-barging');
  const isPermissionUpdate = permissions?.includes('update-monitoring-barging');
  const isPermissionDelete = permissions?.includes('delete-monitoring-barging');
  const isPermissionRead = permissions?.includes('read-monitoring-barging');

  /* #   /**=========== Query =========== */
  const startDateString = formatDate(startDate || null, 'YYYY-MM-DD');
  const endDateString = formatDate(endDate || null, 'YYYY-MM-DD');

  const defaultRefetchShippingMonitoring: Partial<IReadAllShippingMonitoringRequest> =
    {
      bargeHeavyEquipmentId: bargeHeavyEquipmentId || null,
      factoryCategoryId: factoryCategoryId || null,
      timeFilterType: period
        ? period === 'DATE_RANGE'
          ? period
          : 'PERIOD'
        : undefined,
      timeFilter: {
        startDate: startDateString || undefined,
        endDate: endDateString || undefined,
        year: year ? Number(year) : undefined,
        week: week ? Number(week) : undefined,
        month: month ? Number(month) : undefined,
      },
    };

  const {
    monitoringBargingData,
    monitoringBargingOtherColumn,
    monitoringBargingDataLoading,
    monitoringBargingDataMeta,
    refetchMonitoringBargingData,
  } = useReadAllShippingMonitoring({
    variables: {
      limit: 10,
      page: 1,
      orderDir: 'desc',
    },
  });

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(
      new Set<ISliceName>(['bargingMonitoringSlice'] as ISliceName[])
    );
  }, []);

  React.useEffect(() => {
    if (hasHydrated) {
      refetchMonitoringBargingData({
        page,
        ...defaultRefetchShippingMonitoring,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const [executeDelete, { loading }] = useDeleteShippingMonitoring({
    onCompleted: () => {
      setIsOpenDeleteConfirmation((prev) => !prev);
      setBargingMonitoringState({ page: 1 });
      refetchMonitoringBargingData({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('shippingMonitoring.successDeleteMessage'),
        icon: <IconCheck />,
      });
    },
    onError: ({ message }) => {
      notifications.show({
        color: 'red',
        title: 'Gagal',
        message: message,
        icon: <IconX />,
      });
    },
  });
  /* #endregion  /**======== Query =========== */

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
      },
    });
  };

  const handleSetPage = (page: number) => {
    setBargingMonitoringState({ page });
    refetchMonitoringBargingData({ page });
  };

  const filter = React.useMemo(() => {
    const maxEndDate = dayjs(startDate || undefined)
      .add(dayjs.duration({ days: 29 }))
      .toDate();
    const periodItem = globalSelectPeriodNative({
      label: 'period',
      name: 'period',
      clearable: true,
      onChange: (value) => {
        setBargingMonitoringState({
          period: value,
          startDate: null,
          endDate: null,
          year: null,
          month: null,
          bargeHeavyEquipmentId: null,
          factoryCategoryId: null,
        });
      },
      value: period,
    });
    const startDateItem = globalDateNative({
      label: 'startDate2',
      name: 'startDate',
      placeholder: 'chooseDate',
      clearable: true,
      withAsterisk: true,
      onChange: (value) => {
        setBargingMonitoringState({
          startDate: value || null,
          endDate: null,
        });
      },
      value: startDate,
    });
    const endDateItem = globalDateNative({
      label: 'endDate2',
      name: 'endDate',
      placeholder: 'chooseDate',
      clearable: true,
      disabled: !startDate,
      withAsterisk: true,
      maxDate: maxEndDate,
      minDate: startDate || undefined,
      onChange: (value) => {
        setBargingMonitoringState({
          endDate: value || null,
        });
      },
      value: endDate,
    });
    const yearItem = globalSelectYearNative({
      name: 'year',
      withAsterisk: true,
      onChange: (value) => {
        setBargingMonitoringState({
          year: value ? Number(value) : null,
          month: null,
          week: null,
        });
      },
      value: year ? `${year}` : null,
    });
    const monthItem = globalSelectMonthNative({
      placeholder: 'month',
      label: 'month',
      name: 'month',
      withAsterisk: true,
      disabled: !year,
      value: month ? `${month}` : null,
      onChange: (value) => {
        setBargingMonitoringState({
          month: value ? Number(value) : null,
          week: null,
        });
      },
    });
    const weekItem = globalSelectWeekNative({
      placeholder: 'week',
      label: 'week',
      name: 'week',
      searchable: false,
      withAsterisk: true,
      year: year,
      month: month,
      disabled: !year,
      value: week ? `${week}` : null,
      onChange: (value) => {
        setBargingMonitoringState({
          week: value ? Number(value) : null,
        });
      },
    });
    const bargeCodeItem = globalSelectHeavyEquipmentNative({
      name: 'bargeHeavyEquipmentId',
      categoryId: `${process.env.NEXT_PUBLIC_BARGE_ID}`,
      onChange: (value) => {
        setBargingMonitoringState({
          bargeHeavyEquipmentId: value,
        });
      },
      value: bargeHeavyEquipmentId,
    });
    const arriveItem = globalSelectArriveBargeNative({
      name: 'factoryCategoryId',
      onChange: (value) => {
        setBargingMonitoringState({
          factoryCategoryId: value,
        });
      },
      value: factoryCategoryId,
    });

    const periodDateRange = [
      {
        selectItem: startDateItem,
        col: 6,
      },
      {
        selectItem: endDateItem,
        col: 6,
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

    const periodYear = [
      {
        selectItem: yearItem,
        col: period === 'YEAR' ? 12 : 6,
        prefix: 'Tahun:',
      },
    ];

    const periodMoth = [
      ...periodYear,
      {
        selectItem: monthItem,
        col: 6,
      },
    ];

    const periodWeek = [
      ...periodMoth,
      {
        selectItem: weekItem,
        col: 12,
      },
    ];

    const item: IFilterButtonProps = {
      filterDateWithSelect: [
        {
          selectItem: periodItem,
          col: 12,
          prefix: 'Periode:',
        },
        ...(period === 'DATE_RANGE' ? periodDateRange : []),
        ...(period === 'YEAR' ? periodYear : []),
        ...(period === 'MONTH' ? periodMoth : []),
        ...(period === 'WEEK' ? periodWeek : []),
        {
          selectItem: arriveItem,
          col: 6,
        },
        {
          selectItem: bargeCodeItem,
          col: 6,
        },
      ],
    };
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, week, factoryCategoryId, bargeHeavyEquipmentId]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: monitoringBargingData,
          fetching: monitoringBargingDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                monitoringBargingData &&
                monitoringBargingData.indexOf(record) + 1,
              width: 60,
            },
            ...(monitoringBargingOtherColumn ?? []),
            {
              accessor: 'status',
              title: t('commonTypography.status'),
              render: ({ status }) => {
                return (
                  <GlobalBadgeStatus
                    color={status?.color}
                    label={status?.name ?? ''}
                  />
                );
              },
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ id, status }) => {
                const isDetermination =
                  status?.id === `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`;
                return (
                  <GlobalKebabButton
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/quality-control-management/shipping-monitoring/read/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionUpdate={
                      isPermissionUpdate && !isDetermination
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/quality-control-management/shipping-monitoring/update/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionDelete={
                      isPermissionDelete && !isDetermination
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              setIsOpenDeleteConfirmation((prev) => !prev);
                              setId(id);
                            },
                          }
                        : undefined
                    }
                  />
                );
              },
            },
          ],
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: isPermissionCreate
            ? {
                label: t('shippingMonitoring.createShippingMonitoring'),
                onClick: () =>
                  router.push(
                    '/input-data/quality-control-management/shipping-monitoring/create'
                  ),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: monitoringBargingDataMeta?.totalAllData ?? 0,
          totalData: monitoringBargingDataMeta?.totalData ?? 0,
          totalPage: monitoringBargingDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    monitoringBargingData,
    monitoringBargingDataLoading,
    isPermissionDelete,
    isPermissionRead,
    isPermissionUpdate,
    isPermissionCreate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  const isDisabled = () => {
    const otherValue = [bargeHeavyEquipmentId, factoryCategoryId];
    if (period === 'DATE_RANGE') {
      return !endDate;
    }
    if (period === 'YEAR') {
      return !year;
    }
    if (period === 'MONTH') {
      return !month;
    }
    if (period === 'WEEK') {
      return !week;
    }

    return !otherValue.some((v) => typeof v === 'string');
  };

  const isApply = filterBadgeValue && filterBadgeValue?.length >= 1;

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              label: t('shippingMonitoring.createShippingMonitoring'),
              onClick: () =>
                router.push(
                  '/input-data/quality-control-management/shipping-monitoring/create'
                ),
            }
          : undefined
      }
      otherButton={
        <DownloadButtonShippingMonitoring
          label="Download"
          period={isApply ? period || undefined : undefined}
          defaultValuesState={
            isApply /* Check isAplly by filter badge length */
              ? {
                  period: period || 'DATE_RANGE',
                  startDate: startDate || null,
                  endDate: endDate || null,
                  year: year ? `${year}` : null,
                  month: month ? `${month}` : null,
                  week: week ? `${week}` : null,
                  bargeHeavyEquipmentId: bargeHeavyEquipmentId || null,
                  factoryCategoryId: factoryCategoryId || null,
                }
              : undefined
          }
        />
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            setBargingMonitoringState({
              page: 1,
              period: null,
              startDate: null,
              endDate: null,
              year: null,
              month: null,
              week: null,
              factoryCategoryId: null,
              bargeHeavyEquipmentId: null,
              filterBadgeValue: null,
            });
            refetchMonitoringBargingData({
              page: 1,
              factoryCategoryId: null,
              bargeHeavyEquipmentId: null,
              timeFilter: undefined,
              timeFilterType: undefined,
            });
          },
        },
        value: filterBadgeValue,
      }}
      filter={{
        filterDateWithSelect: filter.filterDateWithSelect,
        filterButton: {
          disabled: isDisabled(),
          onClick: () => {
            refetchMonitoringBargingData({
              page: 1,
              ...defaultRefetchShippingMonitoring,
            });
            const badgeFilterValue = newNormalizedFilterBadge({
              filter: filter.filterDateWithSelect || [],
              data: filterDataCommon || [],
            });
            const newStartDate = formatDate(startDate);
            const newEndDate = formatDate(endDate);
            const dateBadgeValue = [`${newStartDate} - ${newEndDate}`];

            const rangePeriod =
              period === 'DATE_RANGE'
                ? [
                    ...badgeFilterValue.slice(0, 1),
                    ...dateBadgeValue,
                    ...badgeFilterValue.slice(1),
                  ]
                : [];

            setBargingMonitoringState({
              page: 1,
              filterBadgeValue:
                rangePeriod.length >= 1 ? rangePeriod : badgeFilterValue,
            });
          },
        },
      }}
      searchBar={{
        placeholder: t('shippingMonitoring.searchPlaceholder'),
        onChange: (e) => {
          setBargingMonitoringState({ search: e.currentTarget.value });
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setBargingMonitoringState({ page: 1 });
          refetchMonitoringBargingData({
            page: 1,
          });
        },
        value: search,
      }}
    >
      {renderTable}
      <ModalConfirmation
        isOpenModalConfirmation={isOpenDeleteConfirmation}
        actionModalConfirmation={() =>
          setIsOpenDeleteConfirmation((prev) => !prev)
        }
        actionButton={{
          label: t('commonTypography.yesDelete'),
          color: 'red',
          onClick: handleDelete,
          loading: loading,
        }}
        backButton={{
          label: 'Batal',
        }}
        modalType={{
          type: 'default',
          title: t('commonTypography.alertTitleConfirmDelete'),
          description: t('commonTypography.alertDescConfirmDelete'),
        }}
        withDivider
      />
    </DashboardCard>
  );
};

export default ShippingMonitoringBook;
