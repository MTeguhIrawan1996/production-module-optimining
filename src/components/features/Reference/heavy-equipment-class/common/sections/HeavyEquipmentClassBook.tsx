import { Badge } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteHeavyEquipmentClass } from '@/services/graphql/mutation/heavy-equipment-class/useDeleteHeavyEquipmentClass';
import { useReadAllHeavyEquipmentClass } from '@/services/graphql/query/heavy-equipment-class/useReadAllHeavyEquipmentClass';
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const HeavyEquipmentClassBook = () => {
  const router = useRouter();
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const { t } = useTranslation('default');

  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [{ page, search }, setPage, setSearch] = useControlPanel(
    (state) => [
      state.heavyEquipmentClassState,
      state.setHeavyEquipmentClassPage,
      state.setSearchHeavyEquipmentClass,
    ],
    shallow
  );
  const [searchQuery] = useDebouncedValue<string>(search, 500);
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
  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(
      new Set<ISliceName>(['heavyEquipmentClassSlice'] as ISliceName[])
    );
  }, []);
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
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
    },
  });
  const [executeDelete, { loading }] = useDeleteHeavyEquipmentClass({
    onCompleted: () => {
      refetchHeavyEquipmentClasses();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage({ page: 1 });
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
    setPage({ page });
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
                const type = heavyEquipmentReferences.map((val) => (
                  <Badge key={val.id}>{val.modelName}</Badge>
                ));
                return type && type.length > 0 ? type : '-';
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
    page,
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
          setSearch({ search: e.currentTarget.value });
        },
        searchQuery,
        onSearch: () => {
          setPage({ page: 1 });
        },
        value: search,
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
