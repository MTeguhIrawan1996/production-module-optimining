import { rem } from '@mantine/core';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';
import { IconPencil } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import { useReadAllLocationselect } from '@/services/graphql/query/global-select/useReadAllLocationSelect';
import {
  IMonitoringStockpilesData,
  useReadAllStockpileMonitoring,
} from '@/services/graphql/query/stockpile-monitoring/useReadAllStockpileMonitoring';
import {
  globalSelectMonthNative,
  globalSelectNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { IElementsData, InputControllerNativeProps } from '@/types/global';

const StockpileBook = () => {
  const router = useRouter();
  const page = Number(router.query['page']) || 1;
  const url = `/input-data/quality-control-management/stockpile-monitoring?page=1`;
  const { t } = useTranslation('default');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [stockpileNameSerachTerm, setStockpileNameSerachTerm] =
    React.useState<string>('');
  const [stockpileNameSearchQuery] = useDebouncedValue<string>(
    stockpileNameSerachTerm,
    400
  );
  const [stockpileId, setStockpileId] = React.useState<string | null>(null);
  const [year, setYear] = React.useState<number | null>(null);
  const [month, setMonth] = React.useState<number | null>(null);
  const [week, setWeek] = React.useState<number | null>(null);

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

  const { allLocationsData } = useReadAllLocationselect({
    variables: {
      limit: 15,
      orderDir: 'desc',
      search: stockpileNameSearchQuery === '' ? null : stockpileNameSearchQuery,
      categoryIds: [`${process.env.NEXT_PUBLIC_STOCKPILE_ID}`],
    },
  });

  const {
    monitoringStockpilesData,
    monitoringStockpilesDataLoading,
    monitoringStockpilesDataMeta,
  } = useReadAllStockpileMonitoring({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      search: searchQuery === '' ? null : searchQuery,
      stockpileId,
      year,
      month,
      week,
    },
  });

  /* #endregion  /**======== Query =========== */

  const { uncombinedItem: locationItems } = useFilterItems({
    data: allLocationsData ?? [],
  });

  const filter = React.useMemo(() => {
    const stockpileNameItem = globalSelectNative({
      label: 'stockpileName',
      data: locationItems,
      searchable: true,
      placeholder: 'chooseStockpileName',
      onSearchChange: setStockpileNameSerachTerm,
      searchValue: stockpileNameSerachTerm,
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setStockpileId(value);
      },
    });
    const selectYearItem = globalSelectYearNative({
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setYear(value ? Number(value) : null);
        setMonth(null);
        setWeek(null);
      },
    });
    const selectMonthItem = globalSelectMonthNative({
      disabled: !year,
      value: month ? `${month}` : null,
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setMonth(value ? Number(value) : null);
      },
    });
    const selectWeekItem = globalSelectWeekNative({
      disabled: !year,
      value: week ? `${week}` : null,
      year: year,
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setWeek(value ? Number(value) : null);
      },
    });

    const item: InputControllerNativeProps[] = [
      stockpileNameItem,
      selectYearItem,
      selectMonthItem,
      selectWeekItem,
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationItems, year, month, week]);

  const handleSetPage = (page: number) => {
    const urlSet = `/input-data/quality-control-management/stockpile-monitoring?page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<IMonitoringStockpilesData> = {
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
          records: monitoringStockpilesData,
          fetching: monitoringStockpilesDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                monitoringStockpilesData &&
                monitoringStockpilesData.indexOf(record) + 1,
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
          totalAllData: monitoringStockpilesDataMeta?.totalAllData ?? 0,
          totalData: monitoringStockpilesDataMeta?.totalData ?? 0,
          totalPage: monitoringStockpilesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    monitoringStockpilesData,
    monitoringStockpilesDataLoading,
    isPermissionRead,
    isPermissionUpdate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      searchBar={{
        placeholder: t('stockpileMonitoring.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
        },
      }}
      filterDateWithSelect={{
        items: filter,
        colSpan: 4,
      }}
    >
      {renderTable}
    </DashboardCard>
  );
};

export default StockpileBook;
