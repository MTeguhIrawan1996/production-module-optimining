import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteStockpileMaster } from '@/services/graphql/mutation/stockpile-master/useDeleteStockpileMaster';
import { useReadAllStockpileMaster } from '@/services/graphql/query/stockpile-master/useReadAllStockpileMaster';
import useControlPanel from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const StockpileMasterBook = () => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);

  const [{ page, search }, setPage, setSearch, setStockpilePageDome] =
    useControlPanel(
      (state) => [
        state.stockpileState,
        state.setStockpilePage,
        state.setSearchStockpile,
        state.setStockpilePageDome,
      ],
      shallow
    );

  const [searchQuery] = useDebouncedValue<string>(search, 500);

  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const isPermissionCreate = permissions?.includes('create-stockpile');
  const isPermissionUpdate = permissions?.includes('update-stockpile');
  const isPermissionDelete = permissions?.includes('delete-stockpile');
  const isPermissionRead = permissions?.includes('read-stockpile');

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
  }, []);

  /* #   /**=========== Query =========== */
  const {
    stockpilesData,
    stockpilesDataMeta,
    refetchStockpiles,
    stockpilesDataLoading,
  } = useReadAllStockpileMaster({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
    },
  });

  const [executeDelete, { loading }] = useDeleteStockpileMaster({
    onCompleted: () => {
      refetchStockpiles();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('stockpile.successDeleteMessage'),
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
    setPage({ page });
  };

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: stockpilesData,
          fetching: stockpilesDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                stockpilesData && stockpilesData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'handBookId',
              title: t('commonTypography.stockpileId'),
            },
            {
              accessor: 'name',
              title: t('commonTypography.stockpileName'),
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              setStockpilePageDome({
                                page: 1,
                              });
                              e.stopPropagation();
                              router.push(`/master-data/stockpile/read/${id}`);
                            },
                          }
                        : undefined
                    }
                    actionUpdate={
                      isPermissionUpdate
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/master-data/stockpile/update/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionDelete={
                      isPermissionDelete
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
                label: t('stockpile.createStockpile'),
                onClick: () => router.push('/master-data/stockpile/create'),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: stockpilesDataMeta?.totalAllData ?? 0,
          totalData: stockpilesDataMeta?.totalData ?? 0,
          totalPage: stockpilesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    stockpilesData,
    stockpilesDataLoading,
    isPermissionDelete,
    isPermissionRead,
    isPermissionUpdate,
    isPermissionCreate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              label: t('stockpile.createStockpile'),
              onClick: () => router.push('/master-data/stockpile/create'),
            }
          : undefined
      }
      searchBar={{
        placeholder: t('stockpile.searchPlaceholder'),
        onChange: (e) => {
          setSearch({
            search: e.currentTarget.value,
          });
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setPage({ page: 1 });
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
          description: t('commonTypography.alertDescConfirmDeleteMasterData'),
        }}
        withDivider
      />
    </DashboardCard>
  );
};

export default StockpileMasterBook;
