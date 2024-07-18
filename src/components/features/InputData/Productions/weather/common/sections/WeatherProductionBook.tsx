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
import DownloadButtonWeatherProd from '@/components/features/InputData/Productions/weather/common/elements/DownloadButtonWeatherProd';

import { useDeleteWeatherProduction } from '@/services/graphql/mutation/weather-production/useDeleteWeatherProduction';
import {
  IReadAllWeatherProductionRequest,
  useReadAllWeatherProduction,
} from '@/services/graphql/query/weather-production/useReadAllWeatherProduction';
import {
  globalDateNative,
  globalSelectMonthNative,
  globalSelectPeriodNative,
  globalSelectShiftNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import { formatDate, secondsDuration } from '@/utils/helper/dateFormat';
import dayjs from '@/utils/helper/dayjs.config';
import { newNormalizedFilterBadge } from '@/utils/helper/normalizedFilterBadge';
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const WeatherProductionBook = () => {
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
      filterBadgeValue,
    },
    setWeatherProductionState,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
      state.weatherProductionState,
      state.setWeatherProductionState,
    ],
    shallow
  );
  const [id, setId] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(search, 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-weather-data');
  const isPermissionUpdate = permissions?.includes('update-weather-data');
  const isPermissionDelete = permissions?.includes('delete-weather-data');
  const isPermissionRead = permissions?.includes('read-weather-data');

  const startDateString = formatDate(startDate || null, 'YYYY-MM-DD');
  const endDateString = formatDate(endDate || null, 'YYYY-MM-DD');

  const defaultRefetchWeatherProduction: Partial<IReadAllWeatherProductionRequest> =
    {
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

  /* #   /**=========== Query =========== */
  const {
    weatherData,
    weatherDataLoading,
    weatherDataMeta,
    refetchWeatherData,
  } = useReadAllWeatherProduction({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'date',
      search: searchQuery === '' ? null : searchQuery,
    },
  });

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(
      new Set<ISliceName>(['weatherProductionSlice'] as ISliceName[])
    );
  }, []);

  React.useEffect(() => {
    if (hasHydrated) {
      refetchWeatherData({
        ...defaultRefetchWeatherProduction,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const [executeDelete, { loading }] = useDeleteWeatherProduction({
    onCompleted: () => {
      refetchWeatherData();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setWeatherProductionState({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('weatherProd.successDeleteMessage'),
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
    setWeatherProductionState({ page });
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
        setWeatherProductionState({
          period: value,
          startDate: null,
          endDate: null,
          year: null,
          month: null,
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
        setWeatherProductionState({
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
        setWeatherProductionState({
          endDate: value || null,
        });
      },
      value: endDate,
    });

    const yearItem = globalSelectYearNative({
      name: 'year',
      withAsterisk: true,
      onChange: (value) => {
        setWeatherProductionState({
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
        setWeatherProductionState({
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
        setWeatherProductionState({
          week: value ? Number(value) : null,
        });
      },
    });
    const shiftItem = globalSelectShiftNative({
      label: 'shift',
      name: 'shiftId',
      searchable: false,
      onChange: (value) => {
        setWeatherProductionState({
          shiftId: value,
        });
      },
      value: shiftId,
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
          col: 12,
        },
      ],
    };
    return item;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterDataCommon,
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
          records: weatherData,
          fetching: weatherDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                weatherData && weatherData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'date',
              title: t('commonTypography.date'),
              width: 160,
              render: ({ date }) => formatDate(date) ?? '-',
            },
            {
              accessor: 'location',
              title: t('commonTypography.location'),
              render: ({ location }) => location?.name ?? '-',
            },
            {
              accessor: 'hourAmountRain',
              title: t('commonTypography.hourAmountRain'),
              render: ({ detailWeatherData }) =>
                secondsDuration(detailWeatherData.rainTotal) ?? '-',
            },
            {
              accessor: 'hourAmountSlippery',
              title: t('commonTypography.hourAmountSlippery'),
              render: ({ detailWeatherData }) =>
                secondsDuration(detailWeatherData.slipperyTotal) ?? '-',
            },
            {
              accessor: 'loseTime',
              title: t('commonTypography.loseTime'),
              render: ({ detailWeatherData }) =>
                secondsDuration(detailWeatherData.loseTotal) ?? '-',
            },
            {
              accessor: 'availabilityHoursOrDays',
              title: t('commonTypography.availabilityHoursOrDays'),
              render: ({ detailWeatherData }) =>
                detailWeatherData.availabilityHourPerDay ?? '-',
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
                                `/input-data/production/data-weather/read/${id}`
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
                                `/input-data/production/data-weather/update/${id}`
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
                label: t('weatherProd.createWeatherProd'),
                onClick: () =>
                  router.push('/input-data/production/data-weather/create'),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: weatherDataMeta?.totalAllData ?? 0,
          totalData: weatherDataMeta?.totalData ?? 0,
          totalPage: weatherDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    weatherData,
    weatherDataLoading,
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
              label: t('weatherProd.createWeatherProd'),
              onClick: () =>
                router.push('/input-data/production/data-weather/create'),
            }
          : undefined
      }
      otherButton={
        <DownloadButtonWeatherProd
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
                }
              : undefined
          }
        />
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            setWeatherProductionState({
              page: 1,
              period: null,
              startDate: null,
              endDate: null,
              year: null,
              month: null,
              week: null,
              shiftId: null,
              filterBadgeValue: null,
            });
            refetchWeatherData({
              page: 1,
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
            refetchWeatherData({
              page: 1,
              ...defaultRefetchWeatherProduction,
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

            setWeatherProductionState({
              page: 1,
              filterBadgeValue:
                rangePeriod.length >= 1 ? rangePeriod : badgeFilterValue,
            });
          },
        },
      }}
      searchBar={{
        placeholder: t('weatherProd.searchPlaceholder'),
        onChange: (e) => {
          setWeatherProductionState({ search: e.currentTarget.value });
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setWeatherProductionState({ page: 1 });
          refetchWeatherData({ page: 1 });
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

export default WeatherProductionBook;
