import { useDebouncedValue } from '@mantine/hooks';
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

import { useDeleteShippingMonitoring } from '@/services/graphql/mutation/shipping-monitoring/useDeleteShippingMonitoring';
import { useReadAllShippingMonitoring } from '@/services/graphql/query/shipping-monitoring/useReadAllShippingMonitoring';
import {
  globalSelectArriveBargeNative,
  globalSelectHeavyEquipmentNative,
  globalSelectMonthNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { InputControllerNativeProps } from '@/types/global';

const ShippingMonitoringBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [
    {
      page,
      search,
      bargeHeavyEquipmentId,
      factoryCategoryId,
      year,
      month,
      week,
    },
    setBargingMonitoringState,
  ] = useControlPanel(
    (state) => [state.bargingMonitoringState, state.setBargingMonitoringState],
    shallow
  );
  const [id, setId] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(search, 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-monitoring-barging');
  const isPermissionUpdate = permissions?.includes('update-monitoring-barging');
  const isPermissionDelete = permissions?.includes('delete-monitoring-barging');
  const isPermissionRead = permissions?.includes('read-monitoring-barging');

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(
      new Set<ISliceName>(['bargingMonitoringSlice'] as ISliceName[])
    );
  }, []);

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
      factoryCategoryId,
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
      setBargingMonitoringState({ page: 1 });
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
    setBargingMonitoringState({ page });
  };

  const filter = React.useMemo(() => {
    const bargeCodeItem = globalSelectHeavyEquipmentNative({
      categoryId: `${process.env.NEXT_PUBLIC_BARGE_ID}`,
      onChange: (value) => {
        setBargingMonitoringState({
          page: 1,
          bargeHeavyEquipmentId: value,
        });
      },
      value: bargeHeavyEquipmentId,
    });
    const arriveItem = globalSelectArriveBargeNative({
      onChange: (value) => {
        setBargingMonitoringState({
          page: 1,
          factoryCategoryId: value,
        });
      },
      value: factoryCategoryId,
    });
    const selectYearItem = globalSelectYearNative({
      onChange: (value) => {
        setBargingMonitoringState({
          page: 1,
          year: value ? Number(value) : null,
          month: null,
          week: null,
        });
      },
      value: year ? `${year}` : null,
    });
    const selectMonthItem = globalSelectMonthNative({
      disabled: !year,
      value: month ? `${month}` : null,
      onChange: (value) => {
        setBargingMonitoringState({
          page: 1,
          month: value ? Number(value) : null,
        });
      },
    });
    const selectWeekItem = globalSelectWeekNative({
      disabled: !year,
      value: week ? `${week}` : null,
      year: year,
      onChange: (value) => {
        setBargingMonitoringState({
          page: 1,
          week: value ? Number(value) : null,
        });
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
  }, [year, month, week, factoryCategoryId, bargeHeavyEquipmentId]);

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
                const isDetermination =
                  status?.id === `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`;
                return (
                  <GlobalKebabButton
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/quality-control-management/shipping-monitoring/read/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionUpdate={
                      isPermissionUpdate && !isDetermination
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
                label: t('shippingMonitoring.createShippingMonitoring'),
                onClick: () =>
                  router.push(
                    '/input-data/quality-control-management/shipping-monitoring/create'
                  ),
              }
            : undefined,
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
  }, [
    page,
    monitoringBargingData,
    monitoringBargingDataLoading,
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
              label: t('shippingMonitoring.createShippingMonitoring'),
              onClick: () =>
                router.push(
                  '/input-data/quality-control-management/shipping-monitoring/create'
                ),
            }
          : undefined
      }
      filterDateWithSelect={{
        colSpan: 5,
        items: filter,
      }}
      searchBar={{
        placeholder: t('shippingMonitoring.searchPlaceholder'),
        onChange: (e) => {
          setBargingMonitoringState({ search: e.currentTarget.value });
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setBargingMonitoringState({ page: 1 });
          refetchMonitoringBargingData({
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
          description: t('commonTypography.alertDescConfirmDelete'),
        }}
        withDivider
      />
    </DashboardCard>
  );
};

export default ShippingMonitoringBook;
