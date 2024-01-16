import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/id';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteWeatherProduction } from '@/services/graphql/mutation/weather-production/useDeleteWeatherProduction';
import { useReadAllWeatherProduction } from '@/services/graphql/query/weather-production/useReadAllWeatherProduction';
import {
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import { formatDate } from '@/utils/helper/dateFormat';

import { InputControllerNativeProps } from '@/types/global';

const WeatherProductionBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const url = `/input-data/production/data-weather?page=1`;
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [year, setYear] = React.useState<number | null>(null);
  const [week, setWeek] = React.useState<number | null>(null);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

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
      search: searchQuery === '' ? null : searchQuery,
      year,
      week,
    },
  });

  const [executeDelete, { loading }] = useDeleteWeatherProduction({
    onCompleted: () => {
      refetchWeatherData();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push(url, undefined, { shallow: true });
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
    const urlSet = `/input-data/production/data-weather?page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const filter = React.useMemo(() => {
    const selectYearItem = globalSelectYearNative({
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setYear(value ? Number(value) : null);
        setWeek(null);
      },
    });
    const selectWeekItem = globalSelectWeekNative({
      disabled: !year,
      value: week ? `${week}` : null,
      year: year,
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setWeek(value ? Number(value) : null);
      },
    });

    const item: InputControllerNativeProps[] = [selectYearItem, selectWeekItem];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, year, week]);

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
              render: ({ location }) => location?.name,
            },
            {
              accessor: 'hourAmountRain',
              title: t('commonTypography.hourAmountRain'),
              render: ({ detailWeatherData }) =>
                detailWeatherData.rainTotal ?? '-',
            },
            {
              accessor: 'hourAmountSlippery',
              title: t('commonTypography.hourAmountSlippery'),
              render: ({ detailWeatherData }) =>
                detailWeatherData.slipperyTotal ?? '-',
            },
            {
              accessor: 'loseTime',
              title: t('commonTypography.loseTime'),
              render: ({ detailWeatherData }) =>
                detailWeatherData.loseTotal ?? '-',
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
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/input-data/production/data-weather/read/${id}`
                        );
                      },
                    }}
                    actionUpdate={
                      status?.id !==
                      `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`
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
                      status?.id !==
                      `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`
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
          actionButton: {
            label: t('weatherProd.createWeatherProd'),
            onClick: () =>
              router.push('/input-data/production/data-weather/create'),
          },
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
  }, [weatherData, weatherDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={{
        label: t('weatherProd.createWeatherProd'),
        onClick: () =>
          router.push('/input-data/production/data-weather/create'),
      }}
      filterDateWithSelect={{
        colSpan: 3,
        items: filter,
      }}
      searchBar={{
        placeholder: t('weatherProd.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
        },
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
