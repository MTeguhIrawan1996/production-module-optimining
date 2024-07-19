import { Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
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
import DownloadButtonHeavyEquipmentProd from '@/components/features/InputData/Productions/heavy-equipment/common/elements/DownloadButtonHeavyEquipmentProd';

import { useDeleteHeavyEquipmentProduction } from '@/services/graphql/mutation/heavy-equipment-production/useDeleteHeavyEquipmentProduction';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import {
  IReadAllHeavyEquipmentProductionRequest,
  useReadAllHeavyEquipmentProduction,
} from '@/services/graphql/query/heavy-equipment-production/useReadAllHeavyEquipmentProduction';
import {
  globalDateNative,
  globalSelectHeavyEquipmentNative,
  globalSelectMonthNative,
  globalSelectPeriodNative,
  globalSelectShiftNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import { sendGAEvent } from '@/utils/helper/analytics';
import { formatDate } from '@/utils/helper/dateFormat';
import dayjs from '@/utils/helper/dayjs.config';
import { newNormalizedFilterBadge } from '@/utils/helper/normalizedFilterBadge';
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const HeavyEquipmentProductionBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [filterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon],
    shallow
  );
  const [
    hasHydrated,
    {
      page,
      search,
      period,
      startDate,
      endDate,
      year,
      month,
      week,
      shiftId,
      companyHeavyEquipmentId,
      filterBadgeValue,
    },
    setHeavyEquipmentProductionState,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
      state.heavyEquipmentProductionState,
      state.setHeavyEquipmentProductionState,
    ],
    shallow
  );
  const [id, setId] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(search, 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);

  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes(
    'create-heavy-equipment-data'
  );
  const isPermissionUpdate = permissions?.includes(
    'update-heavy-equipment-data'
  );
  const isPermissionDelete = permissions?.includes(
    'delete-heavy-equipment-data'
  );
  const isPermissionRead = permissions?.includes('read-heavy-equipment-data');

  /* #   /**=========== Query =========== */

  const startDateString = formatDate(startDate || null, 'YYYY-MM-DD');
  const endDateString = formatDate(endDate || null, 'YYYY-MM-DD');

  const defaultRefatchHEProduction: Partial<IReadAllHeavyEquipmentProductionRequest> =
    {
      shiftId: shiftId || null,
      companyHeavyEquipmentId: companyHeavyEquipmentId || null,
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
    heavyEquipmentData,
    heavyEquipmentDataLoading,
    heavyEquipmentDataMeta,
    refetchHeavyEquipmentData,
  } = useReadAllHeavyEquipmentProduction({
    variables: {
      limit: 10,
      page: 1,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
  });

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(
      new Set<ISliceName>(['heavyEquipmentProductionSlice'] as ISliceName[])
    );
  }, []);

  React.useEffect(() => {
    if (hasHydrated) {
      refetchHeavyEquipmentData({
        page,
        ...defaultRefatchHEProduction,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const [executeDelete, { loading }] = useDeleteHeavyEquipmentProduction({
    onCompleted: () => {
      setIsOpenDeleteConfirmation((prev) => !prev);
      setHeavyEquipmentProductionState({ page: 1 });
      refetchHeavyEquipmentData({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipmentProd.successDeleteMessage'),
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
    setHeavyEquipmentProductionState({ page });
    refetchHeavyEquipmentData({ page });
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
        setHeavyEquipmentProductionState({
          period: value,
          startDate: null,
          endDate: null,
          year: null,
          month: null,
          shiftId: null,
          companyHeavyEquipmentId: null,
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
        setHeavyEquipmentProductionState({
          startDate: value || null,
          endDate: null,
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
        setHeavyEquipmentProductionState({
          endDate: value || null,
        });
      },
      value: endDate,
    });

    const yearItem = globalSelectYearNative({
      name: 'year',
      withAsterisk: true,
      onChange: (value) => {
        setHeavyEquipmentProductionState({
          year: value ? Number(value) : null,
          month: null,
          week: null,
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
        setHeavyEquipmentProductionState({
          month: value ? Number(value) : null,
          week: null,
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
        setHeavyEquipmentProductionState({
          week: value ? Number(value) : null,
        });
      },
    });
    const shiftItem = globalSelectShiftNative({
      label: 'shift',
      name: 'shiftId',
      searchable: false,
      onChange: (value) => {
        setHeavyEquipmentProductionState({
          shiftId: value,
        });
      },
      value: shiftId,
    });
    const heavyEquipmentItem = globalSelectHeavyEquipmentNative({
      name: 'heavyEquipmentCode',
      label: 'heavyEquipmentCode',
      skip: filterDataCommon.some((v) => v.key === 'heavyEquipmentCode'),
      onChange: (value) => {
        setHeavyEquipmentProductionState({
          companyHeavyEquipmentId: value,
        });
      },
      value: companyHeavyEquipmentId,
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
          selectItem: heavyEquipmentItem,
          col: 6,
        },
      ],
    };
    return item;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterDataCommon,
    companyHeavyEquipmentId,
    endDate,
    month,
    period,
    shiftId,
    startDate,
    week,
    year,
  ]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: heavyEquipmentData,
          fetching: heavyEquipmentDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                heavyEquipmentData && heavyEquipmentData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'date',
              title: t('commonTypography.date'),
              width: 160,
              render: ({ date }) => formatDate(date) ?? '-',
            },
            {
              accessor: 'heavyEquipmentType',
              title: t('commonTypography.heavyEquipmentType'),
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment.heavyEquipment.reference.type.name,
            },
            {
              accessor: 'heavyEquipmentCode',
              title: t('commonTypography.heavyEquipmentCode'),
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment.hullNumber,
            },
            {
              accessor: 'operator',
              title: t('commonTypography.operator'),
              width: 150,
              render: ({ operator }) => operator.humanResource.name,
            },
            {
              accessor: 'shift',
              title: t('commonTypography.shift'),
              render: ({ shift }) => shift?.name,
            },
            {
              accessor: 'foreman',
              title: t('commonTypography.foreman'),
              width: 150,
              render: ({ foreman }) => foreman.humanResource.name,
            },
            {
              accessor: 'heavyEquipmentStatus',
              title: t('commonTypography.heavyEquipmentStatus'),
              render: ({ isHeavyEquipmentProblematic }) => (
                <GlobalBadgeStatus
                  color={isHeavyEquipmentProblematic ? 'red.6' : 'brand.6'}
                  label={
                    isHeavyEquipmentProblematic
                      ? t('commonTypography.problem')
                      : t('commonTypography.unProblem')
                  }
                />
              ),
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
                                `/input-data/production/data-heavy-equipment/read/${id}`
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
                                `/input-data/production/data-heavy-equipment/update/${id}`
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
                label: t('heavyEquipmentProd.createHeavyEquipmentProd'),
                onClick: () =>
                  router.push(
                    '/input-data/production/data-heavy-equipment/create'
                  ),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: heavyEquipmentDataMeta?.totalAllData ?? 0,
          totalData: heavyEquipmentDataMeta?.totalData ?? 0,
          totalPage: heavyEquipmentDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    heavyEquipmentData,
    heavyEquipmentDataLoading,
    isPermissionDelete,
    isPermissionRead,
    isPermissionUpdate,
    isPermissionCreate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  const isDisabled = () => {
    const otherValue = [shiftId, companyHeavyEquipmentId];
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

    return !otherValue.some((v) => typeof v === 'string');
  };

  const isApply = filterBadgeValue && filterBadgeValue?.length >= 1;

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              label: t('heavyEquipmentProd.createHeavyEquipmentProd'),
              onClick: () => setIsOpenSelectionModal((prev) => !prev),
            }
          : undefined
      }
      otherButton={
        <DownloadButtonHeavyEquipmentProd
          label="Download"
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
                  shiftId: shiftId || null,
                  companyHeavyEquipmentId: companyHeavyEquipmentId || null,
                }
              : undefined
          }
        />
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            setHeavyEquipmentProductionState({
              page: 1,
              period: null,
              startDate: null,
              endDate: null,
              year: null,
              month: null,
              week: null,
              companyHeavyEquipmentId: null,
              shiftId: null,
              filterBadgeValue: null,
            });
            refetchHeavyEquipmentData({
              page: 1,
              shiftId: null,
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
            refetchHeavyEquipmentData({
              page: 1,
              ...defaultRefatchHEProduction,
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

            setHeavyEquipmentProductionState({
              page: 1,
              filterBadgeValue:
                rangePeriod.length >= 1 ? rangePeriod : badgeFilterValue,
            });
          },
        },
      }}
      searchBar={{
        placeholder: t('heavyEquipmentProd.searchPlaceholder'),
        onChange: (e) => {
          setHeavyEquipmentProductionState({ search: e.currentTarget.value });
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setHeavyEquipmentProductionState({ page: 1 });
          refetchHeavyEquipmentData({
            page: 1,
            search: searchQuery || null,
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
      <SelectionButtonModal
        isOpenSelectionModal={isOpenSelectionModal}
        actionSelectionModal={() => setIsOpenSelectionModal((prev) => !prev)}
        firstButton={{
          label: t('commonTypography.inputDataProductionHeavyEquipment'),
          onClick: () => {
            sendGAEvent({
              event: 'Tambah',
              params: {
                category: 'Produksi',
                subCategory: 'Produksi - Alat Berat - Modal Input',
                subSubCategory: '',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-heavy-equipment/create');
          },
        }}
        secondButton={{
          label: t('commonTypography.uploadFile'),
          onClick: () => {
            sendGAEvent({
              event: 'Tambah',
              params: {
                category: 'Produksi',
                subCategory: 'Produksi - Alat Berat - Modal Unggah',
                subSubCategory: '',
                account: userAuthData?.email ?? '',
              },
            });
            router.push('/input-data/production/data-heavy-equipment/upload');
          },
        }}
      />
    </DashboardCard>
  );
};

export default HeavyEquipmentProductionBook;
