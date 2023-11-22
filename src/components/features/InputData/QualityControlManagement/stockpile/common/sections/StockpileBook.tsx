import { SelectProps } from '@mantine/core';
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
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteShiftMaster } from '@/services/graphql/mutation/shift/useDeleteShiftMaster';
import {
  IElementsData,
  useReadAllElementMaster,
} from '@/services/graphql/query/element/useReadAllElementMaster';
import { useReadAllLocationsMaster } from '@/services/graphql/query/location/useReadAllLocationMaster';
import {
  IMonitoringStockpilesData,
  useReadAllStockpileMonitoring,
} from '@/services/graphql/query/stockpile-monitoring/useReadAllStockpileMonitoring';
import { globalSelect } from '@/utils/constants/Field/global-field';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

const StockpileBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
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
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Query =========== */
  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
  });

  const { locationsData } = useReadAllLocationsMaster({
    variables: {
      limit: 15,
      orderDir: 'desc',
      orderBy: 'createdAt',
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
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
      stockpileId,
    },
  });

  const [executeDelete, { loading }] = useDeleteShiftMaster({
    onCompleted: () => {
      refetchMonitoringStockpiles();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push({
        href: router.asPath,
        query: {
          page: 1,
        },
      });
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
    data: locationsData ?? [],
  });

  const filter = React.useMemo(() => {
    const stockpileNameItem = globalSelect({
      label: 'stockpileName',
      data: locationItems,
      searchable: true,
      placeholder: 'chooseStockpileName',
      onSearchChange: setStockpileNameSerachTerm,
      searchValue: stockpileNameSerachTerm,
      onChange: (value) => {
        router.push({
          href: router.asPath,
          query: {
            page: 1,
          },
        });
        setStockpileId(value);
      },
    });
    const item: SelectProps[] = [stockpileNameItem];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationItems]);

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
      },
    });
  };

  const handleSetPage = (page: number) => {
    router.push({
      href: router.asPath,
      query: {
        page: page,
      },
    });
  };

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<IMonitoringStockpilesData> = {
        accessor: element.name,
        title: element.name,
        render: ({ currentSample }) => {
          const value = currentSample.elements?.find(
            (val) => val.elementName === element.name
          );
          return value?.value;
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
          records: monitoringStockpilesData ?? [],
          fetching: monitoringStockpilesDataLoading,
          highlightOnHover: true,
          withColumnBorders: false,
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
              render: ({ stockpile }) => stockpile?.name,
            },
            {
              accessor: 'domeId',
              title: t('commonTypography.domeId'),
              render: ({ dome }) => dome?.handBookId,
            },
            {
              accessor: 'domeName',
              title: t('commonTypography.domeName'),
              render: ({ dome }) => dome?.name,
            },
            {
              accessor: 'materialType',
              title: t('commonTypography.materialType'),
              render: ({ material }) => material?.name,
            },
            {
              accessor: 'tonByRitage',
              title: t('commonTypography.tonByRitage'),
            },
            {
              accessor: 'tonBySurvey',
              title: t('commonTypography.tonBySurvey'),
            },
            ...(renderOtherColumn ?? []),
            {
              accessor: 'domeStatus',
              title: t('commonTypography.domeStatus'),
            },
            {
              accessor: 'status',
              title: t('commonTypography.status'),
              // render: ({ material }) => material?.name,
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
          actionButton: {
            label: t('stockpileMonitoring.createDome'),
            onClick: () =>
              router.push(
                '/input-data/quality-control-management/stockpile-monitoring/create'
              ),
          },
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
      addButton={{
        label: t('stockpileMonitoring.createDome'),
        onClick: () =>
          router.push(
            '/input-data/quality-control-management/stockpile-monitoring/create'
          ),
      }}
      searchBar={{
        placeholder: t('stockpileMonitoring.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
      }}
      MultipleFilter={{
        MultipleFilterData: filter,
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
