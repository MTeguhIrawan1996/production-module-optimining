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
import { IFilterButtonProps } from '@/components/elements/button/FilterButton';

import { useDeleteMasterHeavyEquipment } from '@/services/graphql/mutation/master-data-heavy-equipment/useDeleteMasterHeavyEquipment';
import { useReadAllBrand } from '@/services/graphql/query/heavy-equipment/useReadAllBrand';
import { useReadAllHeavyEquipmentRefrence } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipment';
import { useReadAllHeavyEquipmentMasterData } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentMasterData';
import { useReadAllHeavyEquipmentType } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentType';
import { useReadAllHeavyEquipmentClass } from '@/services/graphql/query/heavy-equipment-class/useReadAllHeavyEquipmentClass';
import { normalizedFilterBadge } from '@/utils/helper/normalizedFilterBadge';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

const HeavyEquipmentMasterBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');

  const [
    hasHydrated,
    {
      page,
      search,
      filterBrandId,
      filterTypeId,
      filterClassId,
      filterModelId,
      filterBadgeValue,
    },
    setHeavyEquipmentState,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
      state.heavyEquipmentState,
      state.setHeavyEquipmentState,
    ],
    shallow
  );

  const permissions = useStore(usePermissions, (state) => state.permissions);
  const [searchQuery] = useDebouncedValue<string>(search || '', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [id, setId] = React.useState<string>('');
  const [brandSearchTerm, setBrandSearchTerm] = React.useState<string>('');
  const [brandSearchQuery] = useDebouncedValue<string>(brandSearchTerm, 400);
  const [typeSearchTerm, setTypeSearchTerm] = React.useState<string>('');
  const [typeSearchQuery] = useDebouncedValue<string>(typeSearchTerm, 400);
  const [modelSearchTerm, setModelSearchTerm] = React.useState<string>('');
  const [modelSearchQuery] = useDebouncedValue<string>(modelSearchTerm, 400);
  const [classSearchTerm, setClassSearchTerm] = React.useState<string>('');
  const [classSearchQuery] = useDebouncedValue<string>(classSearchTerm, 400);

  const isPermissionCreate = permissions?.includes('create-heavy-equipment');
  const isPermissionUpdate = permissions?.includes('update-heavy-equipment');
  const isPermissionDelete = permissions?.includes('delete-heavy-equipment');
  const isPermissionRead = permissions?.includes('read-heavy-equipment');

  const {
    heavyEquipmentsMasterData,
    heavyEquipmentMasterDataLoading,
    heavyEquipmentsMasterDataMeta,
    refetchHeavyEquipmentMasterData,
  } = useReadAllHeavyEquipmentMasterData({
    variables: {
      limit: 10,
      page: 1,
      orderBy: 'createdAt',
      orderDir: 'desc',
    },
  });
  const { brandsData } = useReadAllBrand({
    variables: {
      limit: null,
      search: brandSearchQuery === '' ? null : brandSearchQuery,
    },
  });
  const { typesData } = useReadAllHeavyEquipmentType({
    variables: {
      limit: null,
      search: typeSearchQuery === '' ? null : typeSearchQuery,
      brandId: filterBrandId,
    },
  });
  const { heavyEquipmentsData: modelRefrence } =
    useReadAllHeavyEquipmentRefrence({
      variables: {
        limit: null,
        search: modelSearchQuery === '' ? null : modelSearchQuery,
        brandId: filterBrandId,
        typeId: filterTypeId,
      },
    });
  const { heavyEquipmentClassesData } = useReadAllHeavyEquipmentClass({
    variables: {
      limit: null,
      search: classSearchQuery === '' ? null : classSearchQuery,
    },
  });

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(
      new Set<ISliceName>(['heavyEquipmentSlice'] as ISliceName[])
    );
  }, []);

  React.useEffect(() => {
    if (hasHydrated) {
      refetchHeavyEquipmentMasterData({
        page,
        brandId: filterBrandId,
        typeId: filterTypeId,
        referenceId: filterModelId,
        classId: filterClassId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const [executeDelete, { loading }] = useDeleteMasterHeavyEquipment({
    onCompleted: () => {
      setIsOpenDeleteConfirmation((prev) => !prev);
      setHeavyEquipmentState({
        page: 1,
      });
      refetchHeavyEquipmentMasterData({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipment.successDeleteMasterMessage'),
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

  const heavyEquipmentItem = modelRefrence?.map((val) => {
    return {
      name: val.modelName,
      id: val.id,
    };
  });

  const { uncombinedItem: modelItems } = useFilterItems({
    data: heavyEquipmentItem ?? [],
  });

  const { uncombinedItem: brandItems } = useFilterItems({
    data: brandsData ?? [],
  });
  const { uncombinedItem: typeItems } = useFilterItems({
    data: typesData ?? [],
  });
  const { uncombinedItem: classItems } = useFilterItems({
    data: heavyEquipmentClassesData ?? [],
  });

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
      },
    });
  };

  const handleSetPage = (page: number) => {
    setHeavyEquipmentState({
      page: page,
    });
    refetchHeavyEquipmentMasterData({ page: page });
  };

  const filter = React.useMemo(() => {
    const item: IFilterButtonProps = {
      multipleFilter: [
        {
          selectItem: {
            onChange: (value) => {
              setHeavyEquipmentState({
                page: 1,
                filterBrandId: value,
                filterTypeId: null,
                filterModelId: null,
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
            value: filterBrandId,
          },
          col: 6,
        },
        {
          selectItem: {
            onChange: (value) => {
              setHeavyEquipmentState({
                page: 1,
                filterTypeId: value,
                filterModelId: null,
              });
            },
            value: filterTypeId,
            data: typeItems ?? [],
            label: 'type',
            placeholder: 'chooseType',
            searchable: true,
            nothingFound: null,
            clearable: true,
            onSearchChange: setTypeSearchTerm,
            searchValue: typeSearchTerm,
            disabled: !filterBrandId,
          },
          col: 6,
        },
        {
          selectItem: {
            onChange: (value) => {
              setHeavyEquipmentState({
                page: 1,
                filterModelId: value,
              });
            },
            value: filterModelId,
            data: modelItems ?? [],
            label: 'model',
            placeholder: 'chooseModel',
            searchable: true,
            nothingFound: null,
            clearable: true,
            onSearchChange: setModelSearchTerm,
            searchValue: modelSearchTerm,
            disabled: !filterTypeId,
          },
          col: 6,
        },
        {
          selectItem: {
            onChange: (value) => {
              setHeavyEquipmentState({
                page: 1,
                filterClassId: value,
              });
            },
            value: filterClassId,
            data: classItems ?? [],
            label: 'class',
            placeholder: 'chooseClass',
            searchable: true,
            nothingFound: null,
            clearable: true,
            onSearchChange: setClassSearchTerm,
            searchValue: classSearchTerm,
          },
          col: 6,
        },
      ],
    };
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    brandSearchTerm,
    typeSearchTerm,
    classSearchTerm,
    modelSearchTerm,
    typeItems,
    classItems,
    modelItems,
    brandItems,
  ]);

  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          highlightOnHover: true,
          columns: [
            {
              accessor: 'engineNumber',
              title: t('commonTypography.engineNumber'),
            },
            {
              accessor: 'chassisNumber',
              title: t('commonTypography.frameNumber'),
            },
            {
              accessor: 'type',
              title: t('heavyEquipment.typeHeavyEquipment'),
              render: ({ reference }) => reference?.type?.name,
            },
            {
              accessor: 'model',
              title: t('commonTypography.model'),
              render: ({ reference }) => reference?.modelName,
            },
            {
              accessor: 'brand',
              title: t('commonTypography.brand'),
              render: ({ reference }) => reference?.type?.brand?.name,
            },
            {
              accessor: 'specification',
              title: t('commonTypography.specification'),
              render: ({ reference }) => reference?.spec ?? '-',
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
                                `/master-data/heavy-equipment/read/${id}`
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
                                `/master-data/heavy-equipment/update/${id}`
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
          fetching: heavyEquipmentMasterDataLoading,
          records: heavyEquipmentsMasterData,
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: isPermissionCreate
            ? {
                label: t('heavyEquipment.createHeavyEquipment'),
                onClick: () =>
                  router.push('/master-data/heavy-equipment/create'),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page || 1,
          totalAllData: heavyEquipmentsMasterDataMeta?.totalAllData ?? 0,
          totalData: heavyEquipmentsMasterDataMeta?.totalData ?? 0,
          totalPage: heavyEquipmentsMasterDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    heavyEquipmentsMasterData,
    heavyEquipmentMasterDataLoading,
    isPermissionRead,
    isPermissionDelete,
    isPermissionUpdate,
    isPermissionCreate,
  ]);

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              label: t('heavyEquipment.createHeavyEquipment'),
              onClick: () => router.push('/master-data/heavy-equipment/create'),
            }
          : undefined
      }
      searchBar={{
        placeholder: t('heavyEquipment.searchPlaceholderMaster'),
        onChange: (e) => {
          setHeavyEquipmentState({
            search: e.currentTarget.value,
          });
        },
        onSearch: () => {
          setHeavyEquipmentState({
            page: 1,
          });
          refetchHeavyEquipmentMasterData({
            page: 1,
            search: searchQuery === '' ? null : searchQuery,
          });
        },
        searchQuery: searchQuery,
        value: search || '',
      }}
      filterBadge={{
        resetButton: {
          onClick: () => {
            setHeavyEquipmentState({
              page: 1,
              filterBadgeValue: null,
              filterBrandId: null,
              filterTypeId: null,
              filterModelId: null,
              filterClassId: null,
            });
            refetchHeavyEquipmentMasterData({
              page: 1,
              brandId: null,
              typeId: null,
              referenceId: null,
              classId: null,
            });
          },
        },
        value: filterBadgeValue,
      }}
      filter={{
        multipleFilter: filter.multipleFilter,
        filterButton: {
          disabled:
            filterBrandId || filterTypeId || filterModelId || filterClassId
              ? false
              : true,
          onClick: () => {
            refetchHeavyEquipmentMasterData({
              page: 1,
              brandId: filterBrandId,
              typeId: filterTypeId,
              referenceId: filterModelId,
              classId: filterClassId,
            });
            const badgeFilterValue = normalizedFilterBadge(
              filter.multipleFilter || []
            );
            setHeavyEquipmentState({
              page: 1,
              filterBadgeValue: badgeFilterValue || null,
            });
          },
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

export default HeavyEquipmentMasterBook;
