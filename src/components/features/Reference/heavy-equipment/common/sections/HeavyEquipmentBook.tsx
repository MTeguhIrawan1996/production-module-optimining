import { SelectProps } from '@mantine/core';
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

import { useDeleteHeavyEquipmentReference } from '@/services/graphql/mutation/reference-heavy-equipment/useDeleteRefrenceHeavyEquipment';
import { useReadAllBrand } from '@/services/graphql/query/heavy-equipment/useReadAllBrand';
import { useReadAllHeavyEquipmentRefrence } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipment';
import { useReadAllHeavyEquipmentType } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentType';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import useControlPanel from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const HeavyEquipmentBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const permissions = useStore(usePermissions, (state) => state.permissions);
  const [{ page, search, brandId, typeId }, setHeavyEquipmentReferenceState] =
    useControlPanel(
      (state) => [
        state.heavyEquipmentReferenceState,
        state.setHeavyEquipmentReferenceState,
      ],
      shallow
    );
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [searchQuery] = useDebouncedValue<string>(search, 500);
  const [brandSearchTerm, setBrandSearchTerm] = React.useState<string>('');
  const [brandSearchQuery] = useDebouncedValue<string>(brandSearchTerm, 400);
  const [typeSearchTerm, settypeSearchTerm] = React.useState<string>('');
  const [typeSearchQuery] = useDebouncedValue<string>(typeSearchTerm, 400);

  const isPermissionCreate = permissions?.includes(
    'create-heavy-equipment-reference'
  );
  const isPermissionUpdate = permissions?.includes(
    'update-heavy-equipment-reference'
  );
  const isPermissionDelete = permissions?.includes(
    'delete-heavy-equipment-reference'
  );
  const isPermissionRead = permissions?.includes(
    'read-heavy-equipment-reference'
  );

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
  }, []);

  /* #   /**=========== Query =========== */
  const { brandsData } = useReadAllBrand({
    variables: {
      limit: 15,
      search: brandSearchQuery === '' ? null : brandSearchQuery,
    },
  });
  const { typesData } = useReadAllHeavyEquipmentType({
    variables: {
      limit: 15,
      search: typeSearchQuery === '' ? null : typeSearchQuery,
      brandId,
    },
  });
  const {
    heavyEquipmentsData,
    heavyEquipmentDataLoading,
    heavyEquipmentsDataMeta,
    refetchHeavyEquipments,
  } = useReadAllHeavyEquipmentRefrence({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
      brandId,
      typeId,
    },
  });
  const [executeDelete, { loading }] = useDeleteHeavyEquipmentReference({
    onCompleted: () => {
      refetchHeavyEquipments();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setHeavyEquipmentReferenceState({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipment.successDeleteMessage'),
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

  /* #   /**=========== FilterData =========== */

  const { uncombinedItem: brandItems } = useCombineFilterItems({
    data: brandsData ?? [],
  });
  const { uncombinedItem: typeItems } = useCombineFilterItems({
    data: typesData ?? [],
  });
  /* #endregion  /**======== FilterData =========== */

  /* #   /**=========== FilterRender =========== */
  const filter = React.useMemo(() => {
    const item: SelectProps[] = [
      {
        onChange: (value) => {
          setHeavyEquipmentReferenceState({
            page: 1,
            brandId: value,
            typeId: null,
          });
        },
        data: brandItems ?? [],
        label: 'brand',
        placeholder: 'chooseBrand',
        searchable: true,
        nothingFound: null,
        clearable: true,
        onSearchChange: setBrandSearchTerm,
        searchValue: brandSearchTerm,
        value: brandId,
      },
      {
        onChange: (value) => {
          setHeavyEquipmentReferenceState({ page: 1, typeId: value });
        },
        value: typeId,
        data: typeItems ?? [],
        label: 'type',
        placeholder: 'chooseType',
        searchable: true,
        nothingFound: null,
        clearable: true,
        onSearchChange: settypeSearchTerm,
        searchValue: typeSearchTerm,
        disabled: !brandId,
      },
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandSearchTerm, brandsData, typeSearchTerm, typeItems]);
  /* #endregion  /**======== FilterRender =========== */

  /* #   /**=========== HandleClickFc =========== */
  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
      },
    });
  };
  const handleSetPage = (page: number) => {
    setHeavyEquipmentReferenceState({ page });
  };
  /* #endregion  /**======== HandleClickFc =========== */

  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          highlightOnHover: true,
          columns: [
            {
              accessor: 'type',
              title: t('commonTypography.type'),
              render: ({ type }) => type.name,
            },
            {
              accessor: 'brand',
              title: t('commonTypography.brand'),
              render: ({ type }) => type.brand.name,
            },
            {
              accessor: 'modelName',
              title: t('commonTypography.model'),
            },
            {
              accessor: 'modelYear',
              title: t('commonTypography.yearModel'),
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/reference/heavy-equipment/read/${id}`
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
                                `/reference/heavy-equipment/update/${id}`
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
          fetching: heavyEquipmentDataLoading,
          records: heavyEquipmentsData,
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: isPermissionCreate
            ? {
                label: t('heavyEquipment.createHeavyEquipment'),
                onClick: () => router.push('/reference/heavy-equipment/create'),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: heavyEquipmentsDataMeta?.totalAllData ?? 0,
          totalData: heavyEquipmentsDataMeta?.totalData ?? 0,
          totalPage: heavyEquipmentsDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    heavyEquipmentsData,
    heavyEquipmentDataLoading,
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
              label: t('heavyEquipment.createHeavyEquipment'),
              onClick: () => router.push('/reference/heavy-equipment/create'),
            }
          : undefined
      }
      searchBar={{
        onChange: (e) => {
          setHeavyEquipmentReferenceState({ search: e.currentTarget.value });
        },
        searchQuery,
        onSearch: () => {
          setHeavyEquipmentReferenceState({ page: 1 });
          refetchHeavyEquipments({ page: 1 });
        },
        placeholder: t('heavyEquipment.searchPlaceholder'),
        value: search,
      }}
      MultipleFilter={{
        MultipleFilterData: filter,
        colSpan: 2,
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

export default HeavyEquipmentBook;
