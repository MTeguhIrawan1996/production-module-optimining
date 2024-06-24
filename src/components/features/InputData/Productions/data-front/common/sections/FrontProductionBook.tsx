import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { queryTypes, useQueryStates } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

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
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const FrontProductionBook = () => {
  const router = useRouter();
  const [params, setParams] = useQueryStates({
    segment: queryTypes.string.withDefault('pit'),
  });

  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [
    { page: pagePit, search: searchPit },
    { page: pageDome, search: searchDome },
    setFrontState,
  ] = useControlPanel(
    (state) => [state.frontPitState, state.frontDomeState, state.setFrontState],
    shallow
  );

  const [domeSearchQuery] = useDebouncedValue<string>(searchDome || '', 500);

  const [pitSearchQuery] = useDebouncedValue<string>(searchPit || '', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-front-data');
  const isPermissionUpdate = permissions?.includes('update-front-data');
  const isPermissionDelete = permissions?.includes('delete-front-data');
  const isPermissionRead = permissions?.includes('read-front-data');

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(new Set<ISliceName>(['frontSlice'] as ISliceName[]));
  }, []);

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
      page: params.segment === 'dome' ? pageDome : pagePit,
      orderDir: 'desc',
      search: params.segment === 'dome' ? domeSearchQuery : pitSearchQuery,
      type: params.segment,
    },
  });

  const [executeDelete, { loading }] = useDeleteFrontProduction({
    onCompleted: () => {
      refetchfrontProductionData();
      setIsOpenDeleteConfirmation((prev) => !prev);
      if (params.segment === 'pit') {
        setFrontState({
          frontPitState: {
            page: 1,
          },
        });
      }
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
    if (params.segment === 'pit') {
      setFrontState({
        frontPitState: {
          page: page,
        },
      });
    }
    if (params.segment === 'dome') {
      setFrontState({
        frontDomeState: {
          page: page,
        },
      });
    }
  };

  const handleChangeSegement = (value: string) => {
    setParams({
      segment: value,
    });
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
                                `/input-data/production/data-front/update/${id}?segment=${params.segment}`
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
          currentPage: params.segment === 'pit' ? pagePit || 1 : pageDome || 1,
          totalAllData: frontProductionDataMeta?.totalAllData ?? 0,
          totalData: frontProductionDataMeta?.totalData ?? 0,
          totalPage: frontProductionDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageDome,
    pagePit,
    frontProductionData,
    frontProductionDataLoading,
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
              label: t('frontProduction.createFrontProduction'),
              onClick: () => setIsOpenSelectionModal((prev) => !prev),
            }
          : undefined
      }
      searchBar={{
        placeholder: `${t('frontProduction.searchPlaceholder')} ${
          params.segment ? params.segment.toUpperCase() : ''
        }`,
        onChange: (e) => {
          if (params.segment === 'dome') {
            setFrontState({
              frontDomeState: {
                search: e.currentTarget.value,
              },
            });
          } else {
            setFrontState({
              frontPitState: {
                search: e.currentTarget.value,
              },
            });
          }
        },
        searchQuery:
          params.segment === 'dome'
            ? domeSearchQuery || ''
            : pitSearchQuery || '',
        onSearch: () => {
          if (params.segment === 'dome') {
            setFrontState({
              frontDomeState: {
                page: 1,
              },
            });
          } else {
            setFrontState({
              frontPitState: {
                page: 1,
              },
            });
          }
        },
        value: params.segment === 'dome' ? searchDome : searchPit,
      }}
      segmentedControl={{
        defaultValue: 'pit',
        value: params.segment || 'pit',
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
