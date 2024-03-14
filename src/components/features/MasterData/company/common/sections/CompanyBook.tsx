import { useDebouncedState } from '@mantine/hooks';
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

import { useDeleteMasterDataCompany } from '@/services/graphql/mutation/master-data-company/useDeleteMasterDataCompany';
import { useReadAllCompaniesMasterData } from '@/services/graphql/query/master-data-company/useReadAllMasterDataCompany';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const CompanyBook = () => {
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

  const isPermissionCreate = permissions?.includes('create-company');
  const isPermissionDelete = permissions?.includes('delete-company');
  const isPermissionRead = permissions?.includes('read-company');

  /* #   /**=========== Query =========== */
  const {
    companiesData,
    companiesDataLoading,
    companiesDataMeta,
    refetchCompanies,
  } = useReadAllCompaniesMasterData({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
    },
  });

  const [executeDelete, { loading }] = useDeleteMasterDataCompany({
    onCompleted: () => {
      refetchCompanies();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage(1);
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('company.successDeleteMessage'),
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
    setPage(page);
  };

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: companiesData,
          fetching: companiesDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                companiesData && companiesData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'name',
              title: t('commonTypography.companyName'),
            },
            {
              accessor: 'code',
              title: t('commonTypography.companyCode'),
            },
            {
              accessor: 'type',
              title: t('commonTypography.companyType'),
              render: ({ type }) => type?.name ?? '-',
            },
            {
              accessor: 'director',
              title: t('commonTypography.director'),
              render: ({ presidentDirector }) =>
                presidentDirector?.humanResource?.name || '-',
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
                              router.push(`/master-data/company/read/${id}`);
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
                label: t('company.createCompany'),
                onClick: () => router.push('/master-data/company/create'),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: companiesDataMeta?.totalAllData ?? 0,
          totalData: companiesDataMeta?.totalData ?? 0,
          totalPage: companiesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    companiesData,
    companiesDataLoading,
    isPermissionRead,
    isPermissionDelete,
    isPermissionCreate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              label: t('company.createCompany'),
              onClick: () => router.push('/master-data/company/create'),
            }
          : undefined
      }
      searchBar={{
        placeholder: t('company.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        onSearch: () => {
          setPage(1);
        },
        searchQuery: searchQuery,
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

export default CompanyBook;
