import { useDebouncedValue } from '@mantine/hooks';
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
import ListDataRitageDumptruckBook from '@/components/features/InputData/Productions/data-ritage/common/elements/ListDataRitageDumptruckBook';

import { useDeleteOreRitage } from '@/services/graphql/mutation/ore-ritage/useDeleteOreRitage';
import { useReadAllHeavyEquipmentSelect } from '@/services/graphql/query/global-select/useReadAllHeavyEquipmentSelect';
import { useReadAllRitageOre } from '@/services/graphql/query/ore-ritage/useReadAllOreRitage';
import { useReadAllRitageOreDT } from '@/services/graphql/query/ore-ritage/useReadAllOreRitageDT';
import { useReadAllShiftMaster } from '@/services/graphql/query/shift/useReadAllShiftMaster';
import {
  globalDateNative,
  globalSelectNative,
} from '@/utils/constants/Field/native-field';
import { formatDate, formatDate2 } from '@/utils/helper/dateFormat';
import { useFilterItems } from '@/utils/hooks/useCombineFIlterItems';

import { InputControllerNativeProps } from '@/types/global';

const ListDataOreRitageBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('rp')) || 1;
  const heavyEquipmentPage = Number(pageParams.get('hp')) || 1;
  const url = `/input-data/production/data-ritage?rp=1&hp=${heavyEquipmentPage}&tabs=ore`;
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
  });

  const { heavyEquipmentSelect } = useReadAllHeavyEquipmentSelect({
    variables: {
      limit: 15,
      search:
        heavyEquipmentSearchQuery === '' ? null : heavyEquipmentSearchQuery,
      isComplete: true,
      categorySlug: 'dump-truck',
    },
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
    oreDumpTruckRitagesData,
    oreDumpTruckRitagesDataMeta,
    oreDumpTruckRitagesDataLoading,
  } = useReadAllRitageOreDT({
    variables: {
      limit: 10,
      page: heavyEquipmentPage,
      orderDir: 'desc',
      date: dateHeavyEquipment === '' ? null : dateHeavyEquipment,
    },
  });

  const {
    oreRitagesData,
    oreRitagesDataLoading,
    oreRitagesDataMeta,
    refetchOreRitages,
  } = useReadAllRitageOre({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      orderBy: 'createdAt',
      date: date === '' ? null : date,
      shiftId: shiftId === '' ? null : shiftId,
      isRitageProblematic: isRitageProblematic,
      companyHeavyEquipmentId:
        heavyEquipmentId === '' ? null : heavyEquipmentId,
    },
  });

  const [executeDelete, { loading }] = useDeleteOreRitage({
    onCompleted: () => {
      refetchOreRitages();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push(url, undefined, { shallow: true });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('ritageOre.successDeleteMessage'),
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
    const urlSet = `/input-data/production/data-ritage?rp=${page}&hp=${heavyEquipmentPage}&tabs=ore`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const filter = React.useMemo(() => {
    const dateItem = globalDateNative({
      label: 'date',
      placeholder: 'chooseDate',
      radius: 'lg',
      clearable: true,
      onChange: (value) => {
        router.push(url, undefined, { shallow: true });
        const date = formatDate2(value, 'YYYY-MM-DD');
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
          records: oreRitagesData,
          fetching: oreRitagesDataLoading,
          highlightOnHover: true,
          withColumnBorders: false,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                oreRitagesData && oreRitagesData.indexOf(record) + 1,
              width: 60,
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
              accessor: 'subMaterial',
              title: t('commonTypography.subMaterial'),
              render: ({ subMaterial }) => subMaterial?.name ?? '-',
            },
            {
              accessor: 'fromAt',
              title: t('commonTypography.fromAt'),
              render: ({ fromAt }) => formatDate(fromAt, 'hh:mm:ss A'),
            },
            {
              accessor: 'fromPit',
              title: t('commonTypography.pit'),
              width: 120,
              render: ({ fromPit }) => fromPit?.name ?? '-',
            },
            {
              accessor: 'dome',
              title: t('commonTypography.dome'),
              render: ({ dome }) => dome?.name ?? '-',
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
              render: ({ id }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/input-data/production/data-ritage/read-ritage-ore/${id}`
                        );
                      },
                    }}
                    actionUpdate={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `/input-data/production/data-ritage/update-ritage-ore/${id}`
                        );
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
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: {
            label: t('ritageOre.createRitageOre'),
            onClick: () => setIsOpenSelectionModal((prev) => !prev),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: oreRitagesDataMeta?.totalAllData ?? 0,
          totalData: oreRitagesDataMeta?.totalData ?? 0,
          totalPage: oreRitagesDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oreRitagesData, oreRitagesDataLoading]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      title={t('ritageOre.ritageOreTitle')}
      addButton={{
        label: t('ritageOre.createRitageOre'),
        onClick: () => setIsOpenSelectionModal((prev) => !prev),
      }}
      filterDateWithSelect={{
        colSpan: 4,
        items: filter,
      }}
      downloadButton={[
        {
          label: t('ritageOre.downloadTemplateOre'),
          url: `${process.env.NEXT_PUBLIC_REST_API_URL}/download/references`,
        },
        {
          label: t('commonTypography.downloadReference'),
          url: `${process.env.NEXT_PUBLIC_REST_API_URL}/download/references`,
        },
      ]}
    >
      {renderTable}
      <ListDataRitageDumptruckBook
        data={oreDumpTruckRitagesData}
        meta={oreDumpTruckRitagesDataMeta}
        fetching={oreDumpTruckRitagesDataLoading}
        tabs="ore"
        setDate={setDateHeavyEquipment}
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
            router.push('/input-data/production/data-ritage/create-ritage-ore'),
        }}
        secondButton={{
          label: t('commonTypography.uploadFile'),
          onClick: () =>
            router.push('/input-data/production/data-ritage/upload'),
        }}
      />
    </DashboardCard>
  );
};

export default ListDataOreRitageBook;
