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
  SelectionButtonModal,
} from '@/components/elements';

import { useDeleteFrontProduction } from '@/services/graphql/mutation/front-production/useDeleteFrontProduction';
import { useReadAllFrontProduction } from '@/services/graphql/query/front-production/useReadAllFrontProduction';
import { useRouterReady } from '@/utils/hooks/useRouterReady';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const FrontProductionBook = () => {
  const router = useRouter();
  const isRouterReady = useRouterReady();
  const [page, setPage] = useQueryState(
    'page',
    queryTypes.integer.withDefault(1)
  );
  const [segment, setSegment] = useQueryState(
    'segment',
    queryTypes.string.withDefault('pit')
  );
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-front-data');
  const isPermissionUpdate = permissions?.includes('update-front-data');
  const isPermissionDelete = permissions?.includes('delete-front-data');
  const isPermissionRead = permissions?.includes('read-front-data');

  /* #   /**=========== Query =========== */
  const {
    frontProductionData,
    frontProductionOtherColumn,
    frontProductionDataLoading,
    frontProductionDataMeta,
    refetchfrontProductionData,
  } = useReadAllFrontProduction({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      search: searchQuery === '' ? null : searchQuery,
      type: segment,
    },
  });

  const [executeDelete, { loading }] = useDeleteFrontProduction({
    onCompleted: () => {
      refetchfrontProductionData();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage(1);
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('frontProduction.successDeleteMessage'),
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

  const handleChangeSegement = (value: string) => {
    setSegment(value);
    setPage(1);
  };

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: frontProductionData,
          fetching: frontProductionDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                frontProductionData && frontProductionData.indexOf(record) + 1,
              width: 60,
            },
            ...(frontProductionOtherColumn ?? []),
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
                                `/input-data/production/data-front/read/${id}`
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
                                `/input-data/production/data-front/update/${id}?segment=${segment}`
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
                label: t('frontProduction.createFrontProduction'),
                onClick: () => setIsOpenSelectionModal((prev) => !prev),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: frontProductionDataMeta?.totalAllData ?? 0,
          totalData: frontProductionDataMeta?.totalData ?? 0,
          totalPage: frontProductionDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    frontProductionData,
    frontProductionDataLoading,
    isPermissionDelete,
    isPermissionRead,
    isPermissionUpdate,
    isPermissionCreate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  if (!isRouterReady) return null;

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              label: t('frontProduction.createFrontProduction'),
              onClick: () => setIsOpenSelectionModal((prev) => !prev),
            }
          : undefined
      }
      searchBar={{
        placeholder: `${t(
          'frontProduction.searchPlaceholder'
        )} ${segment.toUpperCase()}`,
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          setPage(1);
          refetchfrontProductionData({
            page: 1,
          });
        },
      }}
      segmentedControl={{
        defaultValue: 'pit',
        value: segment,
        onChange: handleChangeSegement,
        data: [
          {
            label: 'PIT',
            value: 'pit',
          },
          {
            label: 'DOME',
            value: 'dome',
          },
        ],
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
      <SelectionButtonModal
        isOpenSelectionModal={isOpenSelectionModal}
        actionSelectionModal={() => setIsOpenSelectionModal((prev) => !prev)}
        firstButton={{
          label: t('commonTypography.fromPit'),
          onClick: () =>
            router.push(`/input-data/production/data-front/create?segment=pit`),
        }}
        secondButton={{
          label: t('commonTypography.fromDome'),
          onClick: () =>
            router.push(
              `/input-data/production/data-front/create?segment=dome`
            ),
        }}
      />
    </DashboardCard>
  );
};

export default FrontProductionBook;
