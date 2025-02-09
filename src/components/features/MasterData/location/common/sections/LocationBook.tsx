import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';
import { IFilterButtonProps } from '@/components/elements/button/FilterButton';

import { useDeleteLocationMaster } from '@/services/graphql/mutation/location/useDeleteLocationMaster';
import { useReadAllLocationCategory } from '@/services/graphql/query/global-select/useReadAllLocationCategory ';
import { useReadAllLocationsMaster } from '@/services/graphql/query/location/useReadAllLocationMaster';
import { normalizedFilterBadge } from '@/utils/helper/normalizedFilterBadge';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const LocationBook = () => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const [
    hasHydrated,
    { page, categoryId, search, filterBadgeValue },
    setPage,
    setCategoryId,
    setSearchLocation,
    setFilterBadgeLocation,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
      state.locationState,
      state.setLoactionPage,
      state.setCategoryId,
      state.setSearchLocation,
      state.setFilterBadgeLocation,
    ],
    shallow
  );
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [searchQuery] = useDebouncedValue<string>(search, 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [catgeorySearchTerm, setCatgeorySearchTerm] =
    React.useState<string>('');
  const [categorySearchQuery] = useDebouncedValue<string>(
    catgeorySearchTerm,
    400
  );

  const isPermissionCreate = permissions?.includes('create-location');
  const isPermissionUpdate = permissions?.includes('update-location');
  const isPermissionDelete = permissions?.includes('delete-location');
  const isPermissionRead = permissions?.includes('read-location');

  /* #   /**=========== Query =========== */
  const {
    locationsData,
    locationsDataLoading,
    locationsDataMeta,
    refetchLocations,
  } = useReadAllLocationsMaster({
    variables: {
      limit: 10,
      page: 1,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
  });

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(new Set<ISliceName>(['locationSlice'] as ISliceName[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (hasHydrated) {
      refetchLocations({
        page: page,
        categoryId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const { locationCategoriesdata } = useReadAllLocationCategory({
    variables: {
      limit: 15,
      search: categorySearchQuery === '' ? null : categorySearchQuery,
      excludeIds: [
        `${process.env.NEXT_PUBLIC_OTHER_LOCATION_ID}`,
        `${process.env.NEXT_PUBLIC_DOME_ID}`,
        `${process.env.NEXT_PUBLIC_BLOCK_ID}`,
        `${process.env.NEXT_PUBLIC_STOCKPILE_ID}`,
        `${process.env.NEXT_PUBLIC_PIT_ID}`,
      ],
    },
  });

  const [executeDelete, { loading }] = useDeleteLocationMaster({
    onCompleted: () => {
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage({ page: 1 });
      refetchLocations({ page: 1 });
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
  /* #endregion  /**======== Query =========== */

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
      },
    });
  };

  const handleSetPage = (page: number) => {
    setPage({ page });
    refetchLocations({
      page,
    });
  };

  const { uncombinedItem: locationCategoryItems } = useFilterItems({
    data: locationCategoriesdata ?? [],
  });

  const filter = React.useMemo(() => {
    const item: IFilterButtonProps = {
      multipleFilter: [
        {
          selectItem: {
            onChange: (value) => {
              setCategoryId({ categoryId: value });
            },
            data: locationCategoryItems ?? [],
            value: categoryId,
            label: 'locationCategory',
            placeholder: 'chooseLocationCategory',
            searchable: true,
            nothingFound: null,
            clearable: true,
            onSearchChange: setCatgeorySearchTerm,
            searchValue: catgeorySearchTerm,
          },
          col: 6,
        },
      ],
    };
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, catgeorySearchTerm, locationCategoryItems]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: locationsData,
          fetching: locationsDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                locationsData && locationsData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'handBookId',
              title: t('commonTypography.locationId'),
            },
            {
              accessor: 'name',
              title: t('commonTypography.locationName'),
            },
            {
              accessor: 'type',
              title: t('commonTypography.locationCategory'),
              render: ({ category }) => category?.name ?? '-',
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(`/master-data/location/read/${id}`);
                            },
                          }
                        : undefined
                    }
                    actionUpdate={
                      isPermissionUpdate
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(`/master-data/location/update/${id}`);
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
          actionButton: isPermissionCreate
            ? {
                label: t('location.createLocation'),
                onClick: () => router.push('/master-data/location/create'),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: locationsDataMeta?.totalAllData ?? 0,
          totalData: locationsDataMeta?.totalData ?? 0,
          totalPage: locationsDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    locationsData,
    locationsDataLoading,
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
              label: t('location.createLocation'),
              onClick: () => router.push('/master-data/location/create'),
            }
          : undefined
      }
      searchBar={{
        placeholder: t('location.searchPlaceholder'),
        onChange: (e) => {
          setSearchLocation({ search: e.currentTarget.value });
        },
        searchQuery: searchQuery,
        value: search,
        onSearch: () => {
          setPage({ page: 1 });
          refetchLocations({
            page: 1,
            search: searchQuery === '' ? null : searchQuery,
          });
        },
      }}
      filterBadge={{
        resetButton: {
          onClick: () => {
            setPage({ page: 1 });
            setCategoryId({ categoryId: null });
            setFilterBadgeLocation({
              filterBadgeValue: null,
            });
            refetchLocations({
              page: 1,
              categoryId: null,
            });
          },
        },
        value: filterBadgeValue,
      }}
      filter={{
        multipleFilter: filter.multipleFilter,
        filterButton: {
          disabled: categoryId ? false : true,
          onClick: () => {
            setPage({ page: 1 });
            refetchLocations({
              page: 1,
              categoryId,
            });
            const badgeFilterValue = normalizedFilterBadge(
              filter.multipleFilter || []
            );
            setFilterBadgeLocation({
              filterBadgeValue: badgeFilterValue || null,
            });
          },
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
          description: t('commonTypography.alertDescConfirmDeleteMasterData'),
        }}
        withDivider
      />
    </DashboardCard>
  );
};

export default LocationBook;
