import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
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

import { useDeleteOreRitage } from '@/services/graphql/mutation/ore-ritage/useDeleteOreRitage';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadAllHeavyEquipmentSelect } from '@/services/graphql/query/global-select/useReadAllHeavyEquipmentSelect';
import { useReadAllRitageOre } from '@/services/graphql/query/ore-ritage/useReadAllOreRitage';
import { useReadAllRitageOreDT } from '@/services/graphql/query/ore-ritage/useReadAllOreRitageDT';
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

const ListDataOreRitageBook = () => {
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
    setDataRitageOreState,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
      state.dataRitageOreState,
      state.dataRitageOreDumptruckState,
      state.setDataRitageOreState,
    ],
    shallow
  );
  const [tabs] = useQueryState('tabs', queryTypes.string.withDefault('ore'));
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-ore-ritage');
  const isPermissionUpdate = permissions?.includes('update-ore-ritage');
  const isPermissionDelete = permissions?.includes('delete-ore-ritage');
  const isPermissionRead = permissions?.includes('read-ore-ritage');
  /* #   /**=========== Query =========== */
  const { shiftsData } = useReadAllShiftMaster({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
    skip: tabs !== 'ore',
  });

  const { heavyEquipmentSelect } = useReadAllHeavyEquipmentSelect({
    variables: {
      limit: null,
      isComplete: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
    },
    skip: tabs !== 'ore',
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
    oreDumpTruckRitagesData,
    oreDumpTruckRitagesDataMeta,
    oreDumpTruckRitagesDataLoading,
    refetchOreDumpTruckRitages,
  } = useReadAllRitageOreDT({
    variables: {
      limit: 10,
      page: pageDumptruck || 1,
      orderDir: 'desc',
      // date: formatDate(filterDateDumptruck, 'YYYY-MM-DD') || null,
    },
    skip: tabs !== 'ore',
  });

  const {
    oreRitagesData,
    oreRitagesDataLoading,
    oreRitagesDataMeta,
    refetchOreRitages,
  } = useReadAllRitageOre({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
    },
    skip: tabs !== 'ore',
  });
  React.useEffect(() => {
    if (hasHydrated) {
      refetchOreRitages({
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
      refetchOreDumpTruckRitages({
        date: formatDate(filterDateDumptruck, 'YYYY-MM-DD') || null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const [executeDelete, { loading }] = useDeleteOreRitage({
    onCompleted: () => {
      refetchOreRitages();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setDataRitageOreState({
        dataRitageOreState: {
          page: 1,
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('ritageOre.successDeleteMessage'),
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
    setDataRitageOreState({
      dataRitageOreState: {
        page,
      },
    });
  };

  const filter = React.useMemo(() => {
    const dateItem = globalDateNative({
      label: 'date',
      placeholder: 'chooseDate',
      clearable: true,
      name: 'date',
      onChange: (value) => {
        setDataRitageOreState({
          dataRitageOreState: {
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
        setDataRitageOreState({
          dataRitageOreState: {
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
        setDataRitageOreState({
          dataRitageOreState: {
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
        setDataRitageOreState({
          dataRitageOreState: {
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
          records: oreRitagesData,
          fetching: oreRitagesDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                oreRitagesData && oreRitagesData.indexOf(record) + 1,
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
              accessor: 'subMaterial',
              title: t('commonTypography.subMaterial'),
              render: ({ subMaterial }) => subMaterial?.name ?? '-',
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
              accessor: 'dome',
              title: t('commonTypography.dome'),
              render: ({ dome }) => dome?.name ?? '-',
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
                                `/input-data/production/data-ritage/ore/read/${id}`
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
                                `/input-data/production/data-ritage/ore/update/${id}`
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
                label: t('ritageOre.createRitageOre'),
                onClick: () => setIsOpenSelectionModal((prev) => !prev),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page || 1,
          totalAllData: oreRitagesDataMeta?.totalAllData ?? 0,
          totalData: oreRitagesDataMeta?.totalData ?? 0,
          totalPage: oreRitagesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    oreRitagesData,
    oreRitagesDataLoading,
    isPermissionDelete,
    isPermissionRead,
    isPermissionUpdate,
    isPermissionCreate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      px={0}
      addButton={
        isPermissionCreate
          ? {
              label: t('ritageOre.createRitageOre'),
              onClick: () => setIsOpenSelectionModal((prev) => !prev),
            }
          : undefined
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            setDataRitageOreState({
              dataRitageOreState: {
                page: 1,
                filterBadgeValue: null,
                filtercompanyHeavyEquipmentId: null,
                filterShift: null,
                filterStatus: null,
                filterDate: null,
              },
            });
            refetchOreRitages({
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
            refetchOreRitages({
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
            setDataRitageOreState({
              dataRitageOreState: {
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
        data={oreDumpTruckRitagesData}
        meta={oreDumpTruckRitagesDataMeta}
        fetching={oreDumpTruckRitagesDataLoading}
        page={pageDumptruck || 1}
        setPage={(v) => {
          setDataRitageOreState({
            dataRitageOreDumptruckState: {
              page: v,
            },
          });
        }}
        tabs="ore"
        setDate={(v) => {
          setDataRitageOreState({
            dataRitageOreDumptruckState: {
              filterDate: v || null,
            },
          });
        }}
        date={filterDateDumptruck || undefined}
        urlDetail="/input-data/production/data-ritage/ore/read/dump-truck"
        filterBadgeValue={filterBadgeValueDT}
        onFilter={() => {
          refetchOreDumpTruckRitages({
            page: 1,
            date: formatDate(filterDateDumptruck, 'YYYY-MM-DD') || null,
          });
          const date = formatDate(filterDateDumptruck);
          setDataRitageOreState({
            dataRitageOreDumptruckState: {
              page: 1,
              filterBadgeValue: date ? [date] : [],
            },
          });
        }}
        onReset={() => {
          setDataRitageOreState({
            dataRitageOreDumptruckState: {
              page: 1,
              filterBadgeValue: null,
              filterDate: null,
            },
          });
          refetchOreDumpTruckRitages({
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
                subSubCategory: 'Produksi - Data Ritase - Ore - Modal Input',
                subCategory: 'Produksi - Data Ritase - Ore',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-ritage/ore/create');
          },
        }}
        secondButton={{
          label: t('commonTypography.uploadFile'),
          onClick: () => {
            sendGAEvent({
              event: 'Tambah',
              params: {
                category: 'Produksi',
                subSubCategory: 'Produksi - Data Ritase - Ore - Modal Unggah',
                subCategory: 'Produksi - Data Ritase - Ore',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-ritage/ore/upload');
          },
        }}
      />
    </DashboardCard>
  );
};

export default ListDataOreRitageBook;
