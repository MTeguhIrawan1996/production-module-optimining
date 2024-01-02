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

import { useDeleteBlockMaster } from '@/services/graphql/mutation/block/useDeleteBlockMaster';
import { useReadAllBlocksMaster } from '@/services/graphql/query/block/useReadAllBlockMaster';

const BlockBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const url = `/master-data/block?page=1`;
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Query =========== */
  const { blocksData, blocksDataLoading, blocksDataMeta, refetchBlocks } =
    useReadAllBlocksMaster({
      variables: {
        limit: 10,
        page: page,
        orderDir: 'desc',
        orderBy: 'createdAt',
        search: searchQuery === '' ? null : searchQuery,
      },
    });

  const [executeDelete, { loading }] = useDeleteBlockMaster({
    onCompleted: () => {
      refetchBlocks();
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
        message: t('block.successDeleteMessage'),
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

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: blocksData,
          fetching: blocksDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) => blocksData && blocksData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'handBookId',
              title: t('commonTypography.blockId'),
            },
            {
              accessor: 'name',
              title: t('commonTypography.blockName'),
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
                        router.push(`/master-data/block/read/${id}`);
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/master-data/block/update/${id}`);
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
            label: t('block.createBlock'),
            onClick: () => router.push('/master-data/block/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: blocksDataMeta?.totalAllData ?? 0,
          totalData: blocksDataMeta?.totalData ?? 0,
          totalPage: blocksDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocksData, blocksDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={{
        label: t('block.createBlock'),
        onClick: () => router.push('/master-data/block/create'),
      }}
      searchBar={{
        placeholder: t('block.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
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

export default BlockBook;
