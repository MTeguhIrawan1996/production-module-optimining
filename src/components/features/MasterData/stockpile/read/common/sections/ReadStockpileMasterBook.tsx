import { Divider, Stack, Tabs, Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

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
import useControlPanel from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ReadStockpileMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const id = router.query.id as string;

  const [{ page, search }, setStockpileState] = useControlPanel(
    (state) => [state.stockpileDomeState, state.setStockpileState],
    shallow
  );

  const [searchQuery] = useDebouncedValue<string>(search || '', 500);
  const [domeId, setDomeId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const isPermissionUpdate = permissions?.includes('update-stockpile');

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
      setStockpileState({ stockpileDomeState: { page: 1 } });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('stockpile.successDeleteDomeMessage'),
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
    setStockpileState({ stockpileDomeState: { page } });
  };

  const handleDeleteDome = async () => {
    await executeDelete({
      variables: {
        id: domeId,
      },
    });
  };
  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
  }, []);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          highlightOnHover: true,
          shadow: 'none',
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
          currentPage: page || 1,
          totalAllData: stockpileDomeMasterMeta?.totalAllData ?? 0,
          totalData: stockpileDomeMasterMeta?.totalData ?? 0,
          totalPage: stockpileDomeMasterMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockpileDomeMaster, stockpileDomeMasterLoading, page]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      title={t('commonTypography.stockpile')}
      updateButton={
        isPermissionUpdate
          ? {
              label: 'Edit',
              onClick: () => router.push(`/master-data/stockpile/update/${id}`),
            }
          : undefined
      }
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
          <Stack spacing="sm" mt="sm">
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
                setStockpileState({
                  stockpileDomeState: {
                    search: e.currentTarget.value,
                  },
                });
              },
              searchQuery,
              onSearch: () => {
                setStockpileState({ stockpileDomeState: { page: 1 } });
                refetchStockpiles({
                  page: 1,
                });
              },
              placeholder: t('stockpile.searchDomePlaceholder'),
              value: search,
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
