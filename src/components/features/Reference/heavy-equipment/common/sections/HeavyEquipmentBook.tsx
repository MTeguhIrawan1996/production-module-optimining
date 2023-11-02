import { SelectProps } from '@mantine/core';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

import {
  IBrandData,
  useReadAllBrand,
} from '@/services/graphql/query/heavy-equipment/useReadAllBrand';
import { useReadAllHeavyEquipment } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipment';
import {
  IHeavyEquipmentModelData,
  useReadAllHeavyEquipmentModel,
} from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentModel';
import {
  IHeavyEquipmentTypeData,
  useReadAllHeavyEquipmentType,
} from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentType';

const HeavyEquipmentBook = () => {
  const router = useRouter();
  const { t } = useTranslation('default');
  const [page, setPage] = React.useState<number>(1);
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
  const { modelData } = useReadAllHeavyEquipmentModel({
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
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== FilterData =========== */
  const renderBrands = React.useCallback((value: IBrandData) => {
    return {
      label: value.name,
      value: value.id,
    };
  }, []);
  const brandItems = brandsData?.map(renderBrands);

  const renderTypes = React.useCallback((value: IHeavyEquipmentTypeData) => {
    return {
      label: value.name,
      value: value.id,
    };
  }, []);
  const typeItems = typesData?.map(renderTypes);

  const renderModel = React.useCallback((value: IHeavyEquipmentModelData) => {
    return {
      label: value.name,
      value: value.id,
    };
  }, []);
  const modelItems = modelData?.map(renderModel);
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
        label: t('commonTypography.brand'),
        placeholder: t('heavyEquipment.chooseBrand'),
        searchable: true,
        clearable: true,
        nothingFound: null,
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
        label: t('commonTypography.type'),
        placeholder: t('heavyEquipment.chooseType'),
        searchable: true,
        clearable: true,
        nothingFound: null,
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
        label: t('commonTypography.model'),
        placeholder: t('heavyEquipment.chooseModel'),
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
    brandItems,
    typeSearchTerm,
    typeItems,
    modelSearchTerm,
    modelItems,
  ]);

  /* #endregion  /**======== Filter =========== */

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
    </DashboardCard>
  );
};

export default HeavyEquipmentBook;
