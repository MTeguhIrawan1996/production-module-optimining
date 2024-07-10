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

import { useDeleteQuarryRitage } from '@/services/graphql/mutation/quarry-ritage/useDeleteQuarryRitage';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadAllHeavyEquipmentSelect } from '@/services/graphql/query/global-select/useReadAllHeavyEquipmentSelect';
import { useReadAllRitageQuarry } from '@/services/graphql/query/quarry-ritage/useReadAllQuarryRitage';
import { useReadAllRitageQuarryDT } from '@/services/graphql/query/quarry-ritage/useReadAllQuarryRitageDT';
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

const ListDataQuarryRitageBook = () => {
  const router = useRouter();
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });
  const [
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
    setDataRitageQuarryState,
  ] = useControlPanel(
    (state) => [
      state.dataRitageQuarryState,
      state.dataRitageQuarryDumptruckState,
      state.setDataRitageQuarryState,
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

  const isPermissionCreate = permissions?.includes('create-quarry-ritage');
  const isPermissionUpdate = permissions?.includes('update-quarry-ritage');
  const isPermissionDelete = permissions?.includes('delete-quarry-ritage');
  const isPermissionRead = permissions?.includes('read-quarry-ritage');

  /* #   /**=========== Query =========== */
  const { shiftsData } = useReadAllShiftMaster({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
    skip: tabs !== 'quarry',
  });

  const { heavyEquipmentSelect } = useReadAllHeavyEquipmentSelect({
    variables: {
      limit: null,
      isComplete: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
    },
    skip: tabs !== 'quarry',
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
    quarryDumpTruckRitagesData,
    quarryDumpTruckRitagesDataLoading,
    quarryDumpTruckRitagesDataMeta,
    refetchQuarryDumpTruckRitages,
  } = useReadAllRitageQuarryDT({
    variables: {
      limit: 10,
      page: pageDumptruck || 1,
      orderDir: 'desc',
    },
    skip: tabs !== 'quarry',
  });

  const {
    quarryRitagesData,
    quarryRitagesDataLoading,
    quarryRitagesDataMeta,
    refetchQuarryRitages,
  } = useReadAllRitageQuarry({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
    },
    skip: tabs !== 'quarry',
  });

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    useControlPanel.persist.onFinishHydration(
      ({ dataRitageQuarryState, dataRitageQuarryDumptruckState }) => {
        const {
          filtercompanyHeavyEquipmentId,
          filterDate,
          filterShift,
          filterStatus,
        } = dataRitageQuarryState;
        const { filterDate: filterDateDumptruck } =
          dataRitageQuarryDumptruckState;
        refetchQuarryRitages({
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
        refetchQuarryDumpTruckRitages({
          date: formatDate(filterDateDumptruck, 'YYYY-MM-DD') || null,
        });
      }
    );
  }, [refetchQuarryDumpTruckRitages, refetchQuarryRitages]);

  const [executeDelete, { loading }] = useDeleteQuarryRitage({
    onCompleted: () => {
      refetchQuarryRitages();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setDataRitageQuarryState({
        dataRitageQuarryState: {
          page: 1,
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('ritageQuarry.successDeleteMessage'),
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
    setDataRitageQuarryState({
      dataRitageQuarryState: {
        page,
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
        setDataRitageQuarryState({
          dataRitageQuarryState: {
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
        setDataRitageQuarryState({
          dataRitageQuarryState: {
            filterStatus: value,
          },
        });
      },
      value: String(filterStatus),
    });
    const shiftItem = globalSelectNative({
      placeholder: 'chooseShift',
      label: 'shift',
      name: 'shift',
      searchable: false,
      data: shiftFilterItem,
      onChange: (value) => {
        setDataRitageQuarryState({
          dataRitageQuarryState: {
            filterShift: value,
          },
        });
      },
      value: filterShift ? filterShift : undefined,
    });
    const heavyEquipmentItem = globalSelectNative({
      placeholder: 'chooseHeavyEquipmentCode',
      label: 'heavyEquipmentCode',
      searchable: true,
      data: heavyEquipmentItemFilter,
      onChange: (value) => {
        setDataRitageQuarryState({
          dataRitageQuarryState: {
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
          records: quarryRitagesData,
          fetching: quarryRitagesDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                quarryRitagesData && quarryRitagesData.indexOf(record) + 1,
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
              accessor: 'fromLocation',
              title: t('commonTypography.fromLocation'),
              width: 120,
              render: ({ fromPit }) => fromPit?.name ?? '-',
            },
            {
              accessor: 'toLocation',
              title: t('commonTypography.toArrive'),
              render: ({ toLocation }) => toLocation?.name ?? '-',
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
                                `/input-data/production/data-ritage/quarry/read/${id}`
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
                                `/input-data/production/data-ritage/quarry/update/${id}`
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
                label: t('ritageQuarry.createRitageQuarry'),
                onClick: () => setIsOpenSelectionModal((prev) => !prev),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page || 1,
          totalAllData: quarryRitagesDataMeta?.totalAllData ?? 0,
          totalData: quarryRitagesDataMeta?.totalData ?? 0,
          totalPage: quarryRitagesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    quarryRitagesData,
    quarryRitagesDataLoading,
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
              label: t('ritageQuarry.createRitageQuarry'),
              onClick: () => setIsOpenSelectionModal((prev) => !prev),
            }
          : undefined
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            setDataRitageQuarryState({
              dataRitageQuarryState: {
                page: 1,
                filterBadgeValue: null,
                filtercompanyHeavyEquipmentId: null,
                filterShift: null,
                filterStatus: null,
                filterDate: null,
              },
            });
            refetchQuarryRitages({
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
            refetchQuarryRitages({
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
              filterDateWithSelect: filter.filterDateWithSelect,
            });

            const badgeFilterValue = newNormalizedFilterBadge({
              filter: newfilter || [],
              data: newData || [],
            });
            const date = formatDate(filterDate);
            setDataRitageQuarryState({
              dataRitageQuarryState: {
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
        data={quarryDumpTruckRitagesData}
        meta={quarryDumpTruckRitagesDataMeta}
        fetching={quarryDumpTruckRitagesDataLoading}
        page={pageDumptruck || 1}
        setPage={(v) => {
          setDataRitageQuarryState({
            dataRitageQuarryDumptruckState: {
              page: v,
            },
          });
        }}
        tabs="quarry"
        setDate={(v) => {
          setDataRitageQuarryState({
            dataRitageQuarryDumptruckState: {
              filterDate: v || null,
            },
          });
        }}
        date={filterDateDumptruck || undefined}
        urlDetail="/input-data/production/data-ritage/quarry/read/dump-truck"
        filterBadgeValue={filterBadgeValueDT}
        onFilter={() => {
          refetchQuarryDumpTruckRitages({
            page: 1,
            date: formatDate(filterDateDumptruck, 'YYYY-MM-DD') || null,
          });
          const date = formatDate(filterDateDumptruck);
          setDataRitageQuarryState({
            dataRitageQuarryDumptruckState: {
              page: 1,
              filterBadgeValue: date ? [date] : [],
            },
          });
        }}
        onReset={() => {
          setDataRitageQuarryState({
            dataRitageQuarryDumptruckState: {
              page: 1,
              filterBadgeValue: null,
              filterDate: null,
            },
          });
          refetchQuarryDumpTruckRitages({
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
                subSubCategory: 'Produksi - Data Ritase - Quarry - Modal Input',
                subCategory: 'Produksi - Data Ritase - Quarry',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-ritage/quarry/create');
          },
        }}
        secondButton={{
          label: t('commonTypography.uploadFile'),
          onClick: () => {
            sendGAEvent({
              event: 'Tambah',
              params: {
                category: 'Produksi',
                subSubCategory:
                  'Produksi - Data Ritase - Quarry - Modal Unggah',
                subCategory: 'Produksi - Data Ritase - Quarry',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-ritage/quarry/upload');
          },
        }}
      />
    </DashboardCard>
  );
};

export default ListDataQuarryRitageBook;
