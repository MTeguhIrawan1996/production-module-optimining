import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
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

import { useDeleteHeavyEquipmentProduction } from '@/services/graphql/mutation/heavy-equipment-production/useDeleteHeavyEquipmentProduction';
import { useReadAllHeavyEquipmentProduction } from '@/services/graphql/query/heavy-equipment-production/useReadAllHeavyEquipmentProduction';
import { globalDateNative } from '@/utils/constants/Field/native-field';
import { formatDate } from '@/utils/helper/dateFormat';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { InputControllerNativeProps } from '@/types/global';

const HeavyEquipmentProductionBook = () => {
  const router = useRouter();
  const page = Number(router.query['page']) || 1;
  const url = `/input-data/production/data-heavy-equipment?page=1`;
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [date, setDate] = React.useState('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes(
    'create-heavy-equipment-data'
  );
  const isPermissionUpdate = permissions?.includes(
    'update-heavy-equipment-data'
  );
  const isPermissionDelete = permissions?.includes(
    'delete-heavy-equipment-data'
  );
  const isPermissionRead = permissions?.includes('read-heavy-equipment-data');

  /* #   /**=========== Query =========== */
  const {
    heavyEquipmentData,
    heavyEquipmentDataLoading,
    heavyEquipmentDataMeta,
    refetchHeavyEquipmentData,
  } = useReadAllHeavyEquipmentProduction({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      search: searchQuery === '' ? null : searchQuery,
      date: date === '' ? null : date,
    },
  });

  const [executeDelete, { loading }] = useDeleteHeavyEquipmentProduction({
    onCompleted: () => {
      refetchHeavyEquipmentData();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push(url, undefined, { shallow: true });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipmentProd.successDeleteMessage'),
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
    const urlSet = `/input-data/production/data-heavy-equipment?page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const filter = React.useMemo(() => {
    const dateItem = globalDateNative({
      label: 'date',
      placeholder: 'chooseDate',
      clearable: true,
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        const date = formatDate(value, 'YYYY-MM-DD');
        setDate(date ?? '');
      },
    });

    const item: InputControllerNativeProps[] = [dateItem];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: heavyEquipmentData,
          fetching: heavyEquipmentDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                heavyEquipmentData && heavyEquipmentData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'date',
              title: t('commonTypography.date'),
              width: 160,
              render: ({ date }) => formatDate(date) ?? '-',
            },
            {
              accessor: 'heavyEquipmentType',
              title: t('commonTypography.heavyEquipmentType'),
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment.heavyEquipment.reference.type.name,
            },
            {
              accessor: 'heavyEquipmentCode',
              title: t('commonTypography.heavyEquipmentCode'),
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment.hullNumber,
            },
            {
              accessor: 'operator',
              title: t('commonTypography.operator'),
              width: 150,
              render: ({ operator }) => operator.humanResource.name,
            },
            {
              accessor: 'shift',
              title: t('commonTypography.shift'),
              render: ({ shift }) => shift?.name,
            },
            {
              accessor: 'foreman',
              title: t('commonTypography.foreman'),
              width: 150,
              render: ({ foreman }) => foreman.humanResource.name,
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
                                `/input-data/production/data-heavy-equipment/read/${id}`
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
                                `/input-data/production/data-heavy-equipment/update/${id}`
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
                label: t('heavyEquipmentProd.createHeavyEquipmentProd'),
                onClick: () =>
                  router.push(
                    '/input-data/production/data-heavy-equipment/create'
                  ),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: heavyEquipmentDataMeta?.totalAllData ?? 0,
          totalData: heavyEquipmentDataMeta?.totalData ?? 0,
          totalPage: heavyEquipmentDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    heavyEquipmentData,
    heavyEquipmentDataLoading,
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
              label: t('heavyEquipmentProd.createHeavyEquipmentProd'),
              onClick: () => setIsOpenSelectionModal((prev) => !prev),
            }
          : undefined
      }
      filterDateWithSelect={{
        colSpan: 3,
        items: filter,
      }}
      searchBar={{
        placeholder: t('heavyEquipmentProd.searchPlaceholder'),
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
          description: t('commonTypography.alertDescConfirmDelete'),
        }}
        withDivider
      />
      <SelectionButtonModal
        isOpenSelectionModal={isOpenSelectionModal}
        actionSelectionModal={() => setIsOpenSelectionModal((prev) => !prev)}
        firstButton={{
          label: t('commonTypography.inputDataProductionHeavyEquipment'),
          onClick: () =>
            router.push('/input-data/production/data-heavy-equipment/create'),
        }}
        secondButton={{
          label: t('commonTypography.uploadFile'),
          onClick: () =>
            router.push('/input-data/production/data-heavy-equipment/upload'),
        }}
      />
    </DashboardCard>
  );
};

export default HeavyEquipmentProductionBook;
