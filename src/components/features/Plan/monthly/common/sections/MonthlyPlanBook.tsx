import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { parseAsInteger, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteMonthlyPlan } from '@/services/graphql/mutation/plan/monthly/useDeleteMonthlyPlan';
import { useReadAllMonthlyPlan } from '@/services/graphql/query/plan/monthly/useReadAllMonthlyPlan';
import {
  globalSelectCompanyNative,
  globalSelectMonthNative,
  globalSelectStatusNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';

import { InputControllerNativeProps } from '@/types/global';

const MonthlyPlanBook = () => {
  const router = useRouter();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [year, setYear] = React.useState<number | null>(null);
  const [month, setMonth] = React.useState<number | null>(null);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [status, setStatus] = React.useState<string | null>(null);
  const [companyId, setCompanyId] = React.useState<string | null>(null);

  /* #   /**=========== Query =========== */
  const {
    monthlyPlanData,
    monthlyPlanDataMeta,
    monthlyPlanDataLoading,
    monthlyPlanDataOtherColumn,
    refetchMonthlyPlanData,
  } = useReadAllMonthlyPlan({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      year,
      month,
      statusId: status,
      companyId,
    },
  });

  const [executeDelete, { loading }] = useDeleteMonthlyPlan({
    onCompleted: () => {
      refetchMonthlyPlanData();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage(1);
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('monthlyPlan.successDeleteMessage'),
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
    setPage(page);
  };

  const filter = React.useMemo(() => {
    const selectYearItem = globalSelectYearNative({
      onChange: (value) => {
        setPage(1);
        setYear(value ? Number(value) : null);
      },
    });
    const selectMonthItem = globalSelectMonthNative({
      onChange: (value) => {
        setPage(1);
        setMonth(value ? Number(value) : null);
      },
    });
    const selectStatusItem = globalSelectStatusNative({
      onChange: (value) => {
        setPage(1);
        setStatus(value);
      },
    });
    const selectCompanyItem = globalSelectCompanyNative({
      onChange: (value) => {
        setPage(1);
        setCompanyId(value);
      },
    });

    const item: InputControllerNativeProps[] = [
      selectYearItem,
      selectMonthItem,
      selectStatusItem,
      selectCompanyItem,
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: monthlyPlanData,
          fetching: monthlyPlanDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                monthlyPlanData && monthlyPlanData.indexOf(record) + 1,
              width: 60,
            },
            ...(monthlyPlanDataOtherColumn ?? []),
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
                        router.push(`/plan/monthly/read/${id}`);
                      },
                    }}
                    actionUpdate={
                      status?.id !==
                      `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(`/plan/monthly/update/${id}`);
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
            label: t('monthlyPlan.create'),
            onClick: () => router.push('/plan/monthly/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: monthlyPlanDataMeta?.totalAllData ?? 0,
          totalData: monthlyPlanDataMeta?.totalData ?? 0,
          totalPage: monthlyPlanDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, monthlyPlanData, monthlyPlanDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={{
        label: t('monthlyPlan.create'),
        onClick: () => router.push('/plan/monthly/create'),
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

export default MonthlyPlanBook;
