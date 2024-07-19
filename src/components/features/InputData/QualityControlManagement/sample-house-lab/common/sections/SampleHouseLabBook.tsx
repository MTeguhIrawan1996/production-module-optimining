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
} from '@/components/elements';
import { IFilterButtonProps } from '@/components/elements/button/FilterButton';
import DownloadButtonSampleHouseLab from '@/components/features/InputData/QualityControlManagement/sample-house-lab/common/elements/DownloadButtonSampleHouseLab';

import { useDeleteSampleHouseLab } from '@/services/graphql/mutation/sample-house-lab/useDeleteSampleHouseLab';
import {
  IHouseSampleAndLabsRequest,
  useReadAllSampleHouseLab,
} from '@/services/graphql/query/sample-house-lab/useReadAllSampleHouseLab';
import {
  globalDateNative,
  globalSelectMonthNative,
  globalSelectPeriodNative,
  globalSelectSampleTypeNative,
  globalSelectShiftNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
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

const SampleHouseLabBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [filterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
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
      week,
      year,
      month,
      sampleTypeId,
      shiftId,
      filterBadgeValue,
    },
    setSampleHouseLabState,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
      state.sampleHouseLabState,
      state.setSampleHouseLabState,
    ],
    shallow
  );
  const [id, setId] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(search, 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes(
    'create-house-sample-and-lab'
  );
  const isPermissionUpdate = permissions?.includes(
    'update-house-sample-and-lab'
  );
  const isPermissionDelete = permissions?.includes(
    'delete-house-sample-and-lab'
  );
  const isPermissionRead = permissions?.includes('read-house-sample-and-lab');

  /* #   /**=========== Query =========== */

  const startDateString = formatDate(startDate || null, 'YYYY-MM-DD');
  const endDateString = formatDate(endDate || null, 'YYYY-MM-DD');

  const defaultRefetchSampleHouseAndLab: Partial<IHouseSampleAndLabsRequest> = {
    sampleTypeId: sampleTypeId || null,
    shiftId: shiftId || null,
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
    houseSampleAndLabsData,
    houseSampleAndLabsDataLoading,
    houseSampleAndLabsDataMeta,
    refetchHouseSampleAndLabs,
  } = useReadAllSampleHouseLab({
    variables: {
      limit: 10,
      page: 1,
      orderDir: 'desc',
      orderBy: 'sampleDate',
    },
  });

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(
      new Set<ISliceName>(['sampleHouseLabSlice'] as ISliceName[])
    );
  }, []);

  React.useEffect(() => {
    if (hasHydrated) {
      refetchHouseSampleAndLabs({
        page,
        ...defaultRefetchSampleHouseAndLab,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const [executeDelete, { loading }] = useDeleteSampleHouseLab({
    onCompleted: () => {
      setIsOpenDeleteConfirmation((prev) => !prev);
      setSampleHouseLabState({ page: 1 });
      refetchHouseSampleAndLabs({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('sampleHouseLab.successDeleteMessage'),
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
    setSampleHouseLabState({ page });
    refetchHouseSampleAndLabs({ page });
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
        setSampleHouseLabState({
          period: value,
          startDate: null,
          endDate: null,
          year: null,
          month: null,
          sampleTypeId: null,
          shiftId: null,
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
        setSampleHouseLabState({
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
        setSampleHouseLabState({
          endDate: value || null,
        });
      },
      value: endDate,
    });

    const yearItem = globalSelectYearNative({
      name: 'year',
      withAsterisk: true,
      onChange: (value) => {
        setSampleHouseLabState({
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
        setSampleHouseLabState({
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
      year: year,
      month: month,
      disabled: !year,
      value: week ? `${week}` : null,
      onChange: (value) => {
        setSampleHouseLabState({
          week: value ? Number(value) : null,
        });
      },
    });
    const shiftItem = globalSelectShiftNative({
      label: 'shift',
      name: 'shiftId',
      searchable: false,
      onChange: (value) => {
        setSampleHouseLabState({
          shiftId: value,
        });
      },
      value: shiftId,
    });
    const sampleTypeItem = globalSelectSampleTypeNative({
      label: 'sampleType',
      name: 'sampleTypeId',
      searchable: false,
      onChange: (value) => {
        setSampleHouseLabState({
          sampleTypeId: value,
        });
      },
      value: sampleTypeId,
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
          selectItem: sampleTypeItem,
          col: 6,
        },
        {
          selectItem: shiftItem,
          col: 6,
        },
      ],
    };
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate, month, period, sampleTypeId, shiftId, startDate, week, year]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: houseSampleAndLabsData,
          fetching: houseSampleAndLabsDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                houseSampleAndLabsData &&
                houseSampleAndLabsData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'sampleDate',
              title: t('commonTypography.sampleDate'),
              render: ({ sampleDate }) => formatDate(sampleDate) ?? '-',
            },
            {
              accessor: 'shift',
              title: t('commonTypography.shift'),
              width: 120,
              render: ({ shift }) => shift?.name,
            },
            {
              accessor: 'sampleNumber',
              title: t('commonTypography.sampleNumber'),
            },
            {
              accessor: 'sampleType',
              title: t('commonTypography.sampleType'),
              render: ({ sampleType }) => sampleType?.name,
            },
            {
              accessor: 'sampleEnterLabAt',
              title: t('commonTypography.sampleEnterLabAt'),
              render: ({ sampleEnterLabAt }) =>
                formatDate(sampleEnterLabAt) ?? '-',
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
                                `/input-data/quality-control-management/sample-house-lab/read/${id}`
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
                                `/input-data/quality-control-management/sample-house-lab/update/${id}`
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
                label: t('sampleHouseLab.createSample'),
                onClick: () =>
                  router.push(
                    '/input-data/quality-control-management/sample-house-lab/create'
                  ),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: houseSampleAndLabsDataMeta?.totalAllData ?? 0,
          totalData: houseSampleAndLabsDataMeta?.totalData ?? 0,
          totalPage: houseSampleAndLabsDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    houseSampleAndLabsData,
    houseSampleAndLabsDataLoading,
    isPermissionDelete,
    isPermissionRead,
    isPermissionUpdate,
    isPermissionCreate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  const isDisabled = () => {
    const otherValue = [sampleTypeId, shiftId];
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
              label: t('sampleHouseLab.createSample'),
              onClick: () =>
                router.push(
                  '/input-data/quality-control-management/sample-house-lab/create'
                ),
            }
          : undefined
      }
      otherButton={
        <DownloadButtonSampleHouseLab
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
                  sampleTypeId: sampleTypeId || null,
                  shiftId: shiftId || null,
                }
              : undefined
          }
        />
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            setSampleHouseLabState({
              page: 1,
              period: null,
              startDate: null,
              endDate: null,
              year: null,
              month: null,
              week: null,
              sampleTypeId: null,
              shiftId: null,
              filterBadgeValue: null,
            });
            refetchHouseSampleAndLabs({
              page: 1,
              sampleTypeId: null,
              shiftId: null,
              timeFilter: undefined,
              timeFilterType: undefined,
            });
          },
        },
        value: filterBadgeValue,
      }}
      filter={{
        filterDateWithSelect: filter.filterDateWithSelect,
        filterButton: {
          disabled: isDisabled(),
          onClick: () => {
            refetchHouseSampleAndLabs({
              page: 1,
              ...defaultRefetchSampleHouseAndLab,
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

            setSampleHouseLabState({
              page: 1,
              filterBadgeValue:
                rangePeriod.length >= 1 ? rangePeriod : badgeFilterValue,
            });
          },
        },
      }}
      searchBar={{
        placeholder: t('sampleHouseLab.searchPlaceholder'),
        onChange: (e) => {
          setSampleHouseLabState({ search: e.currentTarget.value });
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setSampleHouseLabState({ page: 1 });
          refetchHouseSampleAndLabs({
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
    </DashboardCard>
  );
};

export default SampleHouseLabBook;
