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
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
  SelectionButtonModal,
} from '@/components/elements';

import { useDeleteCompanyHeavyEquipment } from '@/services/graphql/mutation/heavy-equipment/useDeleteCompanyHeavyEquipment';
import { useReadAllBrand } from '@/services/graphql/query/heavy-equipment/useReadAllBrand';
import { useReadAllHeavyEquipmentRefrence } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipment';
import { useReadAllHeavyEquipmentCompany } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentCompany';
import { useReadAllHeavyEquipmentType } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentType';
import { useReadAllHeavyEquipmentClass } from '@/services/graphql/query/heavy-equipment-class/useReadAllHeavyEquipmentClass';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import useControlPanel from '@/utils/store/useControlPanel';

const ReadHeavyEquipmentBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [
    { page, search, brandId, typeId, modelId, classId },
    setHeavyEquipmentCompanyState,
  ] = useControlPanel(
    (state) => [
      state.heavyEquipmentCompanyState,
      state.setHeavyEquipmentCompanyState,
    ],
    shallow
  );
  const [searchQuery] = useDebouncedValue<string>(search || '', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);
  const [heavyEquipmentId, setHeavyEquipmentId] = React.useState<string>('');
  const [brandSearchTerm, setBrandSearchTerm] = React.useState<string>('');
  const [brandSearchQuery] = useDebouncedValue<string>(brandSearchTerm, 400);
  const [typeSearchTerm, setTypeSearchTerm] = React.useState<string>('');
  const [typeSearchQuery] = useDebouncedValue<string>(typeSearchTerm, 400);
  const [modelSearchTerm, setModelSearchTerm] = React.useState<string>('');
  const [modelSearchQuery] = useDebouncedValue<string>(modelSearchTerm, 400);
  const [classSearchTerm, setClassSearchTerm] = React.useState<string>('');
  const [classSearchQuery] = useDebouncedValue<string>(classSearchTerm, 400);

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
  }, []);

  const {
    heavyEquipmentsCompany,
    heavyEquipmentsCompanyMeta,
    heavyEquipmentCompanyLoading,
    refetchHeavyEquipmentCompany,
  } = useReadAllHeavyEquipmentCompany({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
      brandId,
      typeId,
      referenceId: modelId,
      classId,
      companyId: id,
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
      fetchPolicy: 'cache-and-network',
    });
  const { heavyEquipmentClassesData } = useReadAllHeavyEquipmentClass({
    variables: {
      limit: 15,
      search: classSearchQuery === '' ? null : classSearchQuery,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [executeDelete, { loading }] = useDeleteCompanyHeavyEquipment({
    onCompleted: () => {
      refetchHeavyEquipmentCompany();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setHeavyEquipmentCompanyState({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipment.successDeleteCompanyMessage'),
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
        id: heavyEquipmentId,
      },
    });
  };

  const handleSetPage = (page: number) => {
    setHeavyEquipmentCompanyState({ page });
  };

  const filter = React.useMemo(() => {
    const item: SelectProps[] = [
      {
        onChange: (value) => {
          setHeavyEquipmentCompanyState({
            page: 1,
            brandId: value,
            typeId: null,
            modelId: null,
          });
        },
        value: brandId,
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
          setHeavyEquipmentCompanyState({
            page: 1,
            typeId: value,
            modelId: null,
          });
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
        disabled: !brandId,
      },
      {
        onChange: (value) => {
          setHeavyEquipmentCompanyState({ page: 1, modelId: value });
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
        disabled: !typeId,
      },
      {
        onChange: (value) => {
          setHeavyEquipmentCompanyState({ page: 1, classId: value });
        },
        value: classId,
        data: classItems ?? [],
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
              accessor: 'hullNumber',
              title: t('commonTypography.heavyEquipmentCode'),
            },
            {
              accessor: 'brand',
              title: t('commonTypography.brand'),
              render: ({ heavyEquipment }) =>
                heavyEquipment?.reference?.type?.brand?.name ?? '-',
            },
            {
              accessor: 'type',
              title: t('commonTypography.heavyEquipmentType'),
              render: ({ heavyEquipment }) =>
                heavyEquipment?.reference?.type?.name ?? '-',
            },
            {
              accessor: 'model',
              title: t('commonTypography.model'),
              render: ({ heavyEquipment }) =>
                heavyEquipment?.reference?.modelName ?? '-',
            },
            {
              accessor: 'specification',
              title: t('commonTypography.specification'),
              render: ({ heavyEquipment }) =>
                heavyEquipment?.reference?.spec ?? '-',
            },
            {
              accessor: 'class',
              title: t('commonTypography.class'),
              render: ({ heavyEquipment }) =>
                heavyEquipment?.class?.name ?? '-',
            },
            {
              accessor: 'formStatus',
              title: t('commonTypography.formStatus'),
              render: ({ isComplete }) => (
                <GlobalBadgeStatus
                  color={isComplete ? 'blue.6' : 'gray.6'}
                  label={
                    isComplete
                      ? t('commonTypography.complete')
                      : t('commonTypography.unComplete')
                  }
                />
              ),
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              render: ({ id: heavyEquipmentId }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/master-data/company/read/heavy-equipment/${id}/${heavyEquipmentId}`
                        );
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/master-data/company/update/heavy-equipment/${id}/${heavyEquipmentId}`
                        );
                      },
                    }}
                    actionDelete={{
                      onClick: (e) => {
                        e.stopPropagation();
                        setIsOpenDeleteConfirmation((prev) => !prev);
                        setHeavyEquipmentId(heavyEquipmentId);
                      },
                    }}
                  />
                );
              },
            },
          ],
          fetching: heavyEquipmentCompanyLoading,
          records: heavyEquipmentsCompany,
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: 'Tambah Unit Alat Berat',
            onClick: () => setIsOpenSelectionModal((prev) => !prev),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page || 0,
          totalAllData: heavyEquipmentsCompanyMeta?.totalAllData ?? 0,
          totalData: heavyEquipmentsCompanyMeta?.totalData ?? 0,
          totalPage: heavyEquipmentsCompanyMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heavyEquipmentsCompany, heavyEquipmentCompanyLoading, page]);

  return (
    <DashboardCard
      title={`Unit ${t('commonTypography.heavyEquipment')}`}
      addButton={{
        label: 'Tambah Unit Alat Berat',
        onClick: () => setIsOpenSelectionModal((prev) => !prev),
      }}
      searchBar={{
        placeholder: t('heavyEquipment.searchPlaceholderOverview'),
        onChange: (e) => {
          setHeavyEquipmentCompanyState({ search: e.currentTarget.value });
        },
        onSearch: () => {
          setHeavyEquipmentCompanyState({ page: 1 });
          refetchHeavyEquipmentCompany({
            page: 1,
          });
        },
        searchQuery: searchQuery,
        value: search || '',
      }}
      MultipleFilter={{
        MultipleFilterData: filter,
        colSpan: 4,
      }}
      enebleBackBottomInner={{
        onClick: () => router.push('/master-data/company'),
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
      <SelectionButtonModal
        isOpenSelectionModal={isOpenSelectionModal}
        actionSelectionModal={() => setIsOpenSelectionModal((prev) => !prev)}
        firstButton={{
          label: t('heavyEquipment.createNewHeavyEquipment'),
          onClick: () =>
            router.push(`/master-data/company/create/heavy-equipment/${id}`),
        }}
        secondButton={{
          label: t('heavyEquipment.selectExistingHeavyEquipment'),
          onClick: () =>
            router.push(
              `/master-data/company/create/heavy-equipment-available/${id}`
            ),
        }}
      />
    </DashboardCard>
  );
};

export default ReadHeavyEquipmentBook;
