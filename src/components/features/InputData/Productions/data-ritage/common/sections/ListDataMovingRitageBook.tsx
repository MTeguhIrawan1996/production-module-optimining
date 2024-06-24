import { useDebouncedValue } from '@mantine/hooks';
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
import ListDataRitageDumptruckBook from '@/components/features/InputData/Productions/data-ritage/common/elements/ListDataRitageDumptruckBook';

import { useDeleteMovingRitage } from '@/services/graphql/mutation/moving-ritage/useDeleteMovingRitage';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadAllHeavyEquipmentSelect } from '@/services/graphql/query/global-select/useReadAllHeavyEquipmentSelect';
import { useReadAllRitageMoving } from '@/services/graphql/query/moving-ritage/useReadAllMovingRitage';
import { useReadAllRitageMovingDT } from '@/services/graphql/query/moving-ritage/useReadAllMovingRitageDT';
import { useReadAllShiftMaster } from '@/services/graphql/query/shift/useReadAllShiftMaster';
import {
  globalDateNative,
  globalSelectNative,
} from '@/utils/constants/Field/native-field';
import { sendGAEvent } from '@/utils/helper/analytics';
import { formatDate } from '@/utils/helper/dateFormat';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { InputControllerNativeProps } from '@/types/global';

const ListDataMovingRitageBook = () => {
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
    },
    { page: pageDumptruck, filterDate: filterDateDumptruck },
    setDataRitageMovingState,
  ] = useControlPanel(
    (state) => [
      state.dataRitageMovingState,
      state.dataRitageMovingDumptruckState,
      state.setDataRitageMovingState,
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

  const [heavyEquipmentSeacrhTerm, setHeavyEquipmentSeacrhTerm] =
    React.useState<string>('');
  const [heavyEquipmentSearchQuery] = useDebouncedValue<string>(
    heavyEquipmentSeacrhTerm,
    400
  );

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-moving-ritage');
  const isPermissionUpdate = permissions?.includes('update-moving-ritage');
  const isPermissionDelete = permissions?.includes('delete-moving-ritage');
  const isPermissionRead = permissions?.includes('read-moving-ritage');
  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(new Set<ISliceName>(['ritageMovingSlice'] as ISliceName[]));
  }, []);
  /* #   /**=========== Query =========== */
  const { shiftsData } = useReadAllShiftMaster({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
    skip: tabs !== 'moving',
  });

  const { heavyEquipmentSelect } = useReadAllHeavyEquipmentSelect({
    variables: {
      limit: 15,
      search:
        heavyEquipmentSearchQuery === '' ? null : heavyEquipmentSearchQuery,
      isComplete: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
    },
    skip: tabs !== 'moving',
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
    movingDumpTruckRitagesData,
    movingDumpTruckRitagesDataLoading,
    movingDumpTruckRitagesDataMeta,
  } = useReadAllRitageMovingDT({
    variables: {
      limit: 10,
      page: pageDumptruck,
      orderDir: 'desc',
      date: filterDateDumptruck === '' ? null : filterDateDumptruck,
    },
    skip: tabs !== 'moving',
  });

  const {
    movingRitagesData,
    movingRitagesDataLoading,
    movingRitagesDataMeta,
    refetchMovingRitages,
  } = useReadAllRitageMoving({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      date: filterDate === '' ? null : filterDate,
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
    },
    skip: tabs !== 'moving',
  });

  const [executeDelete, { loading }] = useDeleteMovingRitage({
    onCompleted: () => {
      refetchMovingRitages();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setDataRitageMovingState({
        dataRitageMovingState: {
          page: 1,
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('ritageMoving.successDeleteMessage'),
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
    setDataRitageMovingState({
      dataRitageMovingState: {
        page: page,
      },
    });
  };

  const filter = React.useMemo(() => {
    const dateItem = globalDateNative({
      label: 'date',
      placeholder: 'chooseDate',
      clearable: true,
      onChange: (value) => {
        const date = formatDate(value, 'YYYY-MM-DD');
        setDataRitageMovingState({
          dataRitageMovingState: {
            page: 1,
            filterDate: date ?? '',
          },
        });
      },
      value: filterDate ? new Date(filterDate) : undefined,
    });
    const ritageProblematic = globalSelectNative({
      placeholder: 'chooseRitageStatus',
      label: 'ritageStatus',
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
        setDataRitageMovingState({
          dataRitageMovingState: {
            page: 1,
            filterStatus: value,
          },
        });
      },
      value: String(filterStatus),
    });
    const shiftItem = globalSelectNative({
      placeholder: 'chooseShift',
      label: 'shift',
      searchable: false,
      data: shiftFilterItem,
      onChange: (value) => {
        setDataRitageMovingState({
          dataRitageMovingState: {
            page: 1,
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
      onSearchChange: setHeavyEquipmentSeacrhTerm,
      searchValue: heavyEquipmentSeacrhTerm,
      onChange: (value) => {
        setDataRitageMovingState({
          dataRitageMovingState: {
            page: 1,
            filtercompanyHeavyEquipmentId: value,
          },
        });
      },
      value: filtercompanyHeavyEquipmentId
        ? filtercompanyHeavyEquipmentId
        : undefined,
    });

    const item: InputControllerNativeProps[] = [
      dateItem,
      ritageProblematic,
      shiftItem,
      heavyEquipmentItem,
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heavyEquipmentItemFilter, shiftFilterItem]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: movingRitagesData,
          fetching: movingRitagesDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                movingRitagesData && movingRitagesData.indexOf(record) + 1,
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
              accessor: 'fromDome',
              title: t('commonTypography.fromDome'),
              render: ({ fromDome }) => fromDome?.name ?? '-',
            },
            {
              accessor: 'toStockpile',
              title: t('commonTypography.toStockpile'),
              render: ({ toDome }) => toDome?.stockpile?.name ?? '-',
            },
            {
              accessor: 'toDome',
              title: t('commonTypography.toDome'),
              render: ({ toDome }) => toDome?.name ?? '-',
            },
            {
              accessor: 'tonByRitage',
              title: t('commonTypography.tonByRitage'),
              render: ({ tonByRitage }) => tonByRitage ?? '-',
            },
            {
              accessor: 'sampleNumber',
              title: t('commonTypography.sampleNumber'),
              render: ({ sampleNumber }) => sampleNumber ?? '-',
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
                                `/input-data/production/data-ritage/moving/read/${id}`
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
                                `/input-data/production/data-ritage/moving/update/${id}`
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
                label: t('ritageMoving.createRitageMoving'),
                onClick: () => setIsOpenSelectionModal((prev) => !prev),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page || 1,
          totalAllData: movingRitagesDataMeta?.totalAllData ?? 0,
          totalData: movingRitagesDataMeta?.totalData ?? 0,
          totalPage: movingRitagesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    movingRitagesData,
    movingRitagesDataLoading,
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
              label: t('ritageMoving.createRitageMoving'),
              onClick: () => setIsOpenSelectionModal((prev) => !prev),
            }
          : undefined
      }
      filterDateWithSelect={{
        colSpan: 4,
        items: filter,
      }}
      downloadButton={[
        {
          label: t('ritageMoving.downloadTemplateMoving'),
          url: `/moving-ritages/file`,
          fileName: 'template-moving',
          trackDownloadAction: () => {
            sendGAEvent({
              event: 'Unduh',
              params: {
                category: 'Produksi',
                subSubCategory:
                  'Produksi - Data Ritase - Moving - Template Input',
                subCategory: 'Produksi - Data Ritase - Moving',
                account: userAuthData?.email ?? '',
              },
            });
          },
        },
        {
          label: t('commonTypography.downloadReference'),
          url: `/download/references`,
          fileName: 'referensi-moving',
          trackDownloadAction: () => {
            sendGAEvent({
              event: 'Unduh',
              params: {
                category: 'Produksi',
                subSubCategory:
                  'Produksi - Data Ritase - Moving - Template Referensi',
                subCategory: 'Produksi - Data Ritase - Moving',
                account: userAuthData?.email ?? '',
              },
            });
          },
        },
      ]}
    >
      {renderTable}
      <ListDataRitageDumptruckBook
        data={movingDumpTruckRitagesData}
        meta={movingDumpTruckRitagesDataMeta}
        fetching={movingDumpTruckRitagesDataLoading}
        page={pageDumptruck || 1}
        setPage={(v) => {
          setDataRitageMovingState({
            dataRitageMovingDumptruckState: {
              page: v,
            },
          });
        }}
        tabs="moving"
        setDate={(v) => {
          setDataRitageMovingState({
            dataRitageMovingDumptruckState: {
              filterDate: v,
            },
          });
        }}
        date={filterDateDumptruck || null}
        urlDetail="/input-data/production/data-ritage/moving/read/dump-truck"
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
                subSubCategory: 'Produksi - Data Ritase - Moving - Modal Input',
                subCategory: 'Produksi - Data Ritase - Moving',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-ritage/moving/create');
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
                  'Produksi - Data Ritase - Moving - Modal Unggah',
                subCategory: 'Produksi - Data Ritase - Moving',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-ritage/moving/upload');
          },
        }}
      />
    </DashboardCard>
  );
};

export default ListDataMovingRitageBook;
