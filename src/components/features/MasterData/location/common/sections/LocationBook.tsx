import { SelectProps } from '@mantine/core';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
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

const LocationBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
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
    },
  });

  const [executeDelete, { loading }] = useDeleteLocationMaster({
    onCompleted: () => {
      refetchLocations();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push({
        href: router.asPath,
        query: {
          page: 1,
        },
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
    router.push({
      href: router.asPath,
      query: {
        page: page,
      },
    });
  };

  const { uncombinedItem: locationCategoryItems } = useFilterItems({
    data: locationCategoriesdata ?? [],
  });

  const filter = React.useMemo(() => {
    const item: SelectProps[] = [
      {
        onChange: (value) => {
          router.push({
            href: router.asPath,
            query: {
              page: 1,
            },
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
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/master-data/location/read/${id}`);
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/master-data/location/update/${id}`);
                      },
                    }}
                    actionDelete={{
                      onClick: (e) => {
                        e.stopPropagation();
                        setIsOpenDeleteConfirmation((prev) => !prev);
                        setId(id);
                      },
                    }}
                  />
                );
              },
            },
          ],
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('location.createLocation'),
            onClick: () => router.push('/master-data/location/create'),
          },
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
  }, [locationsData, locationsDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={{
        label: t('location.createLocation'),
        onClick: () => router.push('/master-data/location/create'),
      }}
      searchBar={{
        placeholder: t('location.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
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
