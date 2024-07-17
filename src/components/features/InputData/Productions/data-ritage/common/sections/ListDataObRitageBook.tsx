import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  DashboardCard,
  GlobalAlert,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
  SelectionButtonModal,
} from '@/components/elements';
import { IFilterButtonProps } from '@/components/elements/button/FilterButton';
import DownloadButtonRitage from '@/components/features/InputData/Productions/data-ritage/common/elements/DownloadButtonRitage';
import ListDataRitageDumptruckBook from '@/components/features/InputData/Productions/data-ritage/common/elements/ListDataRitageDumptruckBook';

import { useDeleteOverburdenRitage } from '@/services/graphql/mutation/ob-ritage/useDeleteObRitage';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadAllRitageOB } from '@/services/graphql/query/ob-ritage/useReadAllObRitage';
import { useReadAllRitageObDT } from '@/services/graphql/query/ob-ritage/useReadAllObRitageDT';
import {
  globalDateNative,
  globalSelectHeavyEquipmentNative,
  globalSelectLocationNative,
  globalSelectMonthNative,
  globalSelectPeriodNative,
  globalSelectRitageStatusNative,
  globalSelectShiftNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import { downloadOreProductionValidation } from '@/utils/form-validation/ritage/ritage-ore-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { formatDate } from '@/utils/helper/dateFormat';
import dayjs from '@/utils/helper/dayjs.config';
import { newNormalizedFilterBadge } from '@/utils/helper/normalizedFilterBadge';
import useControlPanel from '@/utils/store/useControlPanel';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ListDataObRitageBook = () => {
  const router = useRouter();
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  const [filterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon],
    shallow
  );

  const [
    hasHydrated,
    {
      page,
      period,
      startDate,
      endDate,
      year,
      month,
      week,
      locationId,
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

  const defaultRefatchOb = {
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
  };

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
        ...defaultRefatchOb,
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
    const maxEndDate = dayjs(startDate || undefined)
      .add(dayjs.duration({ days: 29 }))
      .toDate();
    const periodItem = globalSelectPeriodNative({
      label: 'period',
      name: 'period',
      clearable: true,
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            period: value,
            startDate: null,
            endDate: null,
            year: null,
            month: null,
            week: null,
            locationId: null,
            filterStatus: null,
            filterShift: null,
            filtercompanyHeavyEquipmentId: null,
          },
        });
      },
      value: period,
    });
    const startDateItem = globalDateNative({
      label: 'startDate2',
      name: 'startDate',
      placeholder: 'chooseDate',
      clearable: true,
      withAsterisk: true,
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            startDate: value || null,
            endDate: null,
          },
        });
      },
      value: startDate,
    });
    const endDateItem = globalDateNative({
      label: 'endDate2',
      name: 'endDate',
      placeholder: 'chooseDate',
      clearable: true,
      disabled: !startDate,
      withAsterisk: true,
      maxDate: maxEndDate,
      minDate: startDate || undefined,
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            endDate: value || null,
          },
        });
      },
      value: endDate,
    });
    const yearItem = globalSelectYearNative({
      name: 'year',
      withAsterisk: true,
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            year: value ? Number(value) : null,
            month: null,
            week: null,
          },
        });
      },
      value: year ? `${year}` : null,
    });

    const monthItem = globalSelectMonthNative({
      placeholder: 'month',
      label: 'month',
      name: 'month',
      withAsterisk: true,
      disabled: !year,
      value: month ? `${month}` : null,
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            month: value ? Number(value) : null,
            week: null,
          },
        });
      },
    });

    const weekItem = globalSelectWeekNative({
      placeholder: 'week',
      label: 'week',
      name: 'week',
      searchable: false,
      withAsterisk: true,
      year: year,
      month: month,
      value: week ? `${week}` : null,
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            week: value ? Number(value) : null,
          },
        });
      },
    });
    const ritageProblematic = globalSelectRitageStatusNative({
      label: 'ritageStatus',
      name: 'ritageStatus',
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            filterStatus: value,
          },
        });
      },
      value: filterStatus ? String(filterStatus) : null,
    });
    const shiftItem = globalSelectShiftNative({
      label: 'shift',
      name: 'shiftId',
      searchable: false,
      skip: tabs !== 'ob',
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            filterShift: value,
          },
        });
      },
      value: filterShift,
    });
    const heavyEquipmentItem = globalSelectHeavyEquipmentNative({
      name: 'heavyEquipmentCode',
      label: 'heavyEquipmentCode',
      skip: tabs !== 'ob',
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            filtercompanyHeavyEquipmentId: value,
          },
        });
      },
      value: filtercompanyHeavyEquipmentId,
    });
    const locationItem = globalSelectLocationNative({
      label: 'pit',
      name: 'location',
      searchable: true,
      onChange: (value) => {
        setDataRitageOBState({
          dataRitageOBState: {
            locationId: value || null,
          },
        });
      },
      value: locationId,
      categoryIds: [`${process.env.NEXT_PUBLIC_PIT_ID}`],
    });

    const periodDateRange = [
      {
        selectItem: startDateItem,
        col: 6,
      },
      {
        selectItem: endDateItem,
        col: 6,
        otherElement: () => (
          <GlobalAlert
            description={
              <Text fw={500} color="orange.4">
                Maksimal Rentang Waktu Dalam 30 Hari
              </Text>
            }
            color="orange.5"
            mt="xs"
            py={4}
          />
        ),
      },
    ];

    const periodYear = [
      {
        selectItem: yearItem,
        col: period === 'YEAR' ? 12 : 6,
        prefix: 'Tahun:',
      },
    ];

    const periodMoth = [
      ...periodYear,
      {
        selectItem: monthItem,
        col: 6,
      },
    ];

    const periodWeek = [
      ...periodMoth,
      {
        selectItem: weekItem,
        col: 12,
      },
    ];

    const item: IFilterButtonProps = {
      filterDateWithSelect: [
        {
          selectItem: periodItem,
          col: 12,
          prefix: 'Periode:',
        },
        ...(period === 'DATE_RANGE' ? periodDateRange : []),
        ...(period === 'YEAR' ? periodYear : []),
        ...(period === 'MONTH' ? periodMoth : []),
        ...(period === 'WEEK' ? periodWeek : []),
        {
          selectItem: shiftItem,
          col: 6,
        },
        {
          selectItem: ritageProblematic,
          col: 6,
          prefix: 'Ritase',
        },
        {
          selectItem: heavyEquipmentItem,
          col: 6,
        },
        {
          selectItem: locationItem,
          col: 6,
        },
      ],
    };
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    endDate,
    filterShift,
    filterStatus,
    filtercompanyHeavyEquipmentId,
    locationId,
    month,
    period,
    startDate,
    tabs,
    week,
    year,
  ]);

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

  const isDisabled = () => {
    if (period === 'DATE_RANGE') {
      return !endDate;
    }

    if (period === 'YEAR') {
      return !year;
    }
    if (period === 'MONTH') {
      return !month;
    }
    if (period === 'WEEK') {
      return !week;
    }

    return true;
  };

  const isApply = filterBadgeValue && filterBadgeValue?.length >= 1;

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
      otherButton={
        <DownloadButtonRitage
          ritage="ob"
          label="Download"
          reslover={downloadOreProductionValidation}
          period={isApply ? period || undefined : undefined}
          defaultValuesState={
            isApply
              ? {
                  period: period || 'DATE_RANGE',
                  startDate: startDate || null,
                  endDate: endDate || null,
                  year: year ? `${year}` : null,
                  month: month ? `${month}` : null,
                  week: week ? `${week}` : null,
                  shiftId: filterShift || null,
                  heavyEquipmentCode: filtercompanyHeavyEquipmentId || null,
                  ritageStatus: filterStatus,
                  locationId: locationId || null,
                }
              : undefined
          }
        />
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
              },
            });
            refetchOverburdenRitages({
              page: 1,
              shiftId: null,
              isRitageProblematic: null,
              companyHeavyEquipmentId: null,
            });
          },
        },
        value: filterBadgeValue || null,
      }}
      filter={{
        filterDateWithSelect: filter.filterDateWithSelect,
        filterButton: {
          disabled: isDisabled(),
          onClick: () => {
            refetchOverburdenRitages({
              page: 1,
              ...defaultRefatchOb,
            });
            const badgeFilterValue = newNormalizedFilterBadge({
              filter: filter.filterDateWithSelect || [],
              data: filterDataCommon || [],
            });
            const newStartDate = formatDate(startDate);
            const newEndDate = formatDate(endDate);
            const dateBadgeValue = [`${newStartDate} - ${newEndDate}`];

            const rangePeriod =
              period === 'DATE_RANGE'
                ? [
                    ...badgeFilterValue.slice(0, 1),
                    ...dateBadgeValue,
                    ...badgeFilterValue.slice(1),
                  ]
                : [];

            setDataRitageOBState({
              dataRitageOBState: {
                page: 1,
                filterBadgeValue:
                  rangePeriod.length >= 1 ? rangePeriod : badgeFilterValue,
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
