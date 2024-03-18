import { SelectProps } from '@mantine/core';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteLocationMaster } from '@/services/graphql/mutation/location/useDeleteLocationMaster';
import { useReadAllLocationCategory } from '@/services/graphql/query/global-select/useReadAllLocationCategory ';
import { useReadAllLocationsMaster } from '@/services/graphql/query/location/useReadAllLocationMaster';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const LocationBook = () => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const [page, setPage] = useQueryState(
    'page',
    queryTypes.integer.withDefault(1)
  );
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [catgeorySearchTerm, setCatgeorySearchTerm] =
    React.useState<string>('');
  const [categorySearchQuery] = useDebouncedValue<string>(
    catgeorySearchTerm,
    400
  );
  const [categoryId, setCategoryId] = React.useState<string | null>(null);

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
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
      categoryId,
    },
  });
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
      refetchLocations();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage(1, {
        shallow: true,
      });
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
    setPage(page, {
      shallow: true,
    });
  };

  const { uncombinedItem: locationCategoryItems } = useFilterItems({
    data: locationCategoriesdata ?? [],
  });

  const filter = React.useMemo(() => {
    const item: SelectProps[] = [
      {
        onChange: (value) => {
          setPage(1, {
            shallow: true,
          });
          setCategoryId(value);
        },
        data: locationCategoryItems ?? [],
        label: 'locationCategory',
        placeholder: 'chooseLocationCategory',
        searchable: true,
        nothingFound: null,
        clearable: true,
        onSearchChange: setCatgeorySearchTerm,
        searchValue: catgeorySearchTerm,
      },
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catgeorySearchTerm, locationCategoryItems]);

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
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setPage(1, {
            shallow: true,
          });
        },
      }}
      MultipleFilter={{
        MultipleFilterData: filter,
        colSpan: 4,
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
