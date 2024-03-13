import { Divider, Group } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconChevronLeft, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { parseAsInteger, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalActionTable,
  MantineDataTable,
  PrimaryButton,
} from '@/components/elements';

import { useCreateEmployeeBulk } from '@/services/graphql/mutation/master-data-company/useCreateCompanySDMAvailable';
import { IHumanResourcesData } from '@/services/graphql/query/master-data-human-resources/useReadAllMasterDataHumanResources';
import { useReadAllNonEmployeedHumanResourcesMasterData } from '@/services/graphql/query/master-data-human-resources/useReadAllNonEmployeHumanResources';

const CreateHumanResourcesAvailableBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const companyId = router.query?.id as string;
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const urlCreate = `/master-data/company/read/${companyId}`;
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [choosesHumanResources, setChooseHumanResources] = React.useState<
    IHumanResourcesData[]
  >([]);

  const {
    nonEmployeedHumanResourcesData,
    nonEmployeedHumanResourcesDataLoading,
    nonEmployeedHumanResourcesDataMeta,
    refetchNonEmployeedHumanResources,
  } = useReadAllNonEmployeedHumanResourcesMasterData({
    variables: {
      limit: 10,
      page: page,
      search: searchQuery === '' ? null : searchQuery,
      excludeIds: choosesHumanResources.map((val) => val.id) ?? null,
    },
    // fetchPolicy: 'cache-and-network',
  });

  const [executeCreate, { loading }] = useCreateEmployeeBulk({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('humanResources.successCreateMessage'),
        icon: <IconCheck />,
      });
      router.push(urlCreate);
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: error.message,
          icon: <IconX />,
        });
      }
    },
  });

  const handleChoose = (data: IHumanResourcesData) => {
    setChooseHumanResources((prev) => [...prev, data]);
  };
  const handleDeleteSdm = (id: string) => {
    setChooseHumanResources((prev) => prev.filter((val) => val.id !== id));
  };

  const handleCreate = async () => {
    const humanResourceIds = choosesHumanResources.map((val) => val.id);
    await executeCreate({
      variables: {
        companyId,
        humanResourceIds,
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
          records: nonEmployeedHumanResourcesData,
          fetching: nonEmployeedHumanResourcesDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                nonEmployeedHumanResourcesData &&
                nonEmployeedHumanResourcesData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'name',
              title: t('commonTypography.name'),
            },
            {
              accessor: 'phoneNumber',
              title: t('commonTypography.phoneNumber'),
            },
            {
              accessor: 'email',
              title: t('commonTypography.email'),
            },
            {
              accessor: 'identityNumber',
              title: t('commonTypography.identityNumberOrPassport'),
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              render: (data) => {
                return (
                  <GlobalActionTable
                    actionChoose={{
                      onClick: (e) => {
                        e.stopPropagation();
                        handleChoose(data);
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
            label: t('humanResources.createHumanResources'),
            onClick: () => router.push('/master-data/human-resources/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: nonEmployeedHumanResourcesDataMeta?.totalAllData ?? 0,
          totalData: nonEmployeedHumanResourcesDataMeta?.totalData ?? 0,
          totalPage: nonEmployeedHumanResourcesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nonEmployeedHumanResourcesData,
    nonEmployeedHumanResourcesDataLoading,
    page,
  ]);

  const choosetable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: choosesHumanResources,
          highlightOnHover: true,
          minHeight: 200,
          emptyState: undefined,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                choosesHumanResources &&
                choosesHumanResources.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'name',
              title: t('commonTypography.name'),
            },
            {
              accessor: 'phoneNumber',
              title: t('commonTypography.phoneNumber'),
            },
            {
              accessor: 'email',
              title: t('commonTypography.email'),
            },
            {
              accessor: 'identityNumber',
              title: t('commonTypography.identityNumberOrPassport'),
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              render: ({ id }) => {
                return (
                  <GlobalActionTable
                    actionDelete={{
                      onClick: (e) => {
                        e.stopPropagation();
                        handleDeleteSdm(id);
                      },
                    }}
                  />
                );
              },
            },
          ],
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosesHumanResources]);
  /* #endregion  /**======== RenderTable =========== */
  return (
    <>
      <DashboardCard
        title={t('humanResources.masterSDM')}
        searchBar={{
          placeholder: t('humanResources.searchPlaceholder'),
          onChange: (e) => {
            setSearchQuery(e.currentTarget.value);
          },
          searchQuery,
          onSearch: () => {
            setPage(1);
            refetchNonEmployeedHumanResources({
              page: 1,
            });
          },
        }}
      >
        {renderTable}
      </DashboardCard>
      <Divider my="md" />
      <DashboardCard title={t('commonTypography.humanResourcesSelected')}>
        {choosetable}
        <Group w="100%" position="apart">
          <PrimaryButton
            type="button"
            variant="outline"
            leftIcon={<IconChevronLeft size="1rem" />}
            label={t('commonTypography.back')}
            onClick={() => router.push(urlCreate)}
          />

          <PrimaryButton
            label={t('commonTypography.save')}
            type="button"
            onClick={handleCreate}
            loading={loading}
          />
        </Group>
      </DashboardCard>
    </>
  );
};

export default CreateHumanResourcesAvailableBook;
