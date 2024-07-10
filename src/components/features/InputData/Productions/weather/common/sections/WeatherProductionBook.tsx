import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';
import { IFilterButtonProps } from '@/components/elements/button/FilterButton';

import { useDeleteWeatherProduction } from '@/services/graphql/mutation/weather-production/useDeleteWeatherProduction';
import { useReadAllWeatherProduction } from '@/services/graphql/query/weather-production/useReadAllWeatherProduction';
import {
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import { formatDate, secondsDuration } from '@/utils/helper/dateFormat';
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
    { page, search, week, year, filterBadgeValue },
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
        week,
        year,
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
    const selectYearItem = globalSelectYearNative({
      name: 'year',
      onChange: (value) => {
        setWeatherProductionState({
          page: 1,
          year: value ? Number(value) : null,
          week: null,
        });
      },
      value: year ? `${year}` : null,
    });
    const selectWeekItem = globalSelectWeekNative({
      name: 'week',
      disabled: !year,
      value: week ? `${week}` : null,
      year: year,
      onChange: (value) => {
        setWeatherProductionState({
          page: 1,
          week: value ? Number(value) : null,
        });
      },
    });

    const item: IFilterButtonProps = {
      filterDateWithSelect: [
        {
          selectItem: selectYearItem,
          col: 6,
          prefix: 'Tahun:',
        },
        {
          selectItem: selectWeekItem,
          col: 6,
        },
      ],
    };
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, week]);

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
      filterBadge={{
        resetButton: {
          onClick: () => {
            setWeatherProductionState({
              page: 1,
              filterBadgeValue: null,
              year: null,
              week: null,
            });
            refetchWeatherData({
              page: 1,
              year: null,
              week: null,
            });
          },
        },
        value: filterBadgeValue,
      }}
      filter={{
        filterDateWithSelect: filter.filterDateWithSelect,
        filterButton: {
          disabled: week || year ? false : true,
          onClick: () => {
            refetchWeatherData({
              page: 1,
              year,
              week,
            });
            const badgeFilterValue = newNormalizedFilterBadge({
              filter: filter.filterDateWithSelect || [],
              data: filterDataCommon,
            });
            setWeatherProductionState({
              page: 1,
              filterBadgeValue: badgeFilterValue || null,
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
