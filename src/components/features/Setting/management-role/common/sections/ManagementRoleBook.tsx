import { useDebouncedState } from '@mantine/hooks';
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

import { useDeleteRole } from '@/services/graphql/mutation/management-role/useDeleteRole';
import { useReadAllManagementRole } from '@/services/graphql/query/management-role/useReadAllManagementRole';

const ManagementRoleBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const { rolesData, rolesLoading, rolesMeta, refetch } =
    useReadAllManagementRole({
      variables: {
        limit: 10,
        page: page,
        search: searchQuery === '' ? null : searchQuery,
      },
    });

  const [executeDelete, { loading }] = useDeleteRole({
    onCompleted: () => {
      refetch();
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
        message: t('managementRole.successDeleteMessage'),
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

  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          highlightOnHover: true,
          columns: [
            { accessor: 'name', title: t('commonTypography.role'), width: 400 },
            {
              accessor: 'desc',
              title: t('commonTypography.description'),
            },
            {
              accessor: 'action',
              title: t('commonTypography.action', { ns: 'default' }),
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/setting/management-role/read/${id}`);
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/setting/management-role/update/${id}`);
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
          records: rolesData,
          fetching: rolesLoading,
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('managementRole.createRole'),
            onClick: () => router.push('/setting/management-role/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: rolesMeta?.totalAllData ?? 0,
          totalData: rolesMeta?.totalData ?? 0,
          totalPage: rolesMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesData, rolesLoading]);

  return (
    <DashboardCard
      addButton={{
        label: t('managementRole.createRole'),
        onClick: () => router.push('/setting/management-role/create'),
      }}
      searchBar={{
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        placeholder: t('managementRole.searchPlaceholder'),
      }}
    >
      {renderTable}
      <ModalConfirmation
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
      />
    </DashboardCard>
  );
};

export default ManagementRoleBook;
