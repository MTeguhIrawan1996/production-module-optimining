import { Divider, Stack, Tabs, Text } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  KeyValueList,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteStockpileDomeMaster } from '@/services/graphql/mutation/stockpile-master/useDeleteStockpileDomeMaster';
import { useReadAllStockpileDomeMaster } from '@/services/graphql/query/stockpile-master/useReadAllStockpileDomeMaster';
import { useReadOneStockpileMaster } from '@/services/graphql/query/stockpile-master/useReadOneStockpileMaster';

const ReadStockpileMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const pageParams = useSearchParams();
  const id = router.query.id as string;
  const page = Number(pageParams.get('page')) || 1;
  const url = `/master-data/stockpile/read/${id}?page=1`;
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [domeId, setDomeId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Query =========== */
  const { stockpileMaster, stockpileMasterLoading } = useReadOneStockpileMaster(
    {
      variables: {
        id,
      },
      skip: !router.isReady,
    }
  );
  const {
    stockpileDomeMaster,
    stockpileDomeMasterLoading,
    stockpileDomeMasterMeta,
    refetchStockpiles,
  } = useReadAllStockpileDomeMaster({
    variables: {
      id,
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
    },
    skip: !router.isReady,
  });
  const [executeDelete, { loading }] = useDeleteStockpileDomeMaster({
    onCompleted: () => {
      refetchStockpiles();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push(url, undefined, { shallow: true });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('stcokpile.successDeleteDomeMessage'),
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

  const handleSetPage = (page: number) => {
    const urlSet = `/master-data/stockpile/read/${id}?page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const handleDeleteDome = async () => {
    await executeDelete({
      variables: {
        id: domeId,
      },
    });
  };

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          highlightOnHover: true,
          shadow: 'none',
          withColumnBorders: false,
          columns: [
            {
              accessor: 'handBookId',
              title: t('commonTypography.domeId'),
            },
            {
              accessor: 'name',
              title: t('commonTypography.domeName'),
            },
            {
              accessor: 'action',
              title: 'Aksi',
              render: ({ id: domeId }) => {
                return (
                  <GlobalKebabButton
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/master-data/stockpile/update/dome/${id}/${domeId}`
                        );
                      },
                    }}
                    actionDelete={{
                      onClick: (e) => {
                        e.stopPropagation();
                        setIsOpenDeleteConfirmation((prev) => !prev);
                        setDomeId(domeId);
                      },
                    }}
                  />
                );
              },
            },
          ],

          fetching: stockpileDomeMasterLoading,
          records: stockpileDomeMaster,
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('stockpile.createStockpileDome'),
            onClick: () =>
              router.push(`/master-data/stockpile/create/dome/${id}`),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: stockpileDomeMasterMeta?.totalAllData ?? 0,
          totalData: stockpileDomeMasterMeta?.totalData ?? 0,
          totalPage: stockpileDomeMasterMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockpileDomeMaster, stockpileDomeMasterLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      title={t('commonTypography.stockpile')}
      updateButton={{
        label: 'Edit',
        onClick: () => router.push(`/master-data/stockpile/update/${id}`),
      }}
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={stockpileMasterLoading}
      enebleBackBottomInner={{
        onClick: () => router.push('/master-data/stockpile'),
      }}
      paperStackProps={{
        spacing: 'sm',
      }}
    >
      <Tabs
        defaultValue="information"
        radius={4}
        styles={{
          tabsList: {
            flexWrap: 'nowrap',
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="information" fz={14} fw={500}>
            {t('commonTypography.information')}
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="information">
          <Stack spacing="sm" mt="lg">
            <Text fz={24} fw={600} color="brand">
              {t('stockpile.readStockpile')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.stockpileId'),
                  value: stockpileMaster?.handBookId ?? '-',
                },
                {
                  dataKey: t('commonTypography.stockpileName'),
                  value: stockpileMaster?.name ?? '-',
                },
              ]}
              type="grid"
              keyStyleText={{
                fw: 400,
                fz: 20,
              }}
              valueStyleText={{
                fw: 600,
                fz: 20,
              }}
            />
          </Stack>
          <Divider my="md" />
          <DashboardCard
            p={0}
            title={t('commonTypography.dome')}
            addButton={{
              label: t('stockpile.createStockpileDome'),
              onClick: () =>
                router.push(`/master-data/stockpile/create/dome/${id}`),
            }}
            searchBar={{
              onChange: (e) => {
                setSearchQuery(e.currentTarget.value);
              },
              searchQuery,
              onSearch: () => {
                router.push(url, undefined, { shallow: true });
              },
              placeholder: t('stockpile.searchDomePlaceholder'),
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
                onClick: handleDeleteDome,
                loading: loading,
              }}
              backButton={{
                label: 'Batal',
              }}
              modalType={{
                type: 'default',
                title: t('commonTypography.alertTitleConfirmDelete'),
                description: t(
                  'commonTypography.alertDescConfirmDeleteMasterData'
                ),
              }}
              withDivider
            />
          </DashboardCard>
        </Tabs.Panel>
      </Tabs>
    </DashboardCard>
  );
};

export default ReadStockpileMasterBook;
