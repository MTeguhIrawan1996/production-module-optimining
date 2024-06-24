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

import { useDeleteTopsoilRitage } from '@/services/graphql/mutation/topsoil-ritage/useDeleteTopsoilRitage';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadAllHeavyEquipmentSelect } from '@/services/graphql/query/global-select/useReadAllHeavyEquipmentSelect';
import { useReadAllShiftMaster } from '@/services/graphql/query/shift/useReadAllShiftMaster';
import { useReadAllRitageTopsoil } from '@/services/graphql/query/topsoil-ritage/useReadAllTopsoilRitage';
import { useReadAllRitageTopsoilDT } from '@/services/graphql/query/topsoil-ritage/useReadAllTopsoilRitageDT';
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

const ListDataTopsoilRitageBook = () => {
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
    setDataRitageTopsoilState,
  ] = useControlPanel(
    (state) => [
      state.dataRitageTopsoilState,
      state.dataRitageTopsoilDumptruckState,
      state.setDataRitageTopsoilState,
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

  const isPermissionCreate = permissions?.includes('create-topsoil-ritage');
  const isPermissionUpdate = permissions?.includes('update-topsoil-ritage');
  const isPermissionDelete = permissions?.includes('delete-topsoil-ritage');
  const isPermissionRead = permissions?.includes('read-topsoil-ritage');
  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(new Set<ISliceName>(['ritageTopSoilSlice'] as ISliceName[]));
  }, []);
  /* #   /**=========== Query =========== */
  const { shiftsData } = useReadAllShiftMaster({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
    skip: tabs !== 'topsoil',
  });

  const { heavyEquipmentSelect } = useReadAllHeavyEquipmentSelect({
    variables: {
      limit: 15,
      search:
        heavyEquipmentSearchQuery === '' ? null : heavyEquipmentSearchQuery,
      isComplete: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
    },
    skip: tabs !== 'topsoil',
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
    topsoilDumpTruckRitagesData,
    topsoilDumpTruckRitagesDataLoading,
    topsoilDumpTruckRitagesDataMeta,
  } = useReadAllRitageTopsoilDT({
    variables: {
      limit: 10,
      page: pageDumptruck || 1,
      orderDir: 'desc',
      date: filterDateDumptruck === '' ? null : filterDateDumptruck,
    },
    skip: tabs !== 'topsoil',
  });

  const {
    topsoilRitagesData,
    topsoilRitagesDataMeta,
    topsoilRitagesDataLoading,
    refetchTopsoilRitages,
  } = useReadAllRitageTopsoil({
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
    skip: tabs !== 'topsoil',
  });

  const [executeDelete, { loading }] = useDeleteTopsoilRitage({
    onCompleted: () => {
      refetchTopsoilRitages();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setDataRitageTopsoilState({
        dataRitageTopsoilState: {
          page: 1,
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('ritageTopsoil.successDeleteMessage'),
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
    setDataRitageTopsoilState({
      dataRitageTopsoilState: {
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
        setDataRitageTopsoilState({
          dataRitageTopsoilState: {
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
        setDataRitageTopsoilState({
          dataRitageTopsoilState: {
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
        setDataRitageTopsoilState({
          dataRitageTopsoilState: {
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
        setDataRitageTopsoilState({
          dataRitageTopsoilState: {
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
          records: topsoilRitagesData,
          fetching: topsoilRitagesDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                topsoilRitagesData && topsoilRitagesData.indexOf(record) + 1,
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
                                `/input-data/production/data-ritage/topsoil/read/${id}`
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
                                `/input-data/production/data-ritage/topsoil/update/${id}`
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
        emptyStateProps={
          isPermissionCreate
            ? {
                title: t('commonTypography.dataNotfound'),
                actionButton: {
                  label: t('ritageTopsoil.createRitageTopsoil'),
                  onClick: () => setIsOpenSelectionModal((prev) => !prev),
                },
              }
            : undefined
        }
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page || 1,
          totalAllData: topsoilRitagesDataMeta?.totalAllData ?? 0,
          totalData: topsoilRitagesDataMeta?.totalData ?? 0,
          totalPage: topsoilRitagesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    topsoilRitagesData,
    topsoilRitagesDataLoading,
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
              label: t('ritageTopsoil.createRitageTopsoil'),
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
          label: t('ritageTopsoil.downloadTemplateTopsoil'),
          url: `/topsoil-ritages/file`,
          fileName: 'template-topsoil',
          trackDownloadAction: () => {
            sendGAEvent({
              event: 'Unduh',
              params: {
                category: 'Produksi',
                subSubCategory:
                  'Produksi - Data Ritase - Topsoil - Template Input',
                subCategory: 'Produksi - Data Ritase - Topsoil',
                account: userAuthData?.email ?? '',
              },
            });
          },
        },
        {
          label: t('commonTypography.downloadReference'),
          url: `/download/references`,
          fileName: 'referensi-topsoil',
          trackDownloadAction: () => {
            sendGAEvent({
              event: 'Unduh',
              params: {
                category: 'Produksi',
                subSubCategory:
                  'Produksi - Data Ritase - Topsoil - Template Referensi',
                subCategory: 'Produksi - Data Ritase - Topsoil',
                account: userAuthData?.email ?? '',
              },
            });
          },
        },
      ]}
    >
      {renderTable}
      <ListDataRitageDumptruckBook
        data={topsoilDumpTruckRitagesData}
        meta={topsoilDumpTruckRitagesDataMeta}
        fetching={topsoilDumpTruckRitagesDataLoading}
        page={pageDumptruck || 1}
        setPage={(v) => {
          setDataRitageTopsoilState({
            dataRitageTopsoilDumptruckState: {
              page: v,
            },
          });
        }}
        tabs="topsoil"
        setDate={(v) => {
          setDataRitageTopsoilState({
            dataRitageTopsoilDumptruckState: {
              filterDate: v,
            },
          });
        }}
        date={filterDateDumptruck || null}
        urlDetail="/input-data/production/data-ritage/topsoil/read/dump-truck"
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
                subSubCategory:
                  'Produksi - Data Ritase - Topsoil - Modal Input',
                subCategory: 'Produksi - Data Ritase - Topsoil',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-ritage/topsoil/create');
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
                  'Produksi - Data Ritase - Topsoil - Modal Unggah',
                subCategory: 'Produksi - Data Ritase - Topsoil',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-ritage/topsoil/upload');
          },
        }}
      />
    </DashboardCard>
  );
};

export default ListDataTopsoilRitageBook;
