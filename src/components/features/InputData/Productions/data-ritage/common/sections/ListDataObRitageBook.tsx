import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
  SelectionButtonModal,
} from '@/components/elements';
import { IFilterButtonProps } from '@/components/elements/button/FilterButton';
import ListDataRitageDumptruckBook from '@/components/features/InputData/Productions/data-ritage/common/elements/ListDataRitageDumptruckBook';

import { useDeleteOverburdenRitage } from '@/services/graphql/mutation/ob-ritage/useDeleteObRitage';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadAllHeavyEquipmentSelect } from '@/services/graphql/query/global-select/useReadAllHeavyEquipmentSelect';
import { useReadAllRitageOB } from '@/services/graphql/query/ob-ritage/useReadAllObRitage';
import { useReadAllRitageObDT } from '@/services/graphql/query/ob-ritage/useReadAllObRitageDT';
import { useReadAllShiftMaster } from '@/services/graphql/query/shift/useReadAllShiftMaster';
import {
  globalDateNative,
  globalSelectNative,
} from '@/utils/constants/Field/native-field';
import { sendGAEvent } from '@/utils/helper/analytics';
import { formatDate } from '@/utils/helper/dateFormat';
import {
  newNormalizedFilterBadge,
  normalizedRandomFilter,
} from '@/utils/helper/normalizedFilterBadge';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import useControlPanel from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ListDataObRitageBook = () => {
  const router = useRouter();
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  const [
    hasHydrated,
    {
      page,
      filterDate,
      filterStatus,
      filterShift,
      filtercompanyHeavyEquipmentId,
      filterBadgeValue,
    },
    {
      page: pageDumptruck,
      filterDate: filterDateDumptruck,
      filterBadgeValue: filterBadgeValueDT,
    },
    setDataRitageOBState,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
      state.dataRitageOBState,
      state.dataRitageOBDumptruckState,
      state.setDataRitageOBState,
    ],
    shallow
  );

  const [tabs] = useQueryState('tabs');
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);
  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-overburden-ritage');
  const isPermissionUpdate = permissions?.includes('update-overburden-ritage');
  const isPermissionDelete = permissions?.includes('delete-overburden-ritage');
  const isPermissionRead = permissions?.includes('read-overburden-ritage');
  /* #   /**=========== Query =========== */
  const { shiftsData } = useReadAllShiftMaster({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
    skip: tabs !== 'ob',
  });

  const { heavyEquipmentSelect } = useReadAllHeavyEquipmentSelect({
    variables: {
      limit: null,
      isComplete: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
    },
    skip: tabs !== 'ob',
  });

  const heavyEquipmentItem = heavyEquipmentSelect?.map((val) => {
    return {
      name: val.hullNumber ?? '',
      id: val.id ?? '',
    };
  });
  const { uncombinedItem: heavyEquipmentItemFilter } = useFilterItems({
    data: heavyEquipmentItem ?? [],
  });
  const { uncombinedItem: shiftFilterItem } = useFilterItems({
    data: shiftsData ?? [],
  });

  const {
    overburdenDumpTruckRitagesData,
    overburdenDumpTruckRitagesDataLoading,
    overburdenDumpTruckRitagesDataMeta,
    refetchOverburdenDumpTruckRitages,
  } = useReadAllRitageObDT({
    variables: {
      limit: 10,
      page: pageDumptruck,
      orderDir: 'desc',
    },
    skip: tabs !== 'ob',
  });

  const {
    overburdenRitagesData,
    overburdenRitagesDataLoading,
    overburdenRitagesDataMeta,
    refetchOverburdenRitages,
  } = useReadAllRitageOB({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
    },
    skip: tabs !== 'ob',
  });

  React.useEffect(() => {
    if (hasHydrated) {
      refetchOverburdenRitages({
        date: formatDate(filterDate, 'YYYY-MM-DD') || null,
        shiftId: filterShift === '' ? null : filterShift,
        isRitageProblematic: filterStatus
          ? filterStatus === 'true'
            ? false
            : true
          : null,
        companyHeavyEquipmentId:
          filtercompanyHeavyEquipmentId === ''
            ? null
            : filtercompanyHeavyEquipmentId,
      });
      refetchOverburdenDumpTruckRitages({
        date: formatDate(filterDateDumptruck, 'YYYY-MM-DD') || null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const [executeDelete, { loading }] = useDeleteOverburdenRitage({
    onCompleted: () => {
      refetchOverburdenRitages();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setDataRitageOBState({
        dataRitageOBState: {
          page: 1,
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('ritageOb.successDeleteMessage'),
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
    setDataRitageOBState({
      dataRitageOBState: {
        page: page,
      },
    });
  };

  const filter = React.useMemo(() => {
    const dateItem = globalDateNative({
      label: 'date',
      name: 'date',
      placeholder: 'chooseDate',
      clearable: true,
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            filterDate: value || null,
          },
        });
      },
      value: filterDate,
    });
    const ritageProblematic = globalSelectNative({
      placeholder: 'chooseRitageStatus',
      label: 'ritageStatus',
      name: 'ritageStatus',
      data: [
        {
          label: t('commonTypography.complete'),
          value: 'true',
        },
        {
          label: t('commonTypography.unComplete'),
          value: 'false',
        },
      ],
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            filterStatus: value,
          },
        });
      },
      value: filterStatus ? String(filterStatus) : null,
    });
    const shiftItem = globalSelectNative({
      placeholder: 'chooseShift',
      label: 'shift',
      name: 'shift',
      searchable: false,
      data: shiftFilterItem,
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            filterShift: value,
          },
        });
      },
      value: filterShift ? filterShift : undefined,
    });
    const heavyEquipmentItem = globalSelectNative({
      placeholder: 'chooseHeavyEquipmentCode',
      label: 'heavyEquipmentCode',
      name: 'heavyEquipmentCode',
      searchable: true,
      data: heavyEquipmentItemFilter,
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            filtercompanyHeavyEquipmentId: value,
          },
        });
      },
      value: filtercompanyHeavyEquipmentId
        ? filtercompanyHeavyEquipmentId
        : undefined,
    });

    const item: IFilterButtonProps = {
      filterDateWithSelect: [
        {
          selectItem: dateItem,
          col: 6,
        },
        {
          selectItem: ritageProblematic,
          col: 6,
          prefix: 'Ritase',
        },
        {
          selectItem: shiftItem,
          col: 6,
        },
        {
          selectItem: heavyEquipmentItem,
          col: 6,
        },
      ],
    };
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heavyEquipmentItemFilter, shiftFilterItem]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: overburdenRitagesData,
          fetching: overburdenRitagesDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                overburdenRitagesData &&
                overburdenRitagesData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'date',
              title: t('commonTypography.date'),
              width: 160,
              render: ({ date }) => formatDate(date) ?? '-',
            },
            {
              accessor: 'shift',
              title: t('commonTypography.shift'),
              render: ({ shift }) => shift?.name ?? '-',
            },
            {
              accessor: 'heavyEquipmentCode',
              title: t('commonTypography.heavyEquipmentCode'),
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment?.hullNumber ?? '-',
            },
            {
              accessor: 'material',
              title: t('commonTypography.material'),
              render: ({ material }) => material?.name ?? '-',
            },
            {
              accessor: 'fromAt',
              title: t('commonTypography.fromAt'),
              render: ({ fromAt }) => formatDate(fromAt, 'hh:mm:ss A') ?? '-',
            },
            {
              accessor: 'fromPit',
              title: t('commonTypography.pit'),
              width: 120,
              render: ({ fromPit }) => fromPit?.name ?? '-',
            },
            {
              accessor: 'disposal',
              title: 'Disposal',
              render: ({ disposal }) => disposal?.name ?? '-',
            },
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
              accessor: 'ritageStatus',
              title: t('commonTypography.ritageStatus'),
              render: ({ isRitageProblematic }) => (
                <GlobalBadgeStatus
                  color={isRitageProblematic ? 'gray.6' : 'brand.6'}
                  label={
                    isRitageProblematic
                      ? t('commonTypography.unComplete')
                      : t('commonTypography.complete')
                  }
                />
              ),
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
                                `/input-data/production/data-ritage/ob/read/${id}`
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
                                `/input-data/production/data-ritage/ob/update/${id}`
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
                label: t('ritageOb.createRitageOb'),
                onClick: () => setIsOpenSelectionModal((prev) => !prev),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page || 1,
          totalAllData: overburdenRitagesDataMeta?.totalAllData ?? 0,
          totalData: overburdenRitagesDataMeta?.totalData ?? 0,
          totalPage: overburdenRitagesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    overburdenRitagesData,
    overburdenRitagesDataLoading,
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
              label: t('ritageOb.createRitageOb'),
              onClick: () => setIsOpenSelectionModal((prev) => !prev),
            }
          : undefined
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            setDataRitageOBState({
              dataRitageOBState: {
                page: 1,
                filterBadgeValue: null,
                filtercompanyHeavyEquipmentId: null,
                filterShift: null,
                filterStatus: null,
                filterDate: null,
              },
            });
            refetchOverburdenRitages({
              page: 1,
              shiftId: null,
              isRitageProblematic: null,
              companyHeavyEquipmentId: null,
              date: null,
            });
          },
        },
        value: filterBadgeValue || null,
      }}
      filter={{
        filterDateWithSelect: filter.filterDateWithSelect,
        filterButton: {
          disabled:
            filterShift ||
            filterStatus ||
            filtercompanyHeavyEquipmentId ||
            filterDate
              ? false
              : true,
          onClick: () => {
            refetchOverburdenRitages({
              page: 1,
              date: formatDate(filterDate, 'YYYY-MM-DD') || null,
              shiftId: filterShift === '' ? null : filterShift,
              isRitageProblematic: filterStatus
                ? filterStatus === 'true'
                  ? false
                  : true
                : null,
              companyHeavyEquipmentId:
                filtercompanyHeavyEquipmentId === ''
                  ? null
                  : filtercompanyHeavyEquipmentId,
            });
            const { newData, newfilter } = normalizedRandomFilter({
              filter: filter.filterDateWithSelect || [],
              excludesNameFilter: ['date'],
            });

            const badgeFilterValue = newNormalizedFilterBadge({
              filter: newfilter || [],
              data: newData || [],
            });
            const date = formatDate(filterDate);
            setDataRitageOBState({
              dataRitageOBState: {
                page: 1,
                filterBadgeValue: date
                  ? [date, ...badgeFilterValue]
                  : badgeFilterValue,
              },
            });
          },
        },
      }}
    >
      {renderTable}
      <ListDataRitageDumptruckBook
        data={overburdenDumpTruckRitagesData}
        meta={overburdenDumpTruckRitagesDataMeta}
        fetching={overburdenDumpTruckRitagesDataLoading}
        page={pageDumptruck || 1}
        setPage={(v) => {
          setDataRitageOBState({
            dataRitageOBDumptruckState: {
              page: v,
            },
          });
        }}
        tabs="ob"
        setDate={(v) => {
          setDataRitageOBState({
            dataRitageOBDumptruckState: {
              filterDate: v || null,
            },
          });
        }}
        date={filterDateDumptruck || undefined}
        urlDetail="/input-data/production/data-ritage/ob/read/dump-truck"
        filterBadgeValue={filterBadgeValueDT}
        onFilter={() => {
          refetchOverburdenDumpTruckRitages({
            page: 1,
            date: formatDate(filterDateDumptruck, 'YYYY-MM-DD') || null,
          });
          const date = formatDate(filterDateDumptruck);
          setDataRitageOBState({
            dataRitageOBDumptruckState: {
              page: 1,
              filterBadgeValue: date ? [date] : [],
            },
          });
        }}
        onReset={() => {
          setDataRitageOBState({
            dataRitageOBDumptruckState: {
              page: 1,
              filterBadgeValue: null,
              filterDate: null,
            },
          });
          refetchOverburdenDumpTruckRitages({
            page: 1,
            date: null,
          });
        }}
      />
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
      <SelectionButtonModal
        isOpenSelectionModal={isOpenSelectionModal}
        actionSelectionModal={() => setIsOpenSelectionModal((prev) => !prev)}
        firstButton={{
          label: t('commonTypography.inputDataRitage'),
          onClick: () => {
            sendGAEvent({
              event: 'Tambah',
              params: {
                category: 'Produksi',
                subSubCategory: 'Produksi - Data Ritase - OB - Modal Input',
                subCategory: 'Produksi - Data Ritase - OB',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-ritage/ob/create');
          },
        }}
        secondButton={{
          label: t('commonTypography.uploadFile'),
          onClick: () => {
            sendGAEvent({
              event: 'Tambah',
              params: {
                category: 'Produksi',
                subSubCategory: 'Produksi - Data Ritase - OB - Modal Unggah',
                subCategory: 'Produksi - Data Ritase - OB',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-ritage/ob/upload');
          },
        }}
      />
    </DashboardCard>
  );
};

export default ListDataObRitageBook;
