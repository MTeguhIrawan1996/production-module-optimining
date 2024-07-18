import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
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

import { useDeleteOreRitage } from '@/services/graphql/mutation/ore-ritage/useDeleteOreRitage';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import {
  IOreRitagesRequest,
  useReadAllRitageOre,
} from '@/services/graphql/query/ore-ritage/useReadAllOreRitage';
import { useReadAllRitageOreDT } from '@/services/graphql/query/ore-ritage/useReadAllOreRitageDT';
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

const ListDataOreRitageBook = () => {
  const router = useRouter();
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });
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
      fromPitId,
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
  const [filterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon],
    shallow
  );

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-ore-ritage');
  const isPermissionUpdate = permissions?.includes('update-ore-ritage');
  const isPermissionDelete = permissions?.includes('delete-ore-ritage');
  const isPermissionRead = permissions?.includes('read-ore-ritage');
  /* #   /**=========== Query =========== */

  const startDateString = formatDate(startDate || null, 'YYYY-MM-DD');
  const endDateString = formatDate(endDate || null, 'YYYY-MM-DD');

  const defaultRefatchOre: Partial<IOreRitagesRequest> = {
    shiftId: filterShift || null,
    isRitageProblematic: filterStatus
      ? filterStatus === 'true'
        ? false
        : true
      : null,
    companyHeavyEquipmentId: filtercompanyHeavyEquipmentId || null,
    fromPitId: fromPitId || null,
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
    oreDumpTruckRitagesData,
    oreDumpTruckRitagesDataMeta,
    oreDumpTruckRitagesDataLoading,
    refetchOreDumpTruckRitages,
  } = useReadAllRitageOreDT({
    variables: {
      limit: 10,
      page: pageDumptruck || 1,
      orderDir: 'desc',
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
        ...defaultRefatchOre,
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
    const maxEndDate = dayjs(startDate || undefined)
      .add(dayjs.duration({ days: 29 }))
      .toDate();
    const periodItem = globalSelectPeriodNative({
      label: 'period',
      name: 'period',
      clearable: true,
      onChange: (value) => {
        setDataRitageOreState({
          dataRitageOreState: {
            period: value,
            startDate: null,
            endDate: null,
            year: null,
            month: null,
            week: null,
            fromPitId: null,
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
        setDataRitageOreState({
          dataRitageOreState: {
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
        setDataRitageOreState({
          dataRitageOreState: {
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
        setDataRitageOreState({
          dataRitageOreState: {
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
        setDataRitageOreState({
          dataRitageOreState: {
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
        setDataRitageOreState({
          dataRitageOreState: {
            week: value ? Number(value) : null,
          },
        });
      },
    });

    const ritageProblematic = globalSelectRitageStatusNative({
      label: 'ritageStatus',
      name: 'ritageStatus',
      onChange: (value) => {
        setDataRitageOreState({
          dataRitageOreState: {
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
      skip: tabs !== 'ore',
      onChange: (value) => {
        setDataRitageOreState({
          dataRitageOreState: {
            filterShift: value,
          },
        });
      },
      value: filterShift,
    });
    const heavyEquipmentItem = globalSelectHeavyEquipmentNative({
      name: 'heavyEquipmentCode',
      label: 'heavyEquipmentCode',
      skip: tabs !== 'ore',
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
      onChange: (value) => {
        setDataRitageOreState({
          dataRitageOreState: {
            filtercompanyHeavyEquipmentId: value,
          },
        });
      },
      value: filtercompanyHeavyEquipmentId,
    });
    const fromPitItem = globalSelectLocationNative({
      label: 'pit',
      name: 'fromPitId',
      searchable: true,
      onChange: (value) => {
        setDataRitageOreState({
          dataRitageOreState: {
            fromPitId: value || null,
          },
        });
      },
      value: fromPitId,
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
          selectItem: fromPitItem,
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
    fromPitId,
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
      px={0}
      addButton={
        isPermissionCreate
          ? {
              label: t('ritageOre.createRitageOre'),
              onClick: () => setIsOpenSelectionModal((prev) => !prev),
            }
          : undefined
      }
      otherButton={
        <DownloadButtonRitage
          ritage="ore"
          label="Download"
          reslover={downloadOreProductionValidation}
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
                  fromPitId: fromPitId || null,
                }
              : undefined
          }
        />
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            setDataRitageOreState({
              dataRitageOreState: {
                page: 1,
                period: null,
                startDate: null,
                endDate: null,
                year: null,
                month: null,
                week: null,
                fromPitId: null,
                filterBadgeValue: null,
                filtercompanyHeavyEquipmentId: null,
                filterShift: null,
                filterStatus: null,
              },
            });
            refetchOreRitages({
              page: 1,
              shiftId: null,
              isRitageProblematic: null,
              companyHeavyEquipmentId: null,
              fromPitId: null,
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
            refetchOreRitages({
              page: 1,
              ...defaultRefatchOre,
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

            setDataRitageOreState({
              dataRitageOreState: {
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
