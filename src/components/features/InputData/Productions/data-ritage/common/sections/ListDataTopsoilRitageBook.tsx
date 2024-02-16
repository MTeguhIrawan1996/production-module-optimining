import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
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
import ListDataRitageDumptruckBook from '@/components/features/InputData/Productions/data-ritage/common/elements/ListDataRitageDumptruckBook';

import { useDeleteTopsoilRitage } from '@/services/graphql/mutation/topsoil-ritage/useDeleteTopsoilRitage';
import { useReadAllHeavyEquipmentSelect } from '@/services/graphql/query/global-select/useReadAllHeavyEquipmentSelect';
import { useReadAllShiftMaster } from '@/services/graphql/query/shift/useReadAllShiftMaster';
import { useReadAllRitageTopsoil } from '@/services/graphql/query/topsoil-ritage/useReadAllTopsoilRitage';
import { useReadAllRitageTopsoilDT } from '@/services/graphql/query/topsoil-ritage/useReadAllTopsoilRitageDT';
import {
  globalDateNative,
  globalSelectNative,
} from '@/utils/constants/Field/native-field';
import { formatDate } from '@/utils/helper/dateFormat';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { InputControllerNativeProps } from '@/types/global';

const ListDataTopsoilRitageBook = () => {
  const router = useRouter();
  const tabs = router.query['tabs'] || '';
  const page = Number(router.query['rp']) || 1;
  const heavyEquipmentPage = Number(router.query['hp']) || 1;
  const url = `/input-data/production/data-ritage?rp=1&hp=${heavyEquipmentPage}&tabs=topsoil`;
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);
  const [date, setDate] = React.useState('');
  const [dateHeavyEquipment, setDateHeavyEquipment] = React.useState('');
  const [isRitageProblematic, setIsRitageProblematic] = React.useState<
    boolean | null
  >(null);
  const [shiftId, setShiftId] = React.useState<string | null>(null);
  const [heavyEquipmentSeacrhTerm, setHeavyEquipmentSeacrhTerm] =
    React.useState<string>('');
  const [heavyEquipmentSearchQuery] = useDebouncedValue<string>(
    heavyEquipmentSeacrhTerm,
    400
  );
  const [heavyEquipmentId, setHeavyEquipmentId] = React.useState<string | null>(
    null
  );

  /* #   /**=========== Query =========== */
  const { shiftsData } = useReadAllShiftMaster({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
    },
    skip: tabs !== 'topsoil',
  });

  const { heavyEquipmentSelect } = useReadAllHeavyEquipmentSelect({
    variables: {
      limit: 15,
      search:
        heavyEquipmentSearchQuery === '' ? null : heavyEquipmentSearchQuery,
      isComplete: true,
      categoryId: `${process.env.NEXT_PUBLIC_DUMP_TRUCK_ID}`,
    },
    skip: tabs !== 'topsoil',
  });

  const heavyEquipmentItem = heavyEquipmentSelect?.map((val) => {
    return {
      name: val.hullNumber ?? '',
      id: val.id ?? '',
    };
  });
  const { uncombinedItem: heavyEquipmentItemFilter } = useFilterItems({
    data: heavyEquipmentItem ?? [],
  });
  const { uncombinedItem: shiftFilterItem } = useFilterItems({
    data: shiftsData ?? [],
  });

  const {
    topsoilDumpTruckRitagesData,
    topsoilDumpTruckRitagesDataLoading,
    topsoilDumpTruckRitagesDataMeta,
  } = useReadAllRitageTopsoilDT({
    variables: {
      limit: 10,
      page: heavyEquipmentPage,
      orderDir: 'desc',
      date: dateHeavyEquipment === '' ? null : dateHeavyEquipment,
    },
    skip: tabs !== 'topsoil',
  });

  const {
    topsoilRitagesData,
    topsoilRitagesDataMeta,
    topsoilRitagesDataLoading,
    refetchTopsoilRitages,
  } = useReadAllRitageTopsoil({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      date: date === '' ? null : date,
      shiftId: shiftId === '' ? null : shiftId,
      isRitageProblematic: isRitageProblematic,
      companyHeavyEquipmentId:
        heavyEquipmentId === '' ? null : heavyEquipmentId,
    },
    skip: tabs !== 'topsoil',
  });

  const [executeDelete, { loading }] = useDeleteTopsoilRitage({
    onCompleted: () => {
      refetchTopsoilRitages();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push(url, undefined, { shallow: true });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('ritageTopsoil.successDeleteMessage'),
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

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
      },
    });
  };

  const handleSetPage = (page: number) => {
    const urlSet = `/input-data/production/data-ritage?rp=${page}&hp=${heavyEquipmentPage}&tabs=topsoil`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const filter = React.useMemo(() => {
    const dateItem = globalDateNative({
      label: 'date',
      placeholder: 'chooseDate',
      clearable: true,
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        const date = formatDate(value, 'YYYY-MM-DD');
        setDate(date ?? '');
      },
    });
    const ritageProblematic = globalSelectNative({
      placeholder: 'chooseRitageStatus',
      label: 'ritageStatus',
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
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setIsRitageProblematic(
          value ? (value === 'true' ? false : true) : null
        );
      },
    });
    const shiftItem = globalSelectNative({
      placeholder: 'chooseShift',
      label: 'shift',
      searchable: false,
      data: shiftFilterItem,
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setShiftId(value);
      },
    });
    const heavyEquipmentItem = globalSelectNative({
      placeholder: 'chooseHeavyEquipmentCode',
      label: 'heavyEquipmentCode',
      searchable: true,
      data: heavyEquipmentItemFilter,
      onSearchChange: setHeavyEquipmentSeacrhTerm,
      searchValue: heavyEquipmentSeacrhTerm,
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        setHeavyEquipmentId(value);
      },
    });

    const item: InputControllerNativeProps[] = [
      dateItem,
      ritageProblematic,
      shiftItem,
      heavyEquipmentItem,
    ];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, heavyEquipmentItemFilter, shiftFilterItem]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: topsoilRitagesData,
          fetching: topsoilRitagesDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                topsoilRitagesData && topsoilRitagesData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'date',
              title: t('commonTypography.date'),
              width: 160,
              render: ({ date }) => formatDate(date) ?? '-',
            },
            {
              accessor: 'shift',
              title: t('commonTypography.shift'),
              render: ({ shift }) => shift?.name ?? '-',
            },
            {
              accessor: 'heavyEquipmentCode',
              title: t('commonTypography.heavyEquipmentCode'),
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment?.hullNumber ?? '-',
            },
            {
              accessor: 'material',
              title: t('commonTypography.material'),
              render: ({ material }) => material?.name ?? '-',
            },
            {
              accessor: 'fromAt',
              title: t('commonTypography.fromAt'),
              render: ({ fromAt }) => formatDate(fromAt, 'hh:mm:ss A') ?? '-',
            },
            {
              accessor: 'toLocation',
              title: t('commonTypography.toArrive'),
              render: ({ toLocation }) => toLocation?.name ?? '-',
            },
            {
              accessor: 'status',
              title: t('commonTypography.status'),
              render: ({ status }) => {
                return (
                  <GlobalBadgeStatus
                    color={status?.color}
                    label={status?.name ?? ''}
                  />
                );
              },
            },
            {
              accessor: 'ritageStatus',
              title: t('commonTypography.ritageStatus'),
              render: ({ isRitageProblematic }) => (
                <GlobalBadgeStatus
                  color={isRitageProblematic ? 'gray.6' : 'brand.6'}
                  label={
                    isRitageProblematic
                      ? t('commonTypography.unComplete')
                      : t('commonTypography.complete')
                  }
                />
              ),
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ id, status }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/input-data/production/data-ritage/topsoil/read/${id}`
                        );
                      },
                    }}
                    actionUpdate={
                      status?.id !==
                      `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/production/data-ritage/topsoil/update/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionDelete={
                      status?.id !==
                      `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`
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
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('ritageTopsoil.createRitageTopsoil'),
            onClick: () => setIsOpenSelectionModal((prev) => !prev),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: topsoilRitagesDataMeta?.totalAllData ?? 0,
          totalData: topsoilRitagesDataMeta?.totalData ?? 0,
          totalPage: topsoilRitagesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topsoilRitagesData, topsoilRitagesDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={{
        label: t('ritageTopsoil.createRitageTopsoil'),
        onClick: () => setIsOpenSelectionModal((prev) => !prev),
      }}
      filterDateWithSelect={{
        colSpan: 4,
        items: filter,
      }}
      downloadButton={[
        {
          label: t('ritageTopsoil.downloadTemplateTopsoil'),
          url: `/topsoil-ritages/file`,
          fileName: 'template-topsoil',
        },
        {
          label: t('commonTypography.downloadReference'),
          url: `/download/references`,
          fileName: 'referensi-topsoil',
        },
      ]}
    >
      {renderTable}
      <ListDataRitageDumptruckBook
        data={topsoilDumpTruckRitagesData}
        meta={topsoilDumpTruckRitagesDataMeta}
        fetching={topsoilDumpTruckRitagesDataLoading}
        tabs="topsoil"
        setDate={setDateHeavyEquipment}
        urlDetail="/input-data/production/data-ritage/topsoil/read/dump-truck"
      />
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
          description: t('commonTypography.alertDescConfirmDelete'),
        }}
        withDivider
      />
      <SelectionButtonModal
        isOpenSelectionModal={isOpenSelectionModal}
        actionSelectionModal={() => setIsOpenSelectionModal((prev) => !prev)}
        firstButton={{
          label: t('commonTypography.inputDataRitage'),
          onClick: () =>
            router.push('/input-data/production/data-ritage/topsoil/create'),
        }}
        secondButton={{
          label: t('commonTypography.uploadFile'),
          onClick: () =>
            router.push('/input-data/production/data-ritage/topsoil/upload'),
        }}
      />
    </DashboardCard>
  );
};

export default ListDataTopsoilRitageBook;
