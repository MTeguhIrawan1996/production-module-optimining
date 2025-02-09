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

import { useDeleteWHPMaster } from '@/services/graphql/mutation/working-hours-plan/useDeleteWHPMaster';
import { useReadAllWHPsMaster } from '@/services/graphql/query/working-hours-plan/useReadAllWHPMaster';
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const WorkingHoursPlanBook = () => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const [{ page, search }, setPage, setSearchWHP] = useControlPanel(
    (state) => [state.whpState, state.setWHPPage, state.setSearchWHP],
    shallow
  );
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(search, 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const isPermissionCreate = permissions?.includes('create-working-hour-plan');
  const isPermissionUpdate = permissions?.includes('update-working-hour-plan');
  const isPermissionDelete = permissions?.includes('delete-working-hour-plan');
  const isPermissionRead = permissions?.includes('read-working-hour-plan');

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(
      new Set<ISliceName>(['workingHoursPlanSlice'] as ISliceName[])
    );
  }, []);

  /* #   /**=========== Query =========== */
  const {
    workingHourPlansData,
    workingHourPlansDataMeta,
    workingHourPlansDataLoading,
    refetchWorkingHourPlans,
  } = useReadAllWHPsMaster({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
    },
  });

  const [executeDelete, { loading }] = useDeleteWHPMaster({
    onCompleted: () => {
      refetchWorkingHourPlans();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('workingHoursPlan.successDeleteMessage'),
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
          records: workingHourPlansData,
          fetching: workingHourPlansDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                workingHourPlansData &&
                workingHourPlansData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'activity',
              title: t('commonTypography.activity'),
              render: ({ activityName }) => activityName ?? '-',
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/master-data/working-hours-plan/read/${id}`
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
                                `/master-data/working-hours-plan/update/${id}`
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
                label: t('workingHoursPlan.createWorkingHoursPlan'),
                onClick: () =>
                  router.push('/master-data/working-hours-plan/create'),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: workingHourPlansDataMeta?.totalAllData ?? 0,
          totalData: workingHourPlansDataMeta?.totalData ?? 0,
          totalPage: workingHourPlansDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    workingHourPlansData,
    workingHourPlansDataLoading,
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
              label: t('workingHoursPlan.createWorkingHoursPlan'),
              onClick: () =>
                router.push('/master-data/working-hours-plan/create'),
            }
          : undefined
      }
      searchBar={{
        placeholder: t('workingHoursPlan.searchPlaceholder'),
        onChange: (e) => {
          setSearchWHP({ search: e.currentTarget.value });
        },
        searchQuery: searchQuery,
        value: search,
        onSearch: () => {
          setPage({ page: 1 });
          refetchWorkingHourPlans({ page: 1 });
        },
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

export default WorkingHoursPlanBook;
