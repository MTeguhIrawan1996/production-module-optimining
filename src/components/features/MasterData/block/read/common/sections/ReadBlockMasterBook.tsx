import { Divider, Stack, Tabs, Text } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  KeyValueList,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteBlockPitMaster } from '@/services/graphql/mutation/block/useDeleteBlockPitMaster';
import { useReadAllBlockPitMaster } from '@/services/graphql/query/block/useReadAllBlockPitMaster';
import { useReadOneBlockMaster } from '@/services/graphql/query/block/useReadOneBlockMaster';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const ReadBlockMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const id = router.query.id as string;
  const [page, setPage] = useQueryState(
    'page',
    queryTypes.integer.withDefault(1)
  );
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [pitId, setPitId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const isPermissionUpdate = permissions?.includes('update-block');

  /* #   /**=========== Query =========== */
  const { blockMaster, blockMasterLoading } = useReadOneBlockMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
  });
  const {
    blockPitMaster,
    blockPitMasterMeta,
    blockPitMasterLoading,
    refetchBlocks,
  } = useReadAllBlockPitMaster({
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
  const [executeDelete, { loading }] = useDeleteBlockPitMaster({
    onCompleted: () => {
      refetchBlocks();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage(1);
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('block.successDeletePitMessage'),
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
    setPage(page);
  };

  const handleDeletePit = async () => {
    await executeDelete({
      variables: {
        id: pitId,
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
          columns: [
            {
              accessor: 'handBookId',
              title: t('commonTypography.pitId'),
            },
            {
              accessor: 'name',
              title: t('commonTypography.pitName'),
            },
            {
              accessor: 'action',
              title: 'Aksi',
              render: ({ id: pitId }) => {
                return (
                  <GlobalKebabButton
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/master-data/block/update/pit/${id}/${pitId}`
                        );
                      },
                    }}
                    actionDelete={{
                      onClick: (e) => {
                        e.stopPropagation();
                        setIsOpenDeleteConfirmation((prev) => !prev);
                        setPitId(pitId);
                      },
                    }}
                  />
                );
              },
            },
          ],
          fetching: blockPitMasterLoading,
          records: blockPitMaster,
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('block.createBlockPit'),
            onClick: () => router.push(`/master-data/block/create/pit/${id}`),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: blockPitMasterMeta?.totalAllData ?? 0,
          totalData: blockPitMasterMeta?.totalData ?? 0,
          totalPage: blockPitMasterMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockPitMaster, blockPitMasterLoading, page]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      title={t('commonTypography.block')}
      updateButton={
        isPermissionUpdate
          ? {
              label: 'Edit',
              onClick: () => router.push(`/master-data/block/update/${id}`),
            }
          : undefined
      }
      titleStyle={{
        fw: 700,
        fz: 30,
      }}
      withBorder
      shadow="xs"
      isLoading={blockMasterLoading}
      enebleBackBottomInner={{
        onClick: () => router.push('/master-data/block'),
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
              {t('block.readBlock')}
            </Text>
            <KeyValueList
              data={[
                {
                  dataKey: t('commonTypography.blockId'),
                  value: blockMaster?.handBookId ?? '-',
                },
                {
                  dataKey: t('commonTypography.blockName'),
                  value: blockMaster?.name ?? '-',
                },
              ]}
              type="grid"
            />
          </Stack>
          <Divider my="md" />
          <DashboardCard
            p={0}
            title={t('commonTypography.pit')}
            addButton={{
              label: t('block.createBlockPit'),
              onClick: () => router.push(`/master-data/block/create/pit/${id}`),
            }}
            searchBar={{
              onChange: (e) => {
                setSearchQuery(e.currentTarget.value);
              },
              searchQuery,
              onSearch: () => {
                setPage(1);
                refetchBlocks({
                  page: 1,
                });
              },
              placeholder: t('block.searchPitPlaceholder'),
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
                onClick: handleDeletePit,
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

export default ReadBlockMasterBook;
