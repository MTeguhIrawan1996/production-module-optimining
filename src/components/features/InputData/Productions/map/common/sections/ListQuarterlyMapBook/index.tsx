import { Badge } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteMap } from '@/services/graphql/mutation/input-data-map/useDeleteMap';
import { useReadAllMap } from '@/services/graphql/query/input-data-map/useReadAllMap';
import { useReadAllMapCategory } from '@/services/graphql/query/input-data-map/useReadAllMapCategory';
import {
  globalSelectLocationNative,
  globalSelectNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { InputControllerNativeProps } from '@/types/global';

const locationIds = [
  process.env.NEXT_PUBLIC_GRID_ID,
  process.env.NEXT_PUBLIC_BLOCK_ID,
  process.env.NEXT_PUBLIC_PIT_ID,
];

const ListQuarterlyMapBook = () => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-map-data');
  const isPermissionUpdate = permissions?.includes('update-map-data');
  const isPermissionDelete = permissions?.includes('delete-map-data');
  const isPermissionRead = permissions?.includes('read-map-data');

  const [mapQuarterlyPage, setMapQuarterlyPage] = useQueryState(
    'mapQuarterlyPage',
    parseAsInteger
  );
  const [mapQuarterlyLocation, setMapQuarterlyLocation] = useQueryState(
    'mapQuarterlyLocation',
    parseAsString
  );
  const [mapQuarterlyYear, setMapQuarterlyYear] = useQueryState(
    'mapQuarterlyYear',
    parseAsString
  );
  const [mapQuarterlyQuarter, setMapQuarterlyQuarter] = useQueryState(
    'mapQuarterlyQuarter',
    parseAsString
  );
  const [mapQuarterlySearch, setMapQuarterlySearch] = useQueryState(
    'mapQuarterlySearch',
    parseAsString
  );

  const [searchQuery] = useDebouncedValue<string>(
    (mapQuarterlySearch as string) || '',
    500
  );

  const { t } = useTranslation('default');
  const [mapQuarterlyCategory, setMapQuarterlyCategory] = useQueryState(
    'mapQuarterlyCategory',
    parseAsString
  );

  const [id, setId] = React.useState<string | undefined>(undefined);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const { mapData, mapMeta, mapDataLoading, refetchMap } = useReadAllMap({
    variables: {
      page: mapQuarterlyPage || 1,
      limit: 10,
      search: searchQuery === '' ? null : searchQuery,
      dateType: 'QUARTER',
      mapDataCategoryId: mapQuarterlyCategory || undefined,
      year:
        Number(mapQuarterlyYear) === 0 ? undefined : Number(mapQuarterlyYear),
      quarter:
        Number(mapQuarterlyQuarter) === 0
          ? undefined
          : Number(mapQuarterlyQuarter),
      mapDataLocationId: (mapQuarterlyLocation as string) || undefined,
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
    setMapQuarterlyPage(page);
  };

  const filter = React.useMemo(() => {
    const mapTypeItem = globalSelectNative({
      placeholder: 'chooseMapType',
      label: 'mapType',
      searchable: false,
      data: mapCategoryList,
      onChange: (v) => {
        setMapQuarterlyCategory(v);
      },
      value: mapQuarterlyCategory,
    });
    const locationItem = globalSelectLocationNative({
      label: 'location',
      searchable: true,
      onChange: (v) => {
        setMapQuarterlyLocation(v);
      },
      categoryIds: (locationIds as string[]) || [],
      value: mapQuarterlyLocation,
    });
    const yearItem = globalSelectYearNative({
      placeholder: 'year',
      label: 'year',
      searchable: true,
      onChange: (v) => {
        setMapQuarterlyYear(v);
      },
    });
    const quarterItem = globalSelectNative({
      placeholder: 'quarter',
      label: 'quarterly',
      searchable: true,
      onChange: (v) => {
        setMapQuarterlyQuarter(v);
      },
      data: [
        {
          label: '1',
          value: '1',
        },
        {
          label: '2',
          value: '2',
        },
        {
          label: '3',
          value: '3',
        },
        {
          label: '4',
          value: '4',
        },
      ],
      value: mapQuarterlyQuarter,
    });

    const item: InputControllerNativeProps[] = [
      mapTypeItem,
      locationItem,
      yearItem,
      quarterItem,
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
                router.push('/input-data/production/map/quarterly/create');
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
          setMapQuarterlySearch(e.target.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setMapQuarterlyPage(1);
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
              accessor: 'quarter',
              title: t('commonTypography.quarter'),
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
                  .with('DETERMINED', () => (
                    <Badge color="green">{t('commonTypography.valid')}</Badge>
                  ))
                  .with('WAITING_FOR_VALIDATION', () => (
                    <Badge color="red">{t('commonTypography.notValid')}</Badge>
                  ))
                  .with('INVALID', () => (
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
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/production/map/quarterly/${id}`
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
                                `/input-data/production/map/quarterly/update/${id}`
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
          currentPage: (mapQuarterlyPage as number) || 1,
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

export default ListQuarterlyMapBook;
