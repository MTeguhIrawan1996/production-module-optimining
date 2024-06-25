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

import { useDeleteBargingRitage } from '@/services/graphql/mutation/barging-ritage/useDeleteBargingRitage';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadAllRitageBarging } from '@/services/graphql/query/barging-ritage/useReadAllBargingRitage';
import { useReadAllRitageBargingDT } from '@/services/graphql/query/barging-ritage/useReadAllBargingRitageDT';
import { useReadAllHeavyEquipmentSelect } from '@/services/graphql/query/global-select/useReadAllHeavyEquipmentSelect';
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

const ListDataBargingRitageBook = () => {
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
    setDataRitageBargingState,
  ] = useControlPanel(
    (state) => [
      state.dataRitageBargingState,
      state.dataRitageBargingDumptruckState,
      state.setDataRitageBargingState,
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

  const isPermissionCreate = permissions?.includes('create-barging-ritage');
  const isPermissionUpdate = permissions?.includes('update-barging-ritage');
  const isPermissionDelete = permissions?.includes('delete-barging-ritage');
  const isPermissionRead = permissions?.includes('read-barging-ritage');

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(new Set<ISliceName>(['ritageBargingSlice'] as ISliceName[]));
    resetAllSlices(
      new Set<ISliceName>(['ritageBargingDumptruckSlice'] as ISliceName[])
    );
  }, []);

  /* #   /**=========== Query =========== */
  const { shiftsData } = useReadAllShiftMaster({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
    skip: tabs !== 'barging',
  });

  const { heavyEquipmentSelect } = useReadAllHeavyEquipmentSelect({
    variables: {
      limit: 15,
      search:
        heavyEquipmentSearchQuery === '' ? null : heavyEquipmentSearchQuery,
      isComplete: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
    },
    skip: tabs !== 'barging',
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
    bargingDumpTruckRitagesData,
    bargingDumpTruckRitagesDataLoading,
    bargingDumpTruckRitagesDataMeta,
  } = useReadAllRitageBargingDT({
    variables: {
      limit: 10,
      page: pageDumptruck,
      orderDir: 'desc',
      date: formatDate(filterDateDumptruck, 'YYYY-MM-DD') || null,
    },
    skip: tabs !== 'barging',
  });

  const {
    bargingRitagesData,
    bargingRitagesDataLoading,
    bargingRitagesDataMeta,
    refetchBargingRitages,
  } = useReadAllRitageBarging({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
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
    },
    skip: tabs !== 'barging',
  });

  const [executeDelete, { loading }] = useDeleteBargingRitage({
    onCompleted: () => {
      refetchBargingRitages();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setDataRitageBargingState({
        dataRitageBargingState: {
          page: 1,
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('ritageBarging.successDeleteMessage'),
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
    setDataRitageBargingState({
      dataRitageBargingState: {
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
        setDataRitageBargingState({
          dataRitageBargingState: {
            page: 1,
            filterDate: value || null,
          },
        });
      },
      value: filterDate,
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
        setDataRitageBargingState({
          dataRitageBargingState: {
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
        setDataRitageBargingState({
          dataRitageBargingState: {
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
        setDataRitageBargingState({
          dataRitageBargingState: {
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
          records: bargingRitagesData,
          fetching: bargingRitagesDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                bargingRitagesData && bargingRitagesData.indexOf(record) + 1,
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
              accessor: 'fromStcokpile',
              title: t('commonTypography.fromStockpile'),
              render: ({ dome }) => dome?.stockpile?.name ?? '-',
            },
            {
              accessor: 'dome',
              title: t('commonTypography.dome'),
              render: ({ dome }) => dome?.name ?? '-',
            },
            {
              accessor: 'toBarging',
              title: t('commonTypography.toBarging'),
              render: ({ barging }) => barging?.name ?? '-',
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
                                `/input-data/production/data-ritage/barging/read/${id}`
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
                                `/input-data/production/data-ritage/barging/update/${id}`
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
                label: t('ritageBarging.createRitageBarging'),
                onClick: () => setIsOpenSelectionModal((prev) => !prev),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page || 1,
          totalAllData: bargingRitagesDataMeta?.totalAllData ?? 0,
          totalData: bargingRitagesDataMeta?.totalData ?? 0,
          totalPage: bargingRitagesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    bargingRitagesData,
    bargingRitagesDataLoading,
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
              label: t('ritageBarging.createRitageBarging'),
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
          label: t('ritageBarging.downloadTemplateBarging'),
          url: `/barging-ritages/file`,
          fileName: 'template-barging',
          trackDownloadAction: () => {
            sendGAEvent({
              event: 'Unduh',
              params: {
                category: 'Produksi',
                subSubCategory:
                  'Produksi - Data Ritase - Barging - Template Input',
                subCategory: 'Produksi - Data Ritase - Barging',
                account: userAuthData?.email ?? '',
              },
            });
          },
        },
        {
          label: t('commonTypography.downloadReference'),
          url: `/download/references`,
          fileName: 'referensi-barging',
          trackDownloadAction: () => {
            sendGAEvent({
              event: 'Unduh',
              params: {
                category: 'Produksi',
                subSubCategory:
                  'Produksi - Data Ritase - Barging - Template Referensi',
                subCategory: 'Produksi - Data Ritase - Barging',
                account: userAuthData?.email ?? '',
              },
            });
          },
        },
      ]}
    >
      {renderTable}
      <ListDataRitageDumptruckBook
        data={bargingDumpTruckRitagesData}
        meta={bargingDumpTruckRitagesDataMeta}
        page={pageDumptruck || 1}
        setPage={(v) => {
          setDataRitageBargingState({
            dataRitageBargingDumptruckState: {
              page: v,
            },
          });
        }}
        fetching={bargingDumpTruckRitagesDataLoading}
        tabs="barging"
        setDate={(v) => {
          setDataRitageBargingState({
            dataRitageBargingDumptruckState: {
              filterDate: v || null,
              page: 1,
            },
          });
        }}
        date={filterDateDumptruck || undefined}
        urlDetail="/input-data/production/data-ritage/barging/read/dump-truck"
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
                  'Produksi - Data Ritase - Barging - Modal Input',
                subCategory: 'Produksi - Data Ritase - Barging',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-ritage/barging/create');
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
                  'Produksi - Data Ritase - Barging - Modal Unggah',
                subCategory: 'Produksi - Data Ritase - Barging',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-ritage/barging/upload');
          },
        }}
      />
    </DashboardCard>
  );
};

export default ListDataBargingRitageBook;
