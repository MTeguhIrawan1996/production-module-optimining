import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/id';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteStockpileMonitoring } from '@/services/graphql/mutation/stockpile-monitoring/useDeleteOreRitage';
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

import { IElementsData, InputControllerNativeProps } from '@/types/global';

const StockpileBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const url = `/input-data/quality-control-management/stockpile-monitoring?page=1`;
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
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
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Query =========== */
  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
  });

  const { allLocationsData } = useReadAllLocationselect({
    variables: {
      limit: 15,
      orderDir: 'desc',
      search: stockpileNameSearchQuery === '' ? null : stockpileNameSearchQuery,
      categoryId: `${process.env.NEXT_PUBLIC_STOCKPILE_ID}`,
    },
  });

  const {
    monitoringStockpilesData,
    monitoringStockpilesDataLoading,
    monitoringStockpilesDataMeta,
    refetchMonitoringStockpiles,
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

  const [executeDelete, { loading }] = useDeleteStockpileMonitoring({
    onCompleted: () => {
      refetchMonitoringStockpiles();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push(url, undefined, { shallow: true });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('stockpileMonitoring.successDeleteMessage'),
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
      value: `${month}`,
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setMonth(value ? Number(value) : null);
      },
    });
    const selectWeekItem = globalSelectWeekNative({
      disabled: !year,
      value: `${week}`,
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

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
      },
    });
  };

  const handleSetPage = (page: number) => {
    const urlSet = `/input-data/quality-control-management/stockpile-monitoring?page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<IMonitoringStockpilesData> = {
        accessor: element.name,
        title: element.name,
        render: ({ currentSample }) => {
          const value = currentSample?.elements?.find(
            (val) => val.element?.name === element.name
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
              accessor: 'domeId',
              title: t('commonTypography.domeId'),
              render: ({ dome }) => dome?.handBookId ?? '-',
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
              render: ({ averageTonSurvey }) => averageTonSurvey ?? '-',
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
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/input-data/quality-control-management/stockpile-monitoring/read/${id}`
                        );
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/input-data/quality-control-management/stockpile-monitoring/update/${id}`
                        );
                      },
                    }}
                    actionDelete={{
                      onClick: (e) => {
                        e.stopPropagation();
                        setIsOpenDeleteConfirmation((prev) => !prev);
                        setId(id);
                      },
                    }}
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
  }, [monitoringStockpilesData, monitoringStockpilesDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      searchBar={{
        placeholder: t('stockpileMonitoring.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
      }}
      filterDateWithSelect={{
        items: filter,
        colSpan: 4,
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
          description: t('commonTypography.alertDescConfirmDeleteMasterData'),
        }}
        withDivider
      />
    </DashboardCard>
  );
};

export default StockpileBook;
