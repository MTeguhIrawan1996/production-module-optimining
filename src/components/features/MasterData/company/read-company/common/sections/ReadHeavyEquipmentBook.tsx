import { SelectProps } from '@mantine/core';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
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

import { useDeleteCompanyHeavyEquipment } from '@/services/graphql/mutation/heavy-equipment/useDeleteCompanyHeavyEquipment';
import { useReadAllBrand } from '@/services/graphql/query/heavy-equipment/useReadAllBrand';
import { useReadAllHeavyEquipmentRefrence } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipment';
import { useReadAllHeavyEquipmentCompany } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentCompany';
import { useReadAllHeavyEquipmentType } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentType';
import { useReadAllHeavyEquipmentClass } from '@/services/graphql/query/heavy-equipment-class/useReadAllHeavyEquipmentClass';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

const ReadHeavyEquipmentBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('hp')) || 1;
  const companyPage = Number(pageParams.get('cp')) || 1;
  const url = `/master-data/company/read/${id}?cp=${companyPage}&hp=1`;
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);
  const [heavyEquipmentId, setHeavyEquipmentId] = React.useState<string>('');
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
    heavyEquipmentsCompany,
    heavyEquipmentsCompanyMeta,
    heavyEquipmentCompanyLoading,
    refetchHeavyEquipmentCompany,
  } = useReadAllHeavyEquipmentCompany({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
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
    });
  const { heavyEquipmentClassesData } = useReadAllHeavyEquipmentClass({
    variables: {
      limit: 15,
      search: classSearchQuery === '' ? null : classSearchQuery,
    },
  });

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [executeDelete, { loading }] = useDeleteCompanyHeavyEquipment({
    onCompleted: () => {
      refetchHeavyEquipmentCompany();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push(url, undefined, { shallow: true });
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
    const urlSet = `/master-data/company/read/${id}?cp=${companyPage}&hp=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const filter = React.useMemo(() => {
    const item: SelectProps[] = [
      {
        onChange: (value) => {
          router.push(url, undefined, { shallow: true });
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
          router.push(url, undefined, { shallow: true });
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
          router.push(url, undefined, { shallow: true });
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
          router.push(url, undefined, { shallow: true });
          setClasslId(value);
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
                heavyEquipment?.reference?.type?.brand?.name,
            },
            {
              accessor: 'type',
              title: t('commonTypography.heavyEquipmentType'),
              render: ({ heavyEquipment }) =>
                heavyEquipment?.reference?.type?.name,
            },
            {
              accessor: 'model',
              title: t('commonTypography.model'),
              render: ({ heavyEquipment }) =>
                heavyEquipment?.reference?.modelName,
            },
            {
              accessor: 'specification',
              title: t('commonTypography.specification'),
              render: ({ heavyEquipment }) => heavyEquipment?.specification,
            },
            {
              accessor: 'class',
              title: t('commonTypography.class'),
              render: ({ heavyEquipment }) => heavyEquipment?.class?.name,
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
                      : t('commonTypography.inComplete')
                  }
                />
              ),
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
                        router.push(
                          `/master-data/heavy-equipment/update/${id}`
                        );
                      },
                    }}
                    actionDelete={{
                      onClick: (e) => {
                        e.stopPropagation();
                        setIsOpenDeleteConfirmation((prev) => !prev);
                        setHeavyEquipmentId(id);
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
            label: t('heavyEquipment.createHeavyEquipment'),
            onClick: () => setIsOpenSelectionModal((prev) => !prev),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: heavyEquipmentsCompanyMeta?.totalAllData ?? 0,
          totalData: heavyEquipmentsCompanyMeta?.totalData ?? 0,
          totalPage: heavyEquipmentsCompanyMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heavyEquipmentsCompany, heavyEquipmentCompanyLoading]);

  return (
    <DashboardCard
      title={t('commonTypography.heavyEquipment')}
      addButton={{
        label: t('heavyEquipment.createHeavyEquipment'),
        onClick: () => setIsOpenSelectionModal((prev) => !prev),
      }}
      searchBar={{
        placeholder: t('heavyEquipment.searchPlaceholderOverview'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
        },
        searchQuery: searchQuery,
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
              `/master-data/company/create/human-resources-available/${id}`
            ),
        }}
      />
    </DashboardCard>
  );
};

export default ReadHeavyEquipmentBook;
