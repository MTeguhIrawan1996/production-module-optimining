import { useDebouncedState } from '@mantine/hooks';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardCard } from '@/components/elements';

import {
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';

import { InputControllerNativeProps } from '@/types/global';

const MapProductionBook = () => {
  const router = useRouter();
  // const page = Number(router.query['page']) || 1;
  const url = `/input-data/production/data-weather?page=1`;
  const { t } = useTranslation('default');
  // const [id, setId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [year, setYear] = React.useState<number | null>(null);
  const [week, setWeek] = React.useState<number | null>(null);
  // const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
  //   React.useState<boolean>(false);

  /* #   /**=========== Query =========== */
  // const {
  //   weatherData,
  //   weatherDataLoading,
  //   weatherDataMeta,
  //   refetchWeatherData,
  // } = useReadAllWeatherProduction({
  //   variables: {
  //     limit: 10,
  //     page: page,
  //     orderDir: 'desc',
  //     search: searchQuery === '' ? null : searchQuery,
  //     year,
  //     week,
  //   },
  // });

  // const [executeDelete, { loading }] = useDeleteWeatherProduction({
  //   onCompleted: () => {
  //     refetchWeatherData();
  //     setIsOpenDeleteConfirmation((prev) => !prev);
  //     router.push(url, undefined, { shallow: true });
  //     notifications.show({
  //       color: 'green',
  //       title: 'Selamat',
  //       message: t('weatherProd.successDeleteMessage'),
  //       icon: <IconCheck />,
  //     });
  //   },
  //   onError: ({ message }) => {
  //     notifications.show({
  //       color: 'red',
  //       title: 'Gagal',
  //       message: message,
  //       icon: <IconX />,
  //     });
  //   },
  // });
  /* #endregion  /**======== Query =========== */

  // const handleDelete = async () => {
  //   await executeDelete({
  //     variables: {
  //       id,
  //     },
  //   });
  // };

  // const handleSetPage = (page: number) => {
  //   const urlSet = `/input-data/production/data-weather?page=${page}`;
  //   router.push(urlSet, undefined, { shallow: true });
  // };

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
      {/* Components */}
      <div className="">PETAA</div>
    </DashboardCard>
  );
};

export default MapProductionBook;
