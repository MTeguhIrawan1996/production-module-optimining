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

import { useDeleteActivityPlanMaster } from '@/services/graphql/mutation/activity-plan/useDeleteActivityPlanMaster';
import { useReadAllActivityPlanMaster } from '@/services/graphql/query/activity-plan/useReadAllActivityPlanMaster';
import useControlPanel from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ActivityPlanBook = () => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);

  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const isPermissionCreate = permissions?.includes('create-activity-plan');
  const isPermissionUpdate = permissions?.includes('update-activity-plan');
  const isPermissionDelete = permissions?.includes('delete-activity-plan');
  const isPermissionRead = permissions?.includes('read-activity-plan');
  const [{ page, search }, setPage, setSearch] = useControlPanel(
    (state) => [
      state.activityPlanState,
      state.setActivityPlanPage,
      state.setSearchActivityPlan,
    ],
    shallow
  );
  const [searchQuery] = useDebouncedValue<string>(search, 500);

  /* #   /**=========== Query =========== */
  const {
    activityPlansData,
    activityPlansDataLoading,
    activityPlansDataMeta,
    refetchActivityPlans,
  } = useReadAllActivityPlanMaster({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
    },
  });

  const [executeDelete, { loading }] = useDeleteActivityPlanMaster({
    onCompleted: () => {
      refetchActivityPlans();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage({
        page: 1,
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('activityPlan.successDeleteMessage'),
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

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
  }, []);

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
      },
    });
  };

  const handleSetPage = (page: number) => {
    setPage({
      page: page,
    });
  };

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: activityPlansData,
          fetching: activityPlansDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                activityPlansData && activityPlansData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'activityPlan',
              title: t('commonTypography.activityPlan'),
              render: ({ name }) => name ?? '-',
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
                                `/master-data/activity-plan/read/${id}`
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
                                `/master-data/activity-plan/update/${id}`
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
                label: t('activityPlan.createActivityPlan'),
                onClick: () => router.push('/master-data/activity-plan/create'),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: activityPlansDataMeta?.totalAllData ?? 0,
          totalData: activityPlansDataMeta?.totalData ?? 0,
          totalPage: activityPlansDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    activityPlansData,
    activityPlansDataLoading,
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
              label: t('activityPlan.createActivityPlan'),
              onClick: () => router.push('/master-data/activity-plan/create'),
            }
          : undefined
      }
      searchBar={{
        placeholder: t('activityPlan.searchPlaceholder'),
        onChange: (e) => {
          setSearch({
            search: e.currentTarget.value,
          });
        },
        onSearch: () => {
          setPage({
            page: 1,
          });
        },
        searchQuery: searchQuery,
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

export default ActivityPlanBook;
