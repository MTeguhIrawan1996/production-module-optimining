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
import { useReadAllRitageOre } from '@/services/graphql/query/ore-ritage/useReadAllOreRitage';
import { globalDateNative } from '@/utils/constants/Field/global-field';
import {
  formatDate,
  formatDate2,
  secondsDuration,
} from '@/utils/helper/dateFormat';

import { InputControllerNativeProps } from '@/types/global';

const ListDataOreRitageBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);
  const [date, setDate] = React.useState('');

  /* #   /**=========== Query =========== */
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
    },
  });

  const [executeDelete, { loading }] = useDeleteOreRitage({
    onCompleted: () => {
      refetchOreRitages();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push({
        href: router.asPath,
        query: {
          page: 1,
        },
      });
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
    router.push({
      href: router.asPath,
      query: {
        page: page,
      },
    });
  };

  const filter = React.useMemo(() => {
    const stockpileNameItem = globalDateNative({
      label: 'date',
      placeholder: 'chooseDate',
      radius: 'lg',
      clearable: true,
      onChange: (value) => {
        router.push({
          href: router.asPath,
          query: {
            page: 1,
          },
        });
        const date = formatDate2(value, 'YYYY-MM-DD');
        setDate(date ?? '');
      },
    });
    const item: InputControllerNativeProps[] = [stockpileNameItem];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              accessor: 'checkerFrom',
              title: t('commonTypography.checkerFromName'),
              render: ({ checkerFrom }) =>
                checkerFrom?.humanResource?.name ?? '-',
            },
            {
              accessor: 'checkerTo',
              title: t('commonTypography.checkerToName'),
              render: ({ checkerTo }) => checkerTo?.humanResource?.name ?? '-',
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
              render: ({ fromAt }) => formatDate(fromAt, 'hh:mm:ss A'),
            },
            {
              accessor: 'arriveAt',
              title: t('commonTypography.arriveAt'),
              render: ({ arriveAt }) => formatDate(arriveAt, 'hh:mm:ss A'),
            },
            {
              accessor: 'ritageDuration',
              title: t('commonTypography.ritageDuration'),
              render: ({ duration }) => secondsDuration(duration),
            },
            {
              accessor: 'weather',
              title: t('commonTypography.weather'),
              render: ({ weather }) => weather?.name ?? '-',
            },
            {
              accessor: 'fromPit',
              title: t('commonTypography.fromLocation'),
              render: ({ fromPit }) => fromPit?.name ?? '-',
            },
            {
              accessor: 'fromLevel',
              title: t('commonTypography.fromLevel'),
              render: ({ fromLevel }) => fromLevel ?? '-',
            },
            {
              accessor: 'toLevel',
              title: t('commonTypography.toLevel'),
              render: ({ toLevel }) => toLevel ?? '-',
            },
            {
              accessor: 'stockpileName',
              title: t('commonTypography.stockpileName'),
              render: ({ stockpile }) => stockpile?.name ?? '-',
            },
            {
              accessor: 'dome',
              title: t('commonTypography.dome'),
              render: ({ dome }) => dome?.name ?? '-',
            },
            {
              accessor: 'bucketVolume',
              title: t('commonTypography.bucketVolume'),
              render: ({ bucketVolume }) => bucketVolume ?? '-',
            },
            {
              accessor: 'tonByRitage',
              title: t('commonTypography.tonByRitage'),
              render: ({ tonByRitage }) => tonByRitage ?? '-',
            },
            {
              accessor: 'sampleNumber',
              title: t('commonTypography.sampleNumber'),
              render: ({ sampleNumber }) => sampleNumber ?? '-',
            },
            {
              accessor: 'desc',
              title: t('commonTypography.desc'),
              render: ({ desc }) => desc ?? '-',
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
              accessor: 'formStatus',
              title: t('commonTypography.formStatus'),
              // render: ({ desc }) => desc ?? '-',
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
                        router.push(`/input-data/production/data-ritage/${id}`);
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
        colSpan: 3,
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
      <ListDataRitageDumptruckBook />
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
