import { Divider, Group } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconChevronLeft, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  DashboardCard,
  GlobalActionTable,
  MantineDataTable,
  PrimaryButton,
} from '@/components/elements';

import { useCreateCompanyHeavyEquipmentBulk } from '@/services/graphql/mutation/heavy-equipment/useCreateCompanyHeavyEquipmentAvailable';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { IHeavyEquipmentMasterData } from '@/services/graphql/query/heavy-equipment/useReadAllHeavyEquipmentMasterData';
import { useReadAllNonCompanyHeavyEquipment } from '@/services/graphql/query/heavy-equipment/useReadAllNonCompanyHeavyEquipment';
import { sendGAEvent } from '@/utils/helper/analytics';
import useControlPanel from '@/utils/store/useControlPanel';

const CreateHeavyEquipmentAvailableBook = () => {
  const router = useRouter();
  const [page, setPage] = React.useState<number>(1);
  const { t } = useTranslation('default');
  const companyId = router.query?.id as string;
  const urlCreate = `/master-data/company/read/${companyId}`;
  const [resetHeavyEquipmentCompanyState] = useControlPanel(
    (state) => [state.resetHeavyEquipmentCompanyState],
    shallow
  );
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [choosesHeavyEquipment, setChooseHeavyEquipment] = React.useState<
    IHeavyEquipmentMasterData[]
  >([]);
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  const {
    nonOwnedByCompanyHeavyEquipmentsData,
    nonOwnedByCompanyHeavyEquipmentsDataLoading,
    nonOwnedByCompanyHeavyEquipmentsDataMeta,
    refetchNonOwnedByCompanyHeavyEquipments,
  } = useReadAllNonCompanyHeavyEquipment({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
      excludeIds: choosesHeavyEquipment.map((val) => val.id) ?? null,
    },
  });

  const [executeCreate, { loading }] = useCreateCompanyHeavyEquipmentBulk({
    onCompleted: () => {
      sendGAEvent({
        event: 'Tambah',
        params: {
          category: 'Administrasi',
          subSubCategory: 'Administrasi - Perusahaan - Unit Alat Berat',
          subCategory: 'Administrasi - Perusahaan',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('heavyEquipment.successCreateCompanyMessage'),
        icon: <IconCheck />,
      });
      router.push(urlCreate);
      resetHeavyEquipmentCompanyState();
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: error.message,
          icon: <IconX />,
        });
      }
    },
  });

  const handleChoose = (data: IHeavyEquipmentMasterData) => {
    setChooseHeavyEquipment((prev) => [...prev, data]);
  };
  const handleDeleteSdm = (id: string) => {
    setChooseHeavyEquipment((prev) => prev.filter((val) => val.id !== id));
  };

  const handleCreate = async () => {
    const heavyEquipmentIds = choosesHeavyEquipment.map((val) => val.id);
    await executeCreate({
      variables: {
        companyId,
        heavyEquipmentIds,
      },
    });
  };

  const handleSetPage = (page: number) => {
    setPage(page);
  };

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: nonOwnedByCompanyHeavyEquipmentsData,
          fetching: nonOwnedByCompanyHeavyEquipmentsDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                nonOwnedByCompanyHeavyEquipmentsData &&
                nonOwnedByCompanyHeavyEquipmentsData.indexOf(record) + 1,
              width: 60,
            },
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
              render: ({ reference }) => reference?.spec,
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              render: (data) => {
                return (
                  <GlobalActionTable
                    actionChoose={{
                      onClick: (e) => {
                        e.stopPropagation();
                        handleChoose(data);
                      },
                    }}
                  />
                );
              },
            },
          ],
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('heavyEquipment.createHeavyEquipment'),
            onClick: () => router.push('/master-data/heavy-equipment/create'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData:
            nonOwnedByCompanyHeavyEquipmentsDataMeta?.totalAllData ?? 0,
          totalData: nonOwnedByCompanyHeavyEquipmentsDataMeta?.totalData ?? 0,
          totalPage: nonOwnedByCompanyHeavyEquipmentsDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nonOwnedByCompanyHeavyEquipmentsDataMeta,
    page,
    nonOwnedByCompanyHeavyEquipmentsDataLoading,
  ]);

  const choosetable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: choosesHeavyEquipment,
          highlightOnHover: true,
          minHeight: 200,
          emptyState: undefined,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                choosesHeavyEquipment &&
                choosesHeavyEquipment.indexOf(record) + 1,
              width: 60,
            },
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
              render: ({ reference }) => reference?.spec,
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              render: ({ id }) => {
                return (
                  <GlobalActionTable
                    actionDelete={{
                      onClick: (e) => {
                        e.stopPropagation();
                        handleDeleteSdm(id);
                      },
                    }}
                  />
                );
              },
            },
          ],
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosesHeavyEquipment]);
  /* #endregion  /**======== RenderTable =========== */
  return (
    <>
      <DashboardCard
        title={t('heavyEquipment.chooseAvailableHeavyEquipment')}
        searchBar={{
          placeholder: t('heavyEquipment.searchPlaceholderMaster'),
          onChange: (e) => {
            setSearchQuery(e.currentTarget.value);
          },
          searchQuery,
          onSearch: () => {
            setPage(1);
            refetchNonOwnedByCompanyHeavyEquipments({
              page: 1,
            });
          },
        }}
      >
        {renderTable}
      </DashboardCard>
      <Divider my="md" />
      <DashboardCard title={t('commonTypography.heavyEquipmentSelected')}>
        {choosetable}
        <Group w="100%" position="apart">
          <PrimaryButton
            type="button"
            variant="outline"
            leftIcon={<IconChevronLeft size="1rem" />}
            label={t('commonTypography.back')}
            onClick={() => router.push(urlCreate)}
          />

          <PrimaryButton
            label={t('commonTypography.save')}
            type="button"
            onClick={handleCreate}
            loading={loading}
          />
        </Group>
      </DashboardCard>
    </>
  );
};

export default CreateHeavyEquipmentAvailableBook;
