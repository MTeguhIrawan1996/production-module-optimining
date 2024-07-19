import { rem, Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconPencil } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
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
} from '@/components/elements';
import { IFilterButtonProps } from '@/components/elements/button/FilterButton';
import DownloadButtonStockpileMonitoring from '@/components/features/InputData/QualityControlManagement/stockpile/common/elements/DownloadButtonStockpileMonitoring';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IMonitoringStockpilesTableData,
  IMonitoringStockpilesTableRequest,
  useReadAllStockpileMonitoringTable,
} from '@/services/graphql/query/stockpile-monitoring/useReadAllStockpileMonitoringTable';
import {
  globalDateNative,
  globalSelectLocationNative,
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

import { IElementsData } from '@/types/global';

const StockpileBook = () => {
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
      stockpileId,
      filterBadgeValue,
    },
    setStockpileMonitoringState,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
      state.stockpileMonitoringState,
      state.setStockpileMonitoringState,
    ],
    shallow
  );
  const [searchQuery] = useDebouncedValue<string>(search, 500);

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionUpdate = permissions?.includes(
    'update-monitoring-stockpile'
  );
  const isPermissionRead = permissions?.includes('read-monitoring-stockpile');

  const startDateString = formatDate(startDate || null, 'YYYY-MM-DD');
  const endDateString = formatDate(endDate || null, 'YYYY-MM-DD');

  const defaultRefetchStockpileMonitoring: Partial<IMonitoringStockpilesTableRequest> =
    {
      stockpileId: stockpileId || null,
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

  /* #   /**=========== Query =========== */
  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
    fetchPolicy: 'cache-and-network',
  });

  const {
    monitoringStockpilesTableData,
    monitoringStockpilesTableDataLoading,
    monitoringStockpilesTableDataMeta,
    refetchMonitoringStockpilesTable,
  } = useReadAllStockpileMonitoringTable({
    variables: {
      limit: 10,
      page: 1,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
  });

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(
      new Set<ISliceName>(['stockpileMonitoringSlice'] as ISliceName[])
    );
  }, []);

  React.useEffect(() => {
    if (hasHydrated) {
      refetchMonitoringStockpilesTable({
        page,
        ...defaultRefetchStockpileMonitoring,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  /* #endregion  /**======== Query =========== */

  const filter = React.useMemo(() => {
    const maxEndDate = dayjs(startDate || undefined)
      .add(dayjs.duration({ days: 29 }))
      .toDate();
    const periodItem = globalSelectPeriodNative({
      label: 'period',
      name: 'period',
      clearable: true,
      onChange: (value) => {
        setStockpileMonitoringState({
          period: value,
          startDate: null,
          endDate: null,
          year: null,
          month: null,
          stockpileId: null,
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
        setStockpileMonitoringState({
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
        setStockpileMonitoringState({
          endDate: value || null,
        });
      },
      value: endDate,
    });

    const yearItem = globalSelectYearNative({
      name: 'year',
      withAsterisk: true,
      onChange: (value) => {
        setStockpileMonitoringState({
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
        setStockpileMonitoringState({
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
        setStockpileMonitoringState({
          week: value ? Number(value) : null,
        });
      },
    });

    const stockpileNameItem = globalSelectLocationNative({
      label: 'stockpile',
      name: 'stockpileId',
      searchable: true,
      value: stockpileId,
      categoryIds: [`${process.env.NEXT_PUBLIC_STOCKPILE_ID}`],
      onChange: (value) => {
        setStockpileMonitoringState({ stockpileId: value });
      },
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
          selectItem: stockpileNameItem,
          col: 12,
        },
      ],
    };
    return item;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, period, endDate, year, month, week, stockpileId]);

  const handleSetPage = (page: number) => {
    setStockpileMonitoringState({ page });
    refetchMonitoringStockpilesTable({ page });
  };

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<IMonitoringStockpilesTableData> = {
        accessor: element.name,
        title: element.name,
        render: ({ ritageSamples }) => {
          const value = ritageSamples.additional.averageSamples?.find(
            (val) => val.element?.id === element.id
          );
          return value?.value ?? '-';
        },
      };
      return column;
    },
    []
  );

  const renderOtherColumn = elementsData?.map(renderOtherColumnCallback);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: monitoringStockpilesTableData,
          fetching: monitoringStockpilesTableDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                monitoringStockpilesTableData &&
                monitoringStockpilesTableData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'name',
              title: t('commonTypography.stockpileName'),
              render: ({ dome }) => dome?.stockpile.name ?? '-',
            },
            {
              accessor: 'domeName',
              title: t('commonTypography.domeName'),
              render: ({ dome }) => dome?.name ?? '-',
            },
            {
              accessor: 'materialType',
              title: t('commonTypography.materialType'),
              render: ({ material }) => material?.name ?? '-',
            },
            {
              accessor: 'tonByRitage',
              title: t('commonTypography.tonByRitage'),
            },
            {
              accessor: 'tonBySurveys',
              title: t('commonTypography.tonBySurvey'),
              render: ({ currentTonSurvey }) => currentTonSurvey ?? '-',
            },
            ...(renderOtherColumn ?? []),
            {
              accessor: 'domeStatus',
              title: t('commonTypography.domeStatus'),
              render: ({ domeStatus }) => domeStatus ?? '-',
            },
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
                    width={isDetermination ? 160 : 120}
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/quality-control-management/stockpile-monitoring/read/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionOther={
                      isDetermination
                        ? {
                            label: 'createSample',
                            icon: (
                              <IconPencil
                                style={{ width: rem(14), height: rem(14) }}
                              />
                            ),
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/quality-control-management/stockpile-monitoring/update/${id}`
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
                                `/input-data/quality-control-management/stockpile-monitoring/update/${id}`
                              );
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
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: monitoringStockpilesTableDataMeta?.totalAllData ?? 0,
          totalData: monitoringStockpilesTableDataMeta?.totalData ?? 0,
          totalPage: monitoringStockpilesTableDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    monitoringStockpilesTableData,
    monitoringStockpilesTableDataLoading,
    isPermissionRead,
    isPermissionUpdate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  const isDisabled = () => {
    const otherValue = [stockpileId];
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
      searchBar={{
        placeholder: t('stockpileMonitoring.searchPlaceholder'),
        onChange: (e) => {
          setStockpileMonitoringState({ search: e.currentTarget.value });
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setStockpileMonitoringState({ page: 1 });
          refetchMonitoringStockpilesTable({
            page: 1,
            search: searchQuery || null,
          });
        },
        value: search,
      }}
      otherButton={
        <DownloadButtonStockpileMonitoring
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
                  stockpileId: stockpileId || null,
                }
              : undefined
          }
        />
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            setStockpileMonitoringState({
              page: 1,
              period: null,
              startDate: null,
              endDate: null,
              year: null,
              month: null,
              week: null,
              stockpileId: null,
              filterBadgeValue: null,
            });
            refetchMonitoringStockpilesTable({
              page: 1,
              stockpileId: null,
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
            refetchMonitoringStockpilesTable({
              page: 1,
              ...defaultRefetchStockpileMonitoring,
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

            setStockpileMonitoringState({
              page: 1,
              filterBadgeValue:
                rangePeriod.length >= 1 ? rangePeriod : badgeFilterValue,
            });
          },
        },
      }}
    >
      {renderTable}
    </DashboardCard>
  );
};

export default StockpileBook;
