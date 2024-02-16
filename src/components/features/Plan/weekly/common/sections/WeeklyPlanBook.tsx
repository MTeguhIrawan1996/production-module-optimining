import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteWeeklyPlan } from '@/services/graphql/mutation/plan/weekly/useDeleteWeeklyPlan';
import { useReadAllWeeklyPlan } from '@/services/graphql/query/plan/weekly/useReadAllWeeklyPlan';
import {
  globalSelectCompanyNative,
  globalSelectStatusNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';

import { InputControllerNativeProps } from '@/types/global';

const WeeklyPlanBook = () => {
  const router = useRouter();
  const page = Number(router.query['page']) || 1;
  const url = `/plan/weekly?page=1`;
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [year, setYear] = React.useState<number | null>(null);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [week, setWeek] = React.useState<number | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);
  const [companyId, setCompanyId] = React.useState<string | null>(null);

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
      page: page,
      orderDir: 'desc',
      orderBy: 'year',
      year,
      week,
      statusId: status,
      companyId,
    },
  });

  const [executeDelete, { loading }] = useDeleteWeeklyPlan({
    onCompleted: () => {
      refetchWeeklyPlanData();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push(url, undefined, { shallow: true });
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
    const urlSet = `/plan/weekly?page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const filter = React.useMemo(() => {
    const selectYearItem = globalSelectYearNative({
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setYear(value ? Number(value) : null);
        setWeek(null);
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
    const selectStatusItem = globalSelectStatusNative({
      onChange: (value) => {
        setStatus(value);
      },
    });
    const selectCompanyItem = globalSelectCompanyNative({
      onChange: (value) => {
        setCompanyId(value);
      },
    });

    const item: InputControllerNativeProps[] = [
      selectYearItem,
      selectWeekItem,
      selectStatusItem,
      selectCompanyItem,
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, year, week]);

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
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/plan/weekly/read/${id}`);
                      },
                    }}
                    actionUpdate={
                      status?.id !==
                      `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(`/plan/weekly/update/${id}`);
                            },
                          }
                        : undefined
                    }
                    actionDelete={
                      status?.id !==
                      `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`
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
          actionButton: {
            label: t('weeklyPlan.create'),
            onClick: () => router.push('/plan/weekly/create'),
          },
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
  }, [weeklyPlanData, weeklyPlanDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={{
        label: t('weeklyPlan.create'),
        onClick: () => router.push('/plan/weekly/create'),
      }}
      filterDateWithSelect={{
        colSpan: 4,
        items: filter,
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
