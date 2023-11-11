import { SelectProps } from '@mantine/core';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';
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

import { useDeleteMasterHeavyEquipment } from '@/services/graphql/mutation/master-data-heavy-equipment/useDeleteRefrenceHeavyEquipment';
import { useReadAllBrand } from '@/services/graphql/query/heavy-equipment/useReadAllBrand';
import { useReadAllHeavyEquipmentRefrence } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipment';
import { useReadAllHeavyEquipmentMasterData } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentMasterData';
import { useReadAllHeavyEquipmentType } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentType';
import { useReadAllHeavyEquipmentClass } from '@/services/graphql/query/heavy-equipment-class/useReadAllHeavyEquipmentClass';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

const HeavyEquipmentMasterBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [page, setPage] = React.useState<number>(1);
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [id, setId] = React.useState<string>('');
  const [brandSearchTerm, setBrandSearchTerm] = React.useState<string>('');
  const [brandSearchQuery] = useDebouncedValue<string>(brandSearchTerm, 400);
  const [brandId, setBrandId] = React.useState<string | null>(null);
  const [typeSearchTerm, setTypeSearchTerm] = React.useState<string>('');
  const [typeSearchQuery] = useDebouncedValue<string>(typeSearchTerm, 400);
  const [typeId, setTypeId] = React.useState<string | null>(null);
  const [modelSearchTerm, setModelSearchTerm] = React.useState<string>('');
  const [modelSearchQuery] = useDebouncedValue<string>(modelSearchTerm, 400);
  const [modelId, setModelId] = React.useState<string | null>(null);
  const [classSearchTerm, setClassSearchTerm] = React.useState<string>('');
  const [classSearchQuery] = useDebouncedValue<string>(classSearchTerm, 400);
  const [classId, setClasslId] = React.useState<string | null>(null);

  const {
    heavyEquipmentsMasterData,
    heavyEquipmentMasterDataLoading,
    heavyEquipmentsMasterDataMeta,
    refetchHeavyEquipmentMasterData,
  } = useReadAllHeavyEquipmentMasterData({
    variables: {
      limit: 10,
      page: page,
      search: searchQuery === '' ? null : searchQuery,
      brandId,
      typeId,
      referenceId: modelId,
      classId,
    },
  });
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
  const { heavyEquipmentsData: modelRefrence } =
    useReadAllHeavyEquipmentRefrence({
      variables: {
        limit: 15,
        search: modelSearchQuery === '' ? null : modelSearchQuery,
        brandId,
        typeId,
      },
    });
  const { heavyEquipmentClassesData } = useReadAllHeavyEquipmentClass({
    variables: {
      limit: 15,
      search: classSearchQuery === '' ? null : classSearchQuery,
    },
  });

  const [executeDelete, { loading }] = useDeleteMasterHeavyEquipment({
    onCompleted: () => {
      refetchHeavyEquipmentMasterData();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage(1);
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
  const heavyEquipmentClassItem = heavyEquipmentClassesData?.map((val) => {
    return {
      name: val.name,
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
  const { uncombinedItem: classItem } = useFilterItems({
    data: heavyEquipmentClassItem ?? [],
  });

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
      },
    });
  };

  const filter = React.useMemo(() => {
    const item: SelectProps[] = [
      {
        onChange: (value) => {
          setPage(1);
          setBrandId(value);
          setTypeId(null);
          setModelId(null);
        },
        data: brandItems ?? [],
        label: 'brand',
        placeholder: 'chooseBrand',
        searchable: true,
        nothingFound: null,
        clearable: true,
        onSearchChange: setBrandSearchTerm,
        searchValue: brandSearchTerm,
      },
      {
        onChange: (value) => {
          setPage(1);
          setTypeId(value);
          setModelId(null);
        },
        value: typeId,
        data: typeItems ?? [],
        label: 'type',
        placeholder: 'chooseType',
        searchable: true,
        nothingFound: null,
        clearable: true,
        onSearchChange: setTypeSearchTerm,
        searchValue: typeSearchTerm,
      },
      {
        onChange: (value) => {
          setPage(1);
          setModelId(value);
        },
        value: modelId,
        data: modelItems ?? [],
        label: 'model',
        placeholder: 'chooseModel',
        searchable: true,
        nothingFound: null,
        clearable: true,
        onSearchChange: setModelSearchTerm,
        searchValue: modelSearchTerm,
      },
      {
        onChange: (value) => {
          setPage(1);
          setClasslId(value);
        },
        value: classId,
        data: classItem ?? [],
        label: 'class',
        placeholder: 'chooseClass',
        searchable: true,
        nothingFound: null,
        clearable: true,
        onSearchChange: setClassSearchTerm,
        searchValue: classSearchTerm,
      },
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandSearchTerm, brandsData, typeSearchTerm, typeItems]);

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
              title: t('commonTypography.model'),
              render: ({ reference }) => reference.modelName,
            },
            {
              accessor: 'brand',
              title: t('commonTypography.brand'),
              render: ({ reference }) => reference.type.brand.name,
            },
            {
              accessor: 'specification',
              title: t('commonTypography.specification'),
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
                        router.push(`/master-data/heavy-equipment/read/${id}`);
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(`/reference/heavy-equipment/update/${id}`);
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
          fetching: heavyEquipmentMasterDataLoading,
          records: heavyEquipmentsMasterData,
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('heavyEquipment.createHeavyEquipment'),
            onClick: () => router.push('/reference/heavy-equipment/create'),
          },
        }}
        paginationProps={{
          setPage: setPage,
          currentPage: page,
          totalAllData: heavyEquipmentsMasterDataMeta?.totalAllData ?? 0,
          totalData: heavyEquipmentsMasterDataMeta?.totalData ?? 0,
          totalPage: heavyEquipmentsMasterDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heavyEquipmentsMasterData, heavyEquipmentMasterDataLoading]);

  return (
    <DashboardCard
      addButton={{
        label: t('heavyEquipment.createHeavyEquipment'),
        onClick: () => router.push('/master-data/human-resources/create'),
      }}
      searchBar={{
        placeholder: t('heavyEquipment.searchPlaceholderMaster'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        onSearch: () => {
          setPage(1);
        },
      }}
      MultipleFilter={{
        MultipleFilterData: filter,
        colSpan: 4,
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
