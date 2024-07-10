import { Badge } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
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

import { useDeleteMap } from '@/services/graphql/mutation/input-data-map/useDeleteMap';
import { useReadAllMap } from '@/services/graphql/query/input-data-map/useReadAllMap';
import { useReadAllMapCategory } from '@/services/graphql/query/input-data-map/useReadAllMapCategory';
import {
  globalSelectLocationNative,
  globalSelectNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import { newNormalizedFilterBadge } from '@/utils/helper/normalizedFilterBadge';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import useControlPanel from '@/utils/store/useControlPanel';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const locationIds = [
  process.env.NEXT_PUBLIC_GRID_ID,
  process.env.NEXT_PUBLIC_BLOCK_ID,
  process.env.NEXT_PUBLIC_PIT_ID,
];

const ListWeeklyMapBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const [tabs] = useQueryState('tabs', queryTypes.string.withDefault('weekly'));
  const [filterDataCommon, setFilterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon, state.setFilterDataCommon],
    shallow
  );
  const [
    hasHydrated,
    {
      page,
      search,
      week,
      year,
      mapWeeklyCategory,
      mapWeeklyLocation,
      filterBadgeValue,
    },
    setWeeklyMapProductionState,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
      state.weeklyMapProductionState,
      state.setWeeklyMapProductionState,
    ],
    shallow
  );
  const [searchQuery] = useDebouncedValue<string>(search, 500);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const isPermissionCreate = permissions?.includes('create-map-data');
  const isPermissionUpdate = permissions?.includes('update-map-data');
  const isPermissionDelete = permissions?.includes('delete-map-data');
  const isPermissionRead = permissions?.includes('read-map-data');

  const { mapData, mapMeta, mapDataLoading, refetchMap } = useReadAllMap({
    variables: {
      page: page || 1,
      limit: 10,
      search: searchQuery === '' ? null : searchQuery,
      dateType: 'WEEK',
    },
    skip: tabs !== 'weekly',
  });

  React.useEffect(() => {
    if (hasHydrated) {
      refetchMap({
        mapDataCategoryId: mapWeeklyCategory || undefined,
        year: Number(year) === 0 ? undefined : Number(year),
        week: Number(week) === 0 ? undefined : Number(week),
        mapDataLocationId: (mapWeeklyLocation as string) || undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const [executeDelete, { loading }] = useDeleteMap({
    onCompleted: () => {
      refetchMap();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setWeeklyMapProductionState({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('mapProduction.successDeleteMessage'),
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

  useReadAllMapCategory({
    variables: {
      limit: 100,
    },
    onCompleted: (data) => {
      const item = data.mapDataCategories.data.map((val) => {
        return {
          name: val.name || '',
          id: val.id,
        };
      });
      setFilterDataCommon({ key: 'mapType', data: item });
    },
  });

  const { uncombinedItem } = useFilterItems({
    data: filterDataCommon.find((v) => v.key === 'mapType')?.data ?? [],
  });

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id: id as string,
      },
    });
    setId(undefined);
  };
  const handleSetPage = (page: number) => {
    setWeeklyMapProductionState({ page });
  };

  const filter = React.useMemo(() => {
    const mapTypeItem = globalSelectNative({
      name: 'mapType',
      placeholder: 'chooseMapType',
      label: 'mapType',
      searchable: false,
      data: uncombinedItem,
      value: mapWeeklyCategory,
      onChange: (v) => {
        setWeeklyMapProductionState({ mapWeeklyCategory: v });
      },
    });
    const locationItem = globalSelectLocationNative({
      label: 'location',
      name: 'location',
      searchable: true,
      onChange: (v) => {
        setWeeklyMapProductionState({ mapWeeklyLocation: v });
      },
      value: mapWeeklyLocation,
      categoryIds: (locationIds as string[]) || [],
    });
    const yearItem = globalSelectYearNative({
      placeholder: 'year',
      label: 'year',
      name: 'year',
      searchable: true,
      value: year ? `${year}` : null,
      onChange: (v) => {
        setWeeklyMapProductionState({ year: v ? Number(v) : null });
      },
    });
    const weekItem = globalSelectWeekNative({
      placeholder: 'week',
      label: 'week',
      name: 'week',
      searchable: true,
      value: week ? `${week}` : null,
      onChange: (v) => {
        setWeeklyMapProductionState({ week: v ? Number(v) : null });
      },
    });

    const item: IFilterButtonProps = {
      filterDateWithSelect: [
        {
          selectItem: mapTypeItem,
          col: 6,
        },
        {
          selectItem: locationItem,
          col: 6,
          prefix: 'Lokasi:',
        },
        {
          selectItem: yearItem,
          col: 6,
          prefix: 'Tahun:',
        },
        {
          selectItem: weekItem,
          col: 6,
        },
      ],
    };
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uncombinedItem, mapWeeklyCategory, mapWeeklyLocation, week, year]);

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              onClick: () => {
                router.push('/input-data/production/map/weekly/create');
              },
              label: t('mapProduction.createMapProd'),
            }
          : undefined
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            setWeeklyMapProductionState({
              page: 1,
              filterBadgeValue: null,
              year: null,
              week: null,
              mapWeeklyCategory: null,
              mapWeeklyLocation: null,
            });
            refetchMap({
              page: 1,
              mapDataCategoryId: undefined,
              year: undefined,
              week: undefined,
              mapDataLocationId: undefined,
            });
          },
        },
        value: filterBadgeValue,
      }}
      filter={{
        filterDateWithSelect: filter.filterDateWithSelect,
        filterButton: {
          disabled:
            mapWeeklyCategory || mapWeeklyLocation || week || year
              ? false
              : true,
          onClick: () => {
            refetchMap({
              page: 1,
              mapDataCategoryId: mapWeeklyCategory || undefined,
              year: Number(year) === 0 ? undefined : Number(year),
              week: Number(week) === 0 ? undefined : Number(week),
              mapDataLocationId: (mapWeeklyLocation as string) || undefined,
            });
            const badgeFilterValue = newNormalizedFilterBadge({
              filter: filter.filterDateWithSelect || [],
              data: filterDataCommon,
            });
            setWeeklyMapProductionState({
              page: 1,
              filterBadgeValue: badgeFilterValue || null,
            });
          },
        },
      }}
      searchBar={{
        placeholder: t('mapProduction.searchPlaceholder'),
        onChange: (e) => {
          setWeeklyMapProductionState({ search: e.currentTarget.value });
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setWeeklyMapProductionState({ page: 1 });
        },
        value: search,
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
              render: (record) => mapData && mapData.indexOf(record) + 1,
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
              render: ({ mapDataStatus }) => (
                <GlobalBadgeStatus
                  color={mapDataStatus?.color}
                  label={mapDataStatus?.name ?? ''}
                />
              ),
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ id, mapDataStatus }) => {
                return (
                  <GlobalKebabButton
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/production/map/weekly/read/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionUpdate={
                      isPermissionUpdate &&
                      mapDataStatus?.id !==
                        process.env.NEXT_PUBLIC_STATUS_DETERMINED
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/production/map/weekly/update/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionDelete={
                      isPermissionDelete &&
                      mapDataStatus?.id !==
                        process.env.NEXT_PUBLIC_STATUS_DETERMINED
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
            label: t('mapProduction.createMapProd'),
            onClick: () =>
              router.push('/input-data/production/map/weekly/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: (page as number) || 1,
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

export default ListWeeklyMapBook;
