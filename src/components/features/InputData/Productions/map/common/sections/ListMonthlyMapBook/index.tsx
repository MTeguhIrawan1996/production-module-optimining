import { Badge } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteMap } from '@/services/graphql/mutation/input-data-map/useDeleteMap';
import { useReadAllMap } from '@/services/graphql/query/input-data-map/useReadAllMap';
import { useReadAllMapCategory } from '@/services/graphql/query/input-data-map/useReadAllMapCategory';
import {
  globalSelectLocationNative,
  globalSelectMonthNative,
  globalSelectNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { InputControllerNativeProps } from '@/types/global';

const locationIds = [
  process.env.NEXT_PUBLIC_GRID_ID,
  process.env.NEXT_PUBLIC_BLOCK_ID,
  process.env.NEXT_PUBLIC_PIT_ID,
];

const ListMonthlyMapBook = () => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-map-data');
  const isPermissionUpdate = permissions?.includes('update-map-data');
  const isPermissionDelete = permissions?.includes('delete-map-data');
  const isPermissionRead = permissions?.includes('read-map-data');

  const [mapMonthlyPage, setMapMonthlyPage] = useQueryState(
    'mapMonthlyPage',
    queryTypes.integer.withDefault(1)
  );
  const [mapMonthlyLocation, setMapMonthlyLocation] =
    useQueryState('mapMonthlyLocation');
  const [mapMonthlyYear, setMapMonthlyYear] = useQueryState('mapMonthlyYear');
  const [mapMonthlyMonth, setMapMonthlyMonth] =
    useQueryState('mapMonthlyMonth');
  const [mapMonthlySearch, setMapMonthlySearch] = useQueryState(
    'mapMonthlySearch',
    queryTypes.string.withDefault('')
  );

  const searchQuery = useDebounce((mapMonthlySearch as string) || '', 500);

  const { t } = useTranslation('default');
  const [mapMonthlyCategory, setMapMonthlyCategory] =
    useQueryState('mapMonthlyCategory');

  const [id, setId] = React.useState<string | undefined>(undefined);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const { mapData, mapMeta, mapDataLoading, refetchMap } = useReadAllMap({
    variables: {
      page: mapMonthlyPage || 1,
      limit: 15,
      search: searchQuery === '' ? null : searchQuery,
      dateType: 'MONTH',
      mapDataCategoryId: mapMonthlyCategory || undefined,
      year: Number(mapMonthlyYear) === 0 ? undefined : Number(mapMonthlyYear),
      month:
        Number(mapMonthlyMonth) === 0 ? undefined : Number(mapMonthlyMonth),
      mapDataLocationId: (mapMonthlyLocation as string) || undefined,
    },
    skip: false,
  });

  const [executeDelete, { loading }] = useDeleteMap({
    onCompleted: () => {
      refetchMap();
      setIsOpenDeleteConfirmation((prev) => !prev);
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('location.successDeleteMessage'),
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
    await executeDelete({
      variables: {
        id: id as string,
      },
    });
    setId(undefined);
  };
  const handleSetPage = (page: number) => {
    setMapMonthlyPage(page);
  };

  const filter = React.useMemo(() => {
    const mapTypeItem = globalSelectNative({
      placeholder: 'chooseMapType',
      label: 'mapType',
      searchable: false,
      data: mapCategoryList,
      onChange: (v) => {
        setMapMonthlyCategory(v);
        setMapMonthlyPage(1);
      },
      value: mapMonthlyCategory,
    });
    const locationItem = globalSelectLocationNative({
      label: 'location',
      searchable: true,
      onChange: (v) => {
        setMapMonthlyLocation(v);
        setMapMonthlyPage(1);
      },
      categoryIds: (locationIds as string[]) || [],
      value: mapMonthlyLocation,
    });
    const yearItem = globalSelectYearNative({
      placeholder: 'year',
      label: 'year',
      searchable: true,
      onChange: (v) => {
        setMapMonthlyYear(v);
        setMapMonthlyPage(1);
      },
    });
    const monthItem = globalSelectMonthNative({
      placeholder: 'month',
      label: 'month',
      searchable: true,
      onChange: (v) => {
        setMapMonthlyMonth(v);
        setMapMonthlyPage(1);
      },
      value: mapMonthlyMonth,
    });

    const item: InputControllerNativeProps[] = [
      mapTypeItem,
      locationItem,
      yearItem,
      monthItem,
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapCategoryList]);

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              onClick: () => {
                router.push('/input-data/production/map/monthly/create');
              },
              label: t('mapProduction.createMapProd'),
            }
          : undefined
      }
      filterDateWithSelect={{
        colSpan: 4,
        items: filter,
      }}
      searchBar={{
        placeholder: t('mapProduction.searchPlaceholder'),
        onChange: (e) => {
          setMapMonthlySearch(e.target.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setMapMonthlyPage(1);
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
              accessor: 'month',
              title: t('commonTypography.month'),
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
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/production/map/monthly/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionUpdate={
                      isPermissionUpdate
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/production/map/monthly/update/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionDelete={
                      isPermissionDelete
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
            onClick: () => router.push('/input-data/production/map/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: (mapMonthlyPage as number) || 1,
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

export default ListMonthlyMapBook;
