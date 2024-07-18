import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';
import { IFilterButtonProps } from '@/components/elements/button/FilterButton';

import { useDeleteWeeklyPlan } from '@/services/graphql/mutation/plan/weekly/useDeleteWeeklyPlan';
import { useReadAllWeeklyPlan } from '@/services/graphql/query/plan/weekly/useReadAllWeeklyPlan';
import {
  globalSelectCompanyNative,
  globalSelectStatusNative,
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

const WeeklyPlanBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [filterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon],
    shallow
  );

  const [
    hasHydrated,
    { page, companyId, status, week, year, filterBadgeValue },
    setWeeklyPlanState,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
      state.weeklyPlanState,
      state.setWeeklyPlanState,
    ],
    shallow
  );

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-weekly-plan');
  const isPermissionUpdate = permissions?.includes('update-weekly-plan');
  const isPermissionDelete = permissions?.includes('delete-weekly-plan');
  const isPermissionRead = permissions?.includes('read-weekly-plan');

  /* #   /**=========== Query =========== */
  const {
    weeklyPlanData,
    weeklyPlanDataOtherColumn,
    weeklyPlanDataLoading,
    weeklyPlanDataMeta,
    refetchWeeklyPlanData,
  } = useReadAllWeeklyPlan({
    variables: {
      limit: 10,
      page: 1,
      orderDir: 'desc',
      orderBy: 'year',
    },
  });

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(new Set<ISliceName>(['weeklyPlanSlice'] as ISliceName[]));
  }, []);

  React.useEffect(() => {
    if (hasHydrated) {
      refetchWeeklyPlanData({
        page,
        companyId,
        week,
        year,
        statusId: status,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const [executeDelete, { loading }] = useDeleteWeeklyPlan({
    onCompleted: () => {
      setIsOpenDeleteConfirmation((prev) => !prev);
      setWeeklyPlanState({ page: 1 });
      refetchWeeklyPlanData({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('weeklyPlan.successDeleteMessage'),
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
    setWeeklyPlanState({ page });
    refetchWeeklyPlanData({ page });
  };

  const filter = React.useMemo(() => {
    const selectYearItem = globalSelectYearNative({
      name: 'year',
      onChange: (value) => {
        setWeeklyPlanState({
          year: value ? Number(value) : null,
          week: null,
        });
      },
      value: year ? `${year}` : null,
    });
    const selectWeekItem = globalSelectWeekNative({
      disabled: !year,
      value: week ? `${week}` : null,
      year: year,
      onChange: (value) => {
        setWeeklyPlanState({ week: value ? Number(value) : null });
      },
    });
    const selectStatusItem = globalSelectStatusNative({
      onChange: (value) => {
        setWeeklyPlanState({ status: value });
      },
      value: status,
    });
    const selectCompanyItem = globalSelectCompanyNative({
      onChange: (value) => {
        setWeeklyPlanState({ companyId: value });
      },
      value: companyId,
    });

    const item: IFilterButtonProps = {
      filterDateWithSelect: [
        {
          selectItem: selectYearItem,
          col: 6,
          prefix: 'Tahun:',
        },
        {
          selectItem: selectWeekItem,
          col: 6,
        },
        {
          selectItem: selectStatusItem,
          col: 6,
        },
        {
          selectItem: selectCompanyItem,
          col: 6,
        },
      ],
    };
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, week, status, companyId]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: weeklyPlanData,
          fetching: weeklyPlanDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                weeklyPlanData && weeklyPlanData.indexOf(record) + 1,
              width: 60,
            },
            ...(weeklyPlanDataOtherColumn ?? []),
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
                              router.push(`/plan/weekly/read/${id}`);
                            },
                          }
                        : undefined
                    }
                    actionUpdate={
                      isPermissionUpdate && !isDetermination
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(`/plan/weekly/update/${id}`);
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
                label: t('weeklyPlan.create'),
                onClick: () => router.push('/plan/weekly/create'),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: weeklyPlanDataMeta?.totalAllData ?? 0,
          totalData: weeklyPlanDataMeta?.totalData ?? 0,
          totalPage: weeklyPlanDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    weeklyPlanData,
    weeklyPlanDataLoading,
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
              label: t('weeklyPlan.create'),
              onClick: () => router.push('/plan/weekly/create'),
            }
          : undefined
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            setWeeklyPlanState({
              page: 1,
              filterBadgeValue: null,
              year: null,
              companyId: null,
              status: null,
              week: null,
            });
            refetchWeeklyPlanData({
              page: 1,
              year: null,
              companyId: null,
              statusId: null,
              week: null,
            });
          },
        },
        value: filterBadgeValue,
      }}
      filter={{
        filterDateWithSelect: filter.filterDateWithSelect,
        filterButton: {
          disabled: status || week || year || companyId ? false : true,
          onClick: () => {
            refetchWeeklyPlanData({
              page: 1,
              year,
              week,
              statusId: status,
              companyId,
            });
            const badgeFilterValue = newNormalizedFilterBadge({
              filter: filter.filterDateWithSelect || [],
              data: filterDataCommon,
            });
            setWeeklyPlanState({
              page: 1,
              filterBadgeValue: badgeFilterValue || null,
            });
          },
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
          description: t('commonTypography.alertDescConfirmDelete'),
        }}
        withDivider
      />
    </DashboardCard>
  );
};

export default WeeklyPlanBook;
