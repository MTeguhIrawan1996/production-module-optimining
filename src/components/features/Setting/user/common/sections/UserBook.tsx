import { useDebouncedState } from '@mantine/hooks';
import { useSearchParams } from 'next/navigation';
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
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const url = `/setting/user?page=1`;
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);

  const { usersData, usersLoading, usersMeta } = useReadAllUser({
    variables: {
      limit: 10,
      page: page,
      search: searchQuery === '' ? null : searchQuery,
    },
  });

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
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('user.createUser'),
            onClick: () => router.push('/setting/user/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
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
        searchQuery: searchQuery,
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
        },
        placeholder: t('user.searchPlaceholder'),
      }}
    >
      {renderTable}
    </DashboardCard>
  );
};

export default UserBook;
