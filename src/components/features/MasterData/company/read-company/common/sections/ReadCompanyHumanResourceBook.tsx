import { Divider, SelectProps } from '@mantine/core';
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

import { useDeleteCompanyHumanResource } from '@/services/graphql/mutation/master-data-company/useDeleteCompanyHumanResource';
import { useReadAllDivision } from '@/services/graphql/query/global-select/useReadAllDivision';
import { useReadAllEmployeStatus } from '@/services/graphql/query/global-select/useReadAllEmployeStatus';
import { useReadAllEmployePosition } from '@/services/graphql/query/global-select/useReadAllPosition';
import { useReadAllCompanyEmploye } from '@/services/graphql/query/master-data-company/useReadAllEmploye';
import {
  divisionSelect,
  employeStatusSelect,
  formStatusSelect,
  positionSelect,
} from '@/utils/constants/Field/global-field';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';
import useControlPanel from '@/utils/store/useControlPanel';

const ReadCompanyHumanResourceBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [
    { page, search, divisionId, employeStatusId, formStatus, positionId },
    setHumanResourceCompanyState,
  ] = useControlPanel(
    (state) => [
      state.humanResourceCompanyState,
      state.setHumanResourceCompanyState,
    ],
    shallow
  );
  const [employeId, setIdEmploye] = React.useState<string>('');
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [searchQuery] = useDebouncedValue<string>(search, 500);
  const [divisionSearchTerm, setDivisionSearchTerm] =
    React.useState<string>('');
  const [divisionSearchQuery] = useDebouncedValue<string>(
    divisionSearchTerm,
    400
  );
  const [positionSearchTerm, setPositionSearchTerm] =
    React.useState<string>('');
  const [positionSearchQuery] = useDebouncedValue<string>(
    positionSearchTerm,
    400
  );

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
  }, []);

  /* #   /**=========== Query =========== */
  const {
    employeesData,
    employeesDataLoading,
    employeesDataMeta,
    refetchEmployees,
  } = useReadAllCompanyEmploye({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      search: searchQuery === '' ? null : searchQuery,
      companyId: id,
      isComplete: formStatus ? (formStatus === 'true' ? true : false) : null,
      statusId: employeStatusId,
      positionId,
      divisionId,
    },
    skip: !router.isReady,
  });

  const { employeeStatusesData } = useReadAllEmployeStatus({
    variables: {
      limit: null,
    },
  });
  const { uncombinedItem: employeStatusFilter } = useFilterItems({
    data: employeeStatusesData ?? [],
  });

  const { employeePositionsData } = useReadAllEmployePosition({
    variables: {
      limit: null,
      search: positionSearchQuery === '' ? null : positionSearchQuery,
    },
  });
  const { uncombinedItem: employePositionFilter } = useFilterItems({
    data: employeePositionsData ?? [],
  });
  const { employeeDivisionsData } = useReadAllDivision({
    variables: {
      limit: null,
      search: divisionSearchQuery === '' ? null : divisionSearchQuery,
    },
  });
  const { uncombinedItem: employeDivisionFilter } = useFilterItems({
    data: employeeDivisionsData ?? [],
  });

  const [executeDelete, { loading }] = useDeleteCompanyHumanResource({
    onCompleted: () => {
      refetchEmployees();
      setIsOpenDeleteConfirmation((prev) => !prev);
      setHumanResourceCompanyState({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('humanResources.successDeleteMessage'),
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

  const filter = React.useMemo(() => {
    const divisionItem = divisionSelect({
      data: employeDivisionFilter,
      onSearchChange: setDivisionSearchTerm,
      searchValue: divisionSearchTerm,
      placeholder: 'chooseDivision',
      value: divisionId,
      onChange: (value) => {
        setHumanResourceCompanyState({ page: 1, divisionId: value });
      },
    });
    const positionItem = positionSelect({
      data: employePositionFilter,
      onSearchChange: setPositionSearchTerm,
      searchValue: positionSearchTerm,
      placeholder: 'choosePosition',
      value: positionId,
      onChange: (value) => {
        setHumanResourceCompanyState({ page: 1, positionId: value });
      },
    });
    const employeStatusItem = employeStatusSelect({
      data: employeStatusFilter,
      placeholder: 'chooseEmployeStatus',
      onChange: (value) => {
        setHumanResourceCompanyState({ page: 1, employeStatusId: value });
      },
      value: employeStatusId,
    });
    const formStatusItem = formStatusSelect({
      placeholder: 'chooseFormStatus',
      data: [
        {
          label: t('commonTypography.complete'),
          value: 'true',
        },
        {
          label: t('commonTypography.unComplete'),
          value: 'false',
        },
      ],
      value: formStatus,
      onChange: (value) => {
        setHumanResourceCompanyState({
          page: 1,
          formStatus: value,
        });
      },
    });
    const item: SelectProps[] = [
      divisionItem,
      positionItem,
      employeStatusItem,
      formStatusItem,
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    divisionSearchTerm,
    positionSearchTerm,
    employeStatusFilter,
    employePositionFilter,
    employeDivisionFilter,
  ]);

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id: employeId,
      },
    });
  };

  const handleSetPage = (page: number) => {
    setHumanResourceCompanyState({ page });
  };

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          highlightOnHover: true,
          shadow: 'none',
          columns: [
            {
              accessor: 'name',
              title: t('commonTypography.name'),
              render: ({ humanResource }) => humanResource?.name ?? '-',
            },
            {
              accessor: 'nip',
              title: t('commonTypography.nip'),
            },
            {
              accessor: 'divison',
              title: t('commonTypography.division'),
              render: ({ division }) => division?.name ?? '-',
            },
            {
              accessor: 'position',
              title: t('commonTypography.position'),
              render: ({ position }) => position?.name ?? '-',
            },
            {
              accessor: 'status',
              title: t('commonTypography.employeStatus'),
              render: ({ status }) => status?.name ?? '-',
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
              title: 'Aksi',
              render: ({ id: employeId }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/master-data/company/read/human-resources/${id}/${employeId}`
                        );
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/master-data/company/update/human-resources/${id}/${employeId}`
                        );
                      },
                    }}
                    actionDelete={{
                      onClick: (e) => {
                        e.stopPropagation();
                        setIsOpenDeleteConfirmation((prev) => !prev);
                        setIdEmploye(employeId);
                      },
                    }}
                  />
                );
              },
            },
          ],

          fetching: employeesDataLoading,
          records: employeesData,
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('humanResources.createHumanResources'),
            onClick: () => setIsOpenSelectionModal((prev) => !prev),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: employeesDataMeta?.totalAllData ?? 0,
          totalData: employeesDataMeta?.totalData ?? 0,
          totalPage: employeesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeesData, employeesDataLoading, page]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      title={t('commonTypography.humanResources2')}
      py={0}
      addButton={{
        label: t('humanResources.createHumanResources'),
        onClick: () => setIsOpenSelectionModal((prev) => !prev),
      }}
      searchBar={{
        onChange: (e) => {
          setHumanResourceCompanyState({ search: e.currentTarget.value });
        },
        searchQuery,
        value: search,
        onSearch: () => {
          setHumanResourceCompanyState({ page: 1 });
          refetchEmployees({
            page: 1,
          });
        },
        placeholder: 'Cari berdasarkan Nama dan NIP',
      }}
      MultipleFilter={{
        colSpan: 4,
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
          description: t('commonTypography.alertDescConfirmDeleteMasterData'),
        }}
        withDivider
      />
      <SelectionButtonModal
        isOpenSelectionModal={isOpenSelectionModal}
        actionSelectionModal={() => setIsOpenSelectionModal((prev) => !prev)}
        firstButton={{
          label: t('humanResources.createNewHumanResources'),
          onClick: () =>
            router.push(`/master-data/company/create/human-resources/${id}`),
        }}
        secondButton={{
          label: t('humanResources.selectExistingHR'),
          onClick: () =>
            router.push(
              `/master-data/company/create/human-resources-available/${id}`
            ),
        }}
      />
      <Divider my="md" />
    </DashboardCard>
  );
};

export default ReadCompanyHumanResourceBook;
