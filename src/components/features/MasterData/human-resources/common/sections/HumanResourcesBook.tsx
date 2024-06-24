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

import { useDeleteMasterDataHumanResource } from '@/services/graphql/mutation/master-data-human-resources/useDeleteHumanResources';
import { useReadAllHumanResourcesMasterData } from '@/services/graphql/query/master-data-human-resources/useReadAllMasterDataHumanResources';
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const HumanResourcesBook = () => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [{ page, search }, setPage, setSearch] = useControlPanel(
    (state) => [
      state.humanResourcesState,
      state.setHumanResourcesPage,
      state.setSearchHumanResources,
    ],
    shallow
  );
  const [searchQuery] = useDebouncedValue<string>(search, 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const isPermissionCreate = permissions?.includes('create-human-resource');
  const isPermissionUpdate = permissions?.includes('update-human-resource');
  const isPermissionDelete = permissions?.includes('delete-human-resource');
  const isPermissionRead = permissions?.includes('read-human-resource');

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(
      new Set<ISliceName>(['humanResourcesSlice'] as ISliceName[])
    );
  }, []);

  /* #   /**=========== Query =========== */
  const {
    humanResourcesData,
    humanResourcesDataLoading,
    humanResourcesDataMeta,
    refetchHumanResources,
  } = useReadAllHumanResourcesMasterData({
    variables: {
      limit: 10,
      page: page,
      orderBy: 'createdAt',
      orderDir: 'desc',
      search: searchQuery === '' ? null : searchQuery,
    },
  });

  const [executeDelete, { loading }] = useDeleteMasterDataHumanResource({
    onCompleted: () => {
      refetchHumanResources();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('humanResources.successDeleteMessage'),
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
          records: humanResourcesData,
          fetching: humanResourcesDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                humanResourcesData && humanResourcesData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'name',
              title: t('commonTypography.name'),
            },
            {
              accessor: 'phoneNumber',
              title: t('commonTypography.phoneNumber'),
            },
            {
              accessor: 'email',
              title: t('commonTypography.email'),
            },
            {
              accessor: 'identityNumber',
              title: t('commonTypography.identityNumber'),
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
                              e.stopPropagation();
                              router.push(
                                `/master-data/human-resources/read/${id}`
                              );
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
                                `/master-data/human-resources/update/${id}`
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
                label: t('humanResources.createHumanResources'),
                onClick: () =>
                  router.push('/master-data/human-resources/create'),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: humanResourcesDataMeta?.totalAllData ?? 0,
          totalData: humanResourcesDataMeta?.totalData ?? 0,
          totalPage: humanResourcesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    humanResourcesData,
    humanResourcesDataLoading,
    isPermissionRead,
    isPermissionDelete,
    isPermissionUpdate,
    isPermissionCreate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              label: t('commonTypography.nmIndividual', {
                n: t('commonTypography.create'),
              }),
              onClick: () => router.push('/master-data/human-resources/create'),
            }
          : undefined
      }
      searchBar={{
        placeholder: t('humanResources.searchPlaceholder'),
        onChange: (e) => {
          setSearch({ search: e.currentTarget.value });
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setPage({ page: 1 });
          refetchHumanResources({
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
          description: t('commonTypography.alertDescConfirmDeleteMasterData'),
        }}
        withDivider
      />
    </DashboardCard>
  );
};

export default HumanResourcesBook;
