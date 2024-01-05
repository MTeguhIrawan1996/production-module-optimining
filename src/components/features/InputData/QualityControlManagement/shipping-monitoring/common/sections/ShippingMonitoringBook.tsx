import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
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

import { useDeleteShippingMonitoring } from '@/services/graphql/mutation/shipping-monitoring/useDeleteShippingMonitoring';
import { useReadAllShippingMonitoring } from '@/services/graphql/query/shipping-monitoring/useReadAllShippingMonitoring';
import {
  globalSelectArriveBargeNative,
  globalSelectHeavyEquipmentNative,
  globalSelectMonthNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';

import { InputControllerNativeProps } from '@/types/global';

const ShippingMonitoringBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const url = `/input-data/quality-control-management/shipping-monitoring?page=1`;
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [destinationTypeId, setDestinationTypeId] = React.useState<
    string | null
  >(null);
  const [bargeHeavyEquipmentId, setBargeHeavyEquipmentId] = React.useState<
    string | null
  >(null);
  const [year, setYear] = React.useState<number | null>(null);
  const [month, setMonth] = React.useState<number | null>(null);
  const [week, setWeek] = React.useState<number | null>(null);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Query =========== */
  const {
    monitoringBargingData,
    monitoringBargingOtherColumn,
    monitoringBargingDataLoading,
    monitoringBargingDataMeta,
    refetchMonitoringBargingData,
  } = useReadAllShippingMonitoring({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      search: searchQuery === '' ? null : searchQuery,
      destinationTypeId,
      bargeHeavyEquipmentId,
      year,
      month,
      week,
    },
  });

  const [executeDelete, { loading }] = useDeleteShippingMonitoring({
    onCompleted: () => {
      refetchMonitoringBargingData();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push(url, undefined, { shallow: true });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('shippingMonitoring.successDeleteMessage'),
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
    const urlSet = `/input-data/quality-control-management/shipping-monitoring?page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const filter = React.useMemo(() => {
    const bargeCodeItem = globalSelectHeavyEquipmentNative({
      categoryId: `${process.env.NEXT_PUBLIC_BARGE_ID}`,
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setBargeHeavyEquipmentId(value === '' ? null : value);
      },
    });
    const arriveItem = globalSelectArriveBargeNative({
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setDestinationTypeId(value);
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
      bargeCodeItem,
      arriveItem,
      selectYearItem,
      selectMonthItem,
      selectWeekItem,
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, year, month, week]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: monitoringBargingData,
          fetching: monitoringBargingDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                monitoringBargingData &&
                monitoringBargingData.indexOf(record) + 1,
              width: 60,
            },
            ...(monitoringBargingOtherColumn ?? []),
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
                        router.push(
                          `/input-data/quality-control-management/shipping-monitoring/read/${id}`
                        );
                      },
                    }}
                    actionUpdate={
                      status?.id !==
                      `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/quality-control-management/shipping-monitoring/update/${id}`
                              );
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
            label: t('shippingMonitoring.createShippingMonitoring'),
            onClick: () =>
              router.push(
                '/input-data/quality-control-management/shipping-monitoring/create'
              ),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: monitoringBargingDataMeta?.totalAllData ?? 0,
          totalData: monitoringBargingDataMeta?.totalData ?? 0,
          totalPage: monitoringBargingDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitoringBargingData, monitoringBargingDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={{
        label: t('shippingMonitoring.createShippingMonitoring'),
        onClick: () =>
          router.push(
            '/input-data/quality-control-management/shipping-monitoring/create'
          ),
      }}
      filterDateWithSelect={{
        colSpan: 5,
        items: filter,
      }}
      searchBar={{
        placeholder: t('shippingMonitoring.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
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

export default ShippingMonitoringBook;
