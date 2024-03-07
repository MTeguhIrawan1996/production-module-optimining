import { Badge } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useReadAllMap } from '@/services/graphql/query/input-data-map/useReadAllMap';
import { useReadAllMapCategory } from '@/services/graphql/query/input-data-map/useReadAllMapCategory';
import {
  globalSelectLocationNative,
  globalSelectNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';

import { InputControllerNativeProps } from '@/types/global';

const ListWeeklyMapBook = () => {
  const router = useRouter();
  const page = Number(router.query['weeklyMapPage']) || 1;
  const url = `/input-data/production/map?weeklyMapPage=${page}&tabs=weekly`;
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const { t } = useTranslation('default');
  const [mapCategory, setMapCategory] = React.useState<string | undefined>(
    undefined
  );
  const [year, setYear] = React.useState<string | undefined>(undefined);
  const [week, setWeek] = React.useState<string | undefined>(undefined);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const { mapData, mapMeta, mapDataLoading } = useReadAllMap({
    variables: {
      page: page,
      limit: 10,
      search: searchQuery === '' ? null : searchQuery,
      dateType: 'WEEK',
      mapDataCategoryId: mapCategory,
      year: Number(year),
      week: Number(week),
    },
    skip: false,
  });
  const [mapCategoryList, setMapCategoryList] = React.useState<
    Array<{
      label: string;
      value: string;
    }>
  >([]);

  useReadAllMapCategory({
    variables: {
      limit: 100,
    },
    onCompleted: (data) => {
      setMapCategoryList(
        data?.mapDataCategories.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        }) || []
      );
    },
  });

  const handleDelete = async () => {
    notifications.show({
      title: t('deleteSuccess'),
      message: t('deleteSuccessMessage'),
      color: 'teal',
      icon: <IconCheck />,
    });
  };

  const handleSetPage = (page: number) => {
    const urlSet = `/input-data/production/map?weeklyMapPage=${page}&tabs=weekly`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const filter = React.useMemo(() => {
    const mapTypeItem = globalSelectNative({
      placeholder: 'chooseMapType',
      label: 'mapType',
      searchable: false,
      data: mapCategoryList,
      onChange: (v) => {
        setMapCategory(v || undefined);
      },
    });
    const locationItem = globalSelectLocationNative({
      label: 'location',
      searchable: true,
      onChange: () => {
        router.push(url, undefined, { shallow: true });
      },
    });
    const yearItem = globalSelectYearNative({
      placeholder: 'year',
      label: 'year',
      searchable: true,
      onChange: (v) => {
        setYear(v || undefined);
      },
    });
    const weekItem = globalSelectWeekNative({
      placeholder: 'week',
      label: 'week',
      searchable: true,
      onChange: (v) => {
        setWeek(v || undefined);
      },
    });

    const item: InputControllerNativeProps[] = [
      mapTypeItem,
      locationItem,
      yearItem,
      weekItem,
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, mapCategoryList]);

  return (
    <DashboardCard
      addButton={{
        label: t('mapProduction.createMapProd'),
        onClick: () => router.push('/input-data/production/map/weekly/create'),
      }}
      filterDateWithSelect={{
        colSpan: 4,
        items: filter,
      }}
      searchBar={{
        placeholder: t('mapProduction.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
        },
      }}
    >
      <MantineDataTable
        tableProps={{
          records: mapData,
          fetching: mapDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              width: 60,
            },
            {
              accessor: 'name',
              title: `${t('commonTypography.name')} ${t(
                'commonTypography.map'
              )}`,
              width: 160,
            },
            {
              accessor: 'type',
              title: `${t('commonTypography.type')} ${t(
                'commonTypography.map'
              )}`,
              render: (v) => v.mapDataCategory.name,
            },
            {
              accessor: 'year',
              title: t('commonTypography.year'),
            },
            {
              accessor: 'week',
              title: t('commonTypography.week'),
            },
            {
              accessor: 'location',
              title: t('commonTypography.location'),
              render: (v) =>
                v.mapDataLocation.map((e) => (
                  <Badge key={e.locationId}>{e.name}</Badge>
                )),
            },
            {
              accessor: 'status',
              title: t('commonTypography.status'),
              render: (v) =>
                match(v.status)
                  .with('WAITING_FOR_CONFIRMATION', () => (
                    <Badge color="orange">
                      {t('commonTypography.waitingForConfirmation')}
                    </Badge>
                  ))
                  .with('VALID', () => (
                    <Badge color="green">{t('commonTypography.valid')}</Badge>
                  ))
                  .with('INVALID', () => (
                    <Badge color="red">{t('commonTypography.notValid')}</Badge>
                  ))
                  .with('ACCEPTED', () => (
                    <Badge color="red">{t('commonTypography.accepted')}</Badge>
                  ))
                  .otherwise(() => (
                    <Badge color="gray">{t('commonTypography.unknown')}</Badge>
                  )),
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/input-data/production/map/read/${id}`);
                      },
                    }}
                    actionUpdate={undefined}
                    actionDelete={undefined}
                  />
                );
              },
            },
          ],
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('mapProduction.createMapProd'),
            onClick: () => router.push('/input-data/production/map/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: mapMeta?.totalAllData ?? 0,
          totalData: mapMeta?.totalData ?? 0,
          totalPage: mapMeta?.totalPage ?? 0,
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

export default ListWeeklyMapBook;
