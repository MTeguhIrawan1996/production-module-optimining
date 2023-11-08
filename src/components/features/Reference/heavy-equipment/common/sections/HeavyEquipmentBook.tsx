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

import { useDeleteHeavyEquipmentReference } from '@/services/graphql/mutation/reference-heavy-equipment/useDeleteRefrenceHeavyEquipment';
import { useReadAllBrand } from '@/services/graphql/query/heavy-equipment/useReadAllBrand';
import { useReadAllHeavyEquipment } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipment';
import { useReadAllHeavyEquipmentModel } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentModel';
import { useReadAllHeavyEquipmentType } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentType';
import { useCombineFilterItems } from '@/utils/hooks/useCombineFIlterItems';

const HeavyEquipmentBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [page, setPage] = React.useState<number>(1);
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [brandSearchTerm, setBrandSearchTerm] = React.useState<string>('');
  const [brandSearchQuery] = useDebouncedValue<string>(brandSearchTerm, 400);
  const [brandId, setBrandId] = React.useState<string | null>(null);
  const [typeSearchTerm, settypeSearchTerm] = React.useState<string>('');
  const [typeSearchQuery] = useDebouncedValue<string>(typeSearchTerm, 400);
  const [typeId, setTypeId] = React.useState<string | null>(null);
  const [modelSearchTerm, setModelSearchTerm] = React.useState<string>('');
  const [modelSearchQuery] = useDebouncedValue<string>(modelSearchTerm, 400);
  const [modelId, setModelId] = React.useState<string | null>(null);

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
  const { modelsData } = useReadAllHeavyEquipmentModel({
    variables: {
      limit: 15,
      search: modelSearchQuery === '' ? null : modelSearchQuery,
      brandId,
      typeId,
    },
  });
  const {
    heavyEquipmentsData,
    heavyEquipmentDataLoading,
    heavyEquipmentsDataMeta,
    refetchHeavyEquipments,
  } = useReadAllHeavyEquipment({
    variables: {
      limit: 10,
      page: page,
      search: searchQuery === '' ? null : searchQuery,
      brandId,
      typeId,
      modelId,
    },
  });
  const [executeDelete, { loading }] = useDeleteHeavyEquipmentReference({
    onCompleted: () => {
      refetchHeavyEquipments();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setPage(1);
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
  const { uncombinedItem: modelItems } = useCombineFilterItems({
    data: modelsData ?? [],
  });
  /* #endregion  /**======== FilterData =========== */

  /* #   /**=========== FilterRender =========== */
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
        onSearchChange: settypeSearchTerm,
        searchValue: typeSearchTerm,
      },
      {
        onChange: (value) => {
          setPage(1);
          setModelId(value);
        },
        data: modelItems ?? [],
        value: modelId,
        label: 'model',
        placeholder: 'chooseModel',
        searchable: true,
        clearable: true,
        nothingFound: null,
        onSearchChange: setModelSearchTerm,
        searchValue: modelSearchTerm,
      },
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    brandSearchTerm,
    brandsData,
    typeSearchTerm,
    typeItems,
    modelSearchTerm,
    modelItems,
  ]);
  /* #endregion  /**======== FilterRender =========== */

  /* #   /**=========== HandleClickFc =========== */
  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
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
              accessor: 'type',
              title: t('commonTypography.type'),
              render: ({ model }) => model?.type.name,
            },
            {
              accessor: 'brand',
              title: t('commonTypography.brand'),
              render: ({ model }) => model?.type.brand.name,
            },
            {
              accessor: 'model.name',
              title: t('commonTypography.model'),
              render: ({ model }) => model?.name,
            },
            {
              accessor: 'createdYear',
              title: t('commonTypography.year'),
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
                        router.push(`/reference/heavy-equipment/read/${id}`);
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
          fetching: heavyEquipmentDataLoading,
          records: heavyEquipmentsData,
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
          totalAllData: heavyEquipmentsDataMeta?.totalAllData ?? 0,
          totalData: heavyEquipmentsDataMeta?.totalData ?? 0,
          totalPage: heavyEquipmentsDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heavyEquipmentsData, heavyEquipmentDataLoading]);

  return (
    <DashboardCard
      addButton={{
        label: t('heavyEquipment.createHeavyEquipment'),
        onClick: () => router.push('/reference/heavy-equipment/create'),
      }}
      searchBar={{
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        onSearch: () => {
          setPage(1);
        },
        placeholder: t('heavyEquipment.searchPlaceholder'),
      }}
      MultipleFilter={{
        MultipleFilterData: filter,
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
