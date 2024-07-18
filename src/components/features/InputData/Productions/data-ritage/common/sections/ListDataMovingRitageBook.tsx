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

import { useDeleteMovingRitage } from '@/services/graphql/mutation/moving-ritage/useDeleteMovingRitage';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import {
  IReadAllRitageMovingRequest,
  useReadAllRitageMoving,
} from '@/services/graphql/query/moving-ritage/useReadAllMovingRitage';
import { useReadAllRitageMovingDT } from '@/services/graphql/query/moving-ritage/useReadAllMovingRitageDT';
import {
  globalDateNative,
  globalSelectHeavyEquipmentNative,
  globalSelectMonthNative,
  globalSelectPeriodNative,
  globalSelectRitageStatusNative,
  globalSelectShiftNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import { downloadTopsoilProductionValidation } from '@/utils/form-validation/ritage/ritage-topsoil-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { formatDate } from '@/utils/helper/dateFormat';
import dayjs from '@/utils/helper/dayjs.config';
import { newNormalizedFilterBadge } from '@/utils/helper/normalizedFilterBadge';
import useControlPanel from '@/utils/store/useControlPanel';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ListDataMovingRitageBook = () => {
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
    setDataRitageMovingState,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
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

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-moving-ritage');
  const isPermissionUpdate = permissions?.includes('update-moving-ritage');
  const isPermissionDelete = permissions?.includes('delete-moving-ritage');
  const isPermissionRead = permissions?.includes('read-moving-ritage');

  /* #   /**=========== Query =========== */

  const startDateString = formatDate(startDate || null, 'YYYY-MM-DD');
  const endDateString = formatDate(endDate || null, 'YYYY-MM-DD');

  const defaultRefatchMoving: Partial<IReadAllRitageMovingRequest> = {
    shiftId: filterShift || null,
    isRitageProblematic: filterStatus
      ? filterStatus === 'true'
        ? false
        : true
      : null,
    companyHeavyEquipmentId: filtercompanyHeavyEquipmentId || null,
    timeFilterType: period
      ? period === 'DATE_RANGE'
        ? period
        : 'PERIOD'
      : undefined,
    timeFilter: {
      startDate: startDateString || undefined,
      endDate: endDateString || undefined,
      year: year ? Number(year) : undefined,
      week: week ? Number(week) : undefined,
      month: month ? Number(month) : undefined,
    },
  };

  const {
    movingDumpTruckRitagesData,
    movingDumpTruckRitagesDataLoading,
    movingDumpTruckRitagesDataMeta,
    refetchmovingDumpTruckRitages,
  } = useReadAllRitageMovingDT({
    variables: {
      limit: 10,
      page: 1,
      orderDir: 'desc',
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
      page: 1,
      orderDir: 'desc',
    },
    skip: tabs !== 'moving',
  });

  React.useEffect(() => {
    if (hasHydrated) {
      refetchMovingRitages({
        page,
        ...defaultRefatchMoving,
      });
      refetchmovingDumpTruckRitages({
        page: pageDumptruck,
        date: formatDate(filterDateDumptruck, 'YYYY-MM-DD') || null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const [executeDelete, { loading }] = useDeleteMovingRitage({
    onCompleted: () => {
      setIsOpenDeleteConfirmation((prev) => !prev);
      setDataRitageMovingState({
        dataRitageMovingState: {
          page: 1,
        },
      });
      refetchMovingRitages({ page: 1 });
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
        page,
      },
    });
    refetchMovingRitages({ page });
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
        setDataRitageMovingState({
          dataRitageMovingState: {
            period: value,
            startDate: null,
            endDate: null,
            year: null,
            month: null,
            week: null,
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
        setDataRitageMovingState({
          dataRitageMovingState: {
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
        setDataRitageMovingState({
          dataRitageMovingState: {
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
        setDataRitageMovingState({
          dataRitageMovingState: {
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
        setDataRitageMovingState({
          dataRitageMovingState: {
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
      disabled: !month,
      year: year,
      month: month,
      value: week ? `${week}` : null,
      onChange: (value) => {
        setDataRitageMovingState({
          dataRitageMovingState: {
            week: value ? Number(value) : null,
          },
        });
      },
    });

    const ritageProblematic = globalSelectRitageStatusNative({
      label: 'ritageStatus',
      name: 'ritageStatus',
      onChange: (value) => {
        setDataRitageMovingState({
          dataRitageMovingState: {
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
      skip: tabs !== 'moving',
      onChange: (value) => {
        setDataRitageMovingState({
          dataRitageMovingState: {
            filterShift: value,
          },
        });
      },
      value: filterShift,
    });
    const heavyEquipmentItem = globalSelectHeavyEquipmentNative({
      name: 'heavyEquipmentCode',
      label: 'heavyEquipmentCode',
      skip: tabs !== 'moving',
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
      onChange: (value) => {
        setDataRitageMovingState({
          dataRitageMovingState: {
            filtercompanyHeavyEquipmentId: value,
          },
        });
      },
      value: filtercompanyHeavyEquipmentId,
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
          col: 12,
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
              label: t('ritageMoving.createRitageMoving'),
              onClick: () => setIsOpenSelectionModal((prev) => !prev),
            }
          : undefined
      }
      otherButton={
        <DownloadButtonRitage
          ritage="moving"
          label="Download"
          reslover={downloadTopsoilProductionValidation}
          period={isApply ? period || undefined : undefined}
          defaultValuesState={
            isApply /* Check isAplly by filter badge length */
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
                }
              : undefined
          }
        />
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            setDataRitageMovingState({
              dataRitageMovingState: {
                page: 1,
                period: null,
                startDate: null,
                endDate: null,
                year: null,
                month: null,
                week: null,
                filterBadgeValue: null,
                filtercompanyHeavyEquipmentId: null,
                filterShift: null,
                filterStatus: null,
              },
            });
            refetchMovingRitages({
              page: 1,
              shiftId: null,
              isRitageProblematic: null,
              companyHeavyEquipmentId: null,
              timeFilter: undefined,
              timeFilterType: undefined,
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
            refetchMovingRitages({
              page: 1,
              ...defaultRefatchMoving,
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

            setDataRitageMovingState({
              dataRitageMovingState: {
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
          refetchmovingDumpTruckRitages({ page: v });
        }}
        tabs="moving"
        setDate={(v) => {
          setDataRitageMovingState({
            dataRitageMovingDumptruckState: {
              filterDate: v || null,
            },
          });
        }}
        date={filterDateDumptruck || undefined}
        urlDetail="/input-data/production/data-ritage/moving/read/dump-truck"
        filterBadgeValue={filterBadgeValueDT}
        onFilter={() => {
          refetchmovingDumpTruckRitages({
            page: 1,
            date: formatDate(filterDateDumptruck, 'YYYY-MM-DD') || null,
          });
          const date = formatDate(filterDateDumptruck);
          setDataRitageMovingState({
            dataRitageMovingDumptruckState: {
              page: 1,
              filterBadgeValue: date ? [date] : [],
            },
          });
        }}
        onReset={() => {
          setDataRitageMovingState({
            dataRitageMovingDumptruckState: {
              page: 1,
              filterBadgeValue: null,
              filterDate: null,
            },
          });
          refetchmovingDumpTruckRitages({
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
