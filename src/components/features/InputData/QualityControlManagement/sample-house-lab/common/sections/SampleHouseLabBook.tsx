import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteSampleHouseLab } from '@/services/graphql/mutation/sample-house-lab/useDeleteSampleHouseLab';
import { useReadAllSampleHouseLab } from '@/services/graphql/query/sample-house-lab/useReadAllSampleHouseLab';
import { formatDate } from '@/utils/helper/dateFormat';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const SampleHouseLabBook = () => {
  const router = useRouter();
  const [page, setPage] = useQueryState(
    'page',
    queryTypes.integer.withDefault(1)
  );
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes(
    'create-house-sample-and-lab'
  );
  const isPermissionUpdate = permissions?.includes(
    'update-house-sample-and-lab'
  );
  const isPermissionDelete = permissions?.includes(
    'delete-house-sample-and-lab'
  );
  const isPermissionRead = permissions?.includes('read-house-sample-and-lab');

  /* #   /**=========== Query =========== */

  const {
    houseSampleAndLabsData,
    houseSampleAndLabsDataLoading,
    houseSampleAndLabsDataMeta,
    refetchHouseSampleAndLabs,
  } = useReadAllSampleHouseLab({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
    },
  });

  const [executeDelete, { loading }] = useDeleteSampleHouseLab({
    onCompleted: () => {
      refetchHouseSampleAndLabs();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage(1);
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('sampleHouseLab.successDeleteMessage'),
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
          records: houseSampleAndLabsData,
          fetching: houseSampleAndLabsDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                houseSampleAndLabsData &&
                houseSampleAndLabsData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'sampleDate',
              title: t('commonTypography.sampleDate'),
              render: ({ sampleDate }) => formatDate(sampleDate) ?? '-',
            },
            {
              accessor: 'shift',
              title: t('commonTypography.shift'),
              width: 120,
              render: ({ shift }) => shift?.name,
            },
            {
              accessor: 'sampleNumber',
              title: t('commonTypography.sampleNumber'),
            },
            {
              accessor: 'sampleType',
              title: t('commonTypography.sampleType'),
              render: ({ sampleType }) => sampleType?.name,
            },
            {
              accessor: 'sampleEnterLabAt',
              title: t('commonTypography.sampleEnterLabAt'),
              render: ({ sampleEnterLabAt }) =>
                formatDate(sampleEnterLabAt) ?? '-',
            },
            {
              accessor: 'status',
              title: t('commonTypography.status'),
              render: ({ status }) => {
                return (
                  <GlobalBadgeStatus
                    color={status?.color}
                    label={status?.name ?? ''}
                  />
                );
              },
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ id, status }) => {
                const isDetermination =
                  status?.id === `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`;
                return (
                  <GlobalKebabButton
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/quality-control-management/sample-house-lab/read/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionUpdate={
                      isPermissionUpdate && !isDetermination
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/quality-control-management/sample-house-lab/update/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionDelete={
                      isPermissionDelete && !isDetermination
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
                label: t('sampleHouseLab.createSample'),
                onClick: () =>
                  router.push(
                    '/input-data/quality-control-management/sample-house-lab/create'
                  ),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: houseSampleAndLabsDataMeta?.totalAllData ?? 0,
          totalData: houseSampleAndLabsDataMeta?.totalData ?? 0,
          totalPage: houseSampleAndLabsDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    houseSampleAndLabsData,
    houseSampleAndLabsDataLoading,
    isPermissionDelete,
    isPermissionRead,
    isPermissionUpdate,
    isPermissionCreate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              label: t('sampleHouseLab.createSample'),
              onClick: () =>
                router.push(
                  '/input-data/quality-control-management/sample-house-lab/create'
                ),
            }
          : undefined
      }
      searchBar={{
        placeholder: t('sampleHouseLab.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setPage(1, {
            shallow: true,
          });
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
          description: t('commonTypography.alertDescConfirmDelete'),
        }}
        withDivider
      />
    </DashboardCard>
  );
};

export default SampleHouseLabBook;
