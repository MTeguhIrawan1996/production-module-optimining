import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteHeavyEquipmentClass } from '@/services/graphql/mutation/heavy-equipment-class/useDeleteHeavyEquipmentClass';
import { useReadAllHeavyEquipmentClass } from '@/services/graphql/query/heavy-equipment-class/useReadAllHeavyEquipmentClass';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const HeavyEquipmentClassBook = () => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const query = router.query;
  const { t } = useTranslation('default');
  const page = Number(query['page']) || 1;
  const url = `/reference/heavy-equipment-class?page=1`;
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);

  const isPermissionCreate = permissions?.includes(
    'create-heavy-equipment-class'
  );
  const isPermissionUpdate = permissions?.includes(
    'update-heavy-equipment-class'
  );
  const isPermissionDelete = permissions?.includes(
    'delete-heavy-equipment-class'
  );
  const isPermissionRead = permissions?.includes('read-heavy-equipment-class');

  /* #   /**=========== Query =========== */
  const {
    heavyEquipmentClassesData,
    heavyEquipmentClassesDataLoading,
    heavyEquipmentClassesDataMeta,
    refetchHeavyEquipmentClasses,
  } = useReadAllHeavyEquipmentClass({
    variables: {
      limit: 10,
      page: page,
      search: searchQuery === '' ? null : searchQuery,
    },
  });
  const [executeDelete, { loading }] = useDeleteHeavyEquipmentClass({
    onCompleted: () => {
      refetchHeavyEquipmentClasses();
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
        message: t('heavyEquipmentClass.successDeleteMessage'),
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

  /* #   /**=========== HandleClickFc =========== */
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
  /* #endregion  /**======== HandleClickFc =========== */

  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          highlightOnHover: true,
          columns: [
            {
              accessor: 'class',
              title: t('commonTypography.class'),

              render: ({ name }) => name,
            },
            {
              accessor: 'type',
              title: t('commonTypography.model'),
              noWrap: false,
              width: 450,
              render: ({ heavyEquipmentReferences }) => {
                const type = heavyEquipmentReferences.map(
                  (val) => val.modelName
                );
                return type?.join(', ');
              },
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/reference/heavy-equipment-class/read/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionUpdate={
                      isPermissionUpdate
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/reference/heavy-equipment-class/update/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionDelete={
                      isPermissionDelete
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
          fetching: heavyEquipmentClassesDataLoading,
          records: heavyEquipmentClassesData,
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: isPermissionCreate
            ? {
                label: t('heavyEquipmentClass.createHeavyEquipmentClass'),
                onClick: () =>
                  router.push('/reference/heavy-equipment-class/create'),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: heavyEquipmentClassesDataMeta?.totalAllData ?? 0,
          totalData: heavyEquipmentClassesDataMeta?.totalData ?? 0,
          totalPage: heavyEquipmentClassesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    heavyEquipmentClassesData,
    heavyEquipmentClassesDataLoading,
    isPermissionDelete,
    isPermissionRead,
    isPermissionUpdate,
    isPermissionCreate,
  ]);

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              label: t('heavyEquipmentClass.createHeavyEquipmentClass'),
              onClick: () =>
                router.push('/reference/heavy-equipment-class/create'),
            }
          : undefined
      }
      searchBar={{
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery,
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
        },
        placeholder: t('heavyEquipmentClass.searchPlaceholder'),
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
          description: t('heavyEquipment.alertDescConfirmDelete'),
        }}
        withDivider
      />
    </DashboardCard>
  );
};

export default HeavyEquipmentClassBook;
