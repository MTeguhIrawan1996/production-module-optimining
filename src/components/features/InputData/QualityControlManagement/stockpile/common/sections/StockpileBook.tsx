import { rem } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconPencil } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';
import { IFilterButtonProps } from '@/components/elements/button/FilterButton';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IMonitoringStockpilesTableData,
  useReadAllStockpileMonitoringTable,
} from '@/services/graphql/query/stockpile-monitoring/useReadAllStockpileMonitoringTable';
import {
  globalSelectLocationNative,
  globalSelectMonthNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
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
    { page, search, week, year, month, stockpileId, filterBadgeValue },
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
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
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
        stockpileId,
        year,
        month,
        week,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  /* #endregion  /**======== Query =========== */

  const filter = React.useMemo(() => {
    const stockpileNameItem = globalSelectLocationNative({
      label: 'stockpileName',
      name: 'stockpileName',
      searchable: true,
      value: stockpileId,
      categoryIds: [`${process.env.NEXT_PUBLIC_STOCKPILE_ID}`],
      onChange: (value) => {
        setStockpileMonitoringState({ stockpileId: value });
      },
    });
    const selectYearItem = globalSelectYearNative({
      name: 'year',
      onChange: (value) => {
        setStockpileMonitoringState({
          year: value ? Number(value) : null,
          month: null,
          week: null,
        });
      },
      value: year ? `${year}` : null,
    });
    const selectMonthItem = globalSelectMonthNative({
      name: 'month',
      disabled: !year,
      value: month ? `${month}` : null,
      onChange: (value) => {
        setStockpileMonitoringState({
          month: value ? Number(value) : null,
          week: null,
        });
      },
    });
    const selectWeekItem = globalSelectWeekNative({
      name: 'week',
      disabled: !year,
      value: week ? `${week}` : null,
      year: year,
      onChange: (value) => {
        setStockpileMonitoringState({
          week: value ? Number(value) : null,
        });
      },
    });

    const item: IFilterButtonProps = {
      filterDateWithSelect: [
        {
          selectItem: stockpileNameItem,
          col: 6,
        },
        {
          selectItem: selectYearItem,
          col: 6,
          prefix: 'Tahun:',
        },
        {
          selectItem: selectMonthItem,
          col: 6,
        },
        {
          selectItem: selectWeekItem,
          col: 6,
        },
      ],
    };
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockpileId, year, month, week]);

  const handleSetPage = (page: number) => {
    setStockpileMonitoringState({ page });
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
          });
        },
        value: search,
      }}
      filterBadge={{
        resetButton: {
          onClick: () => {
            setStockpileMonitoringState({
              page: 1,
              filterBadgeValue: null,
              year: null,
              week: null,
              month: null,
              stockpileId: null,
            });
            refetchMonitoringStockpilesTable({
              page: 1,
              year: null,
              week: null,
              month: null,
              stockpileId: null,
            });
          },
        },
        value: filterBadgeValue,
      }}
      filter={{
        filterDateWithSelect: filter.filterDateWithSelect,
        filterButton: {
          disabled: stockpileId || month || week || year ? false : true,
          onClick: () => {
            refetchMonitoringStockpilesTable({
              page: 1,
              year,
              week,
              month,
              stockpileId,
            });
            const badgeFilterValue = newNormalizedFilterBadge({
              filter: filter.filterDateWithSelect || [],
              data: filterDataCommon,
            });
            setStockpileMonitoringState({
              page: 1,
              filterBadgeValue: badgeFilterValue || null,
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
