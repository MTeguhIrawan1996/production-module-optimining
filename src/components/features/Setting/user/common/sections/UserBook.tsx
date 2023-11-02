import { useDebouncedState } from '@mantine/hooks';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

import { useReadAllUser } from '@/services/graphql/query/user/useReadAllUser';

const UserBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [page, setPage] = React.useState<number>(1);
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  // const [id, setId] = React.useState<string>('');
  // const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
  //   React.useState<boolean>(false);

  const { usersData, usersLoading, usersMeta } = useReadAllUser({
    variables: {
      limit: 10,
      page: page,
      search: searchQuery === '' ? null : searchQuery,
    },
  });

  // const [executeDelete, { loading }] = useDeleteUser({
  //   onCompleted: () => {
  //     refetch();
  //     setIsOpenDeleteConfirmation((prev) => !prev);
  //     setPage(1);
  //     notifications.show({
  //       color: 'green',
  //       title: 'Selamat',
  //       message: t('user.successDeleteMessage'),
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

  // const handleDelete = async () => {
  //   await executeDelete({
  //     variables: {
  //       id,
  //     },
  //   });
  // };

  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          highlightOnHover: true,
          defaultColumnProps: {
            textAlignment: 'center',
            titleSx: (theme) => ({
              '&&': {
                paddingTop: theme.spacing.md,
                paddingBottom: theme.spacing.md,
              },
            }),
          },

          columns: [
            { accessor: 'name', title: t('commonTypography.name') },
            {
              accessor: 'email',
              title: 'Email',
            },
            {
              accessor: 'status',
              title: t('user.table.activeStatus'),
              render: ({ isActive }) => (
                <GlobalBadgeStatus
                  color={isActive ? 'blue.6' : 'gray.6'}
                  label={
                    isActive
                      ? t('commonTypography.activeLabel')
                      : t('commonTypography.nonActiveLabel')
                  }
                />
              ),
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/setting/user/update/${id}`);
                      },
                    }}
                  />
                );
              },
            },
          ],
          records: usersData,
          fetching: usersLoading,
        }}
        emptyStateProps={{
          title: 'Belum ada data',
          actionButton: {
            label: 'Tambah Role',
          },
        }}
        paginationProps={{
          setPage: setPage,
          currentPage: page,
          totalAllData: usersMeta?.totalAllData ?? 0,
          totalData: usersMeta?.totalData ?? 0,
          totalPage: usersMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersData, usersLoading]);

  return (
    <DashboardCard
      addButton={{
        label: t('user.createUser'),
        onClick: () => router.push('/setting/user/create'),
      }}
      searchBar={{
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        onSearch: () => {
          setPage(1);
        },
        searchQuery: searchQuery,
        placeholder: t('user.searchPlaceholder'),
      }}
    >
      {renderTable}
      {/* <ModalConfirmation
        isOpenModalConfirmation={isOpenDeleteConfirmation}
        actionModalConfirmation={() =>
          setIsOpenDeleteConfirmation((prev) => !prev)
        }
        actionButton={{
          label: 'Ya Hapus',
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
      /> */}
    </DashboardCard>
  );
};

export default UserBook;
