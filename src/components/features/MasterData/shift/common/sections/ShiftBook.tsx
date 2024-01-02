import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/id';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteShiftMaster } from '@/services/graphql/mutation/shift/useDeleteShiftMaster';
import { useReadAllShiftMaster } from '@/services/graphql/query/shift/useReadAllShiftMaster';
import { hourFromat } from '@/utils/helper/hourFromat';

const ShiftBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const url = `/master-data/shift?page=1`;
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Query =========== */
  const { shiftsData, shiftsDataLoading, refetchShifts, shiftsDataMeta } =
    useReadAllShiftMaster({
      variables: {
        limit: 10,
        page: page,
        orderDir: 'desc',
        orderBy: 'createdAt',
        search: searchQuery === '' ? null : searchQuery,
      },
    });

  const [executeDelete, { loading }] = useDeleteShiftMaster({
    onCompleted: () => {
      refetchShifts();
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
        message: t('shift.successDeleteMessage'),
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
          records: shiftsData,
          fetching: shiftsDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) => shiftsData && shiftsData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'name',
              title: t('commonTypography.shift'),
            },
            {
              accessor: 'startHour',
              title: t('commonTypography.startHour'),
              render: ({ startHour }) => hourFromat(startHour),
            },
            {
              accessor: 'endHour',
              title: t('commonTypography.endHour'),
              render: ({ endHour }) => hourFromat(endHour),
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/master-data/shift/read/${id}`);
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/master-data/shift/update/${id}`);
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
            label: t('shift.createShift'),
            onClick: () => router.push('/master-data/shift/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: shiftsDataMeta?.totalAllData ?? 0,
          totalData: shiftsDataMeta?.totalData ?? 0,
          totalPage: shiftsDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shiftsData, shiftsDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={{
        label: t('shift.createShift'),
        onClick: () => router.push('/master-data/shift/create'),
      }}
      searchBar={{
        placeholder: t('shift.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
        },
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

export default ShiftBook;
