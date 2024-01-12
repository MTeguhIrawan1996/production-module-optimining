import { useDebouncedState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/id';

import {
  DashboardCard,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
} from '@/components/elements';

import { useDeleteSampleHouseLab } from '@/services/graphql/mutation/sample-house-lab/useDeleteSampleHouseLab';
import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import {
  IHouseSampleAndLabsData,
  useReadAllSampleHouseLab,
} from '@/services/graphql/query/sample-house-lab/useReadAllSampleHouseLab';
import { formatDate } from '@/utils/helper/dateFormat';

import { IElementsData } from '@/types/global';

const SampleHouseLabBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const url = `/input-data/quality-control-management/sample-house-lab?page=1`;
  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = useDebouncedState<string>('', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);

  /* #   /**=========== Query =========== */
  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
  });

  const {
    houseSampleAndLabsData,
    houseSampleAndLabsDataLoading,
    houseSampleAndLabsDataMeta,
    refetchHouseSampleAndLabs,
  } = useReadAllSampleHouseLab({
    variables: {
      limit: 10,
      page: page,
      orderDir: 'desc',
      search: searchQuery === '' ? null : searchQuery,
    },
  });

  const [executeDelete, { loading }] = useDeleteSampleHouseLab({
    onCompleted: () => {
      refetchHouseSampleAndLabs();
      setIsOpenDeleteConfirmation((prev) => !prev);
      router.push(url, undefined, { shallow: true });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('sampleHouseLab.successDeleteMessage'),
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

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<IHouseSampleAndLabsData> = {
        accessor: `${element.name}${t('commonTypography.estimationGC')}`,
        title: `${element.name} ${t('commonTypography.estimationGC')}`,
        render: ({ gradeControlElements }) => {
          const value = gradeControlElements?.find(
            (val) => val.element?.id === element.id
          );
          return value?.value ?? '-';
        },
      };
      return column;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const renderOtherColumn = elementsData?.map(renderOtherColumnCallback);

  const renderOtherPrcentageLabColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<IHouseSampleAndLabsData> = {
        accessor: `${element.name}${t('commonTypography.percentageLab')}`,
        title: `${element.name} ${t('commonTypography.percentageLab')}`,
        render: ({ elements }) => {
          const value = elements?.find((val) => val.element?.id === element.id);
          return value?.value ?? '-';
        },
      };
      return column;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const renderOtherColumnPercentageLab = elementsData?.map(
    renderOtherPrcentageLabColumnCallback
  );

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: houseSampleAndLabsData,
          fetching: houseSampleAndLabsDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                houseSampleAndLabsData &&
                houseSampleAndLabsData.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'laboratoriumName',
              title: t('commonTypography.laboratoriumName'),
            },
            {
              accessor: 'sampleDate',
              title: t('commonTypography.sampleDate'),
              render: ({ sampleDate }) => formatDate(sampleDate) ?? '-',
            },
            {
              accessor: 'shift',
              title: t('commonTypography.shift'),
              width: 120,
              render: ({ shift }) => shift?.name,
            },
            {
              accessor: 'sampleNumber',
              title: t('commonTypography.sampleNumber'),
            },
            {
              accessor: 'sampleName',
              title: t('commonTypography.sampleName'),
            },
            {
              accessor: 'sampleType',
              title: t('commonTypography.sampleType'),
              render: ({ sampleType }) => sampleType?.name,
            },
            {
              accessor: 'samplerName',
              width: 160,
              title: t('commonTypography.samplerName'),
              render: ({ sampler }) => sampler?.humanResource?.name,
            },
            {
              accessor: 'gcName',
              title: t('commonTypography.gcName'),
              render: ({ gradeControl }) =>
                gradeControl?.humanResource?.name ?? '-',
            },
            {
              accessor: 'location',
              width: 160,
              title: t('commonTypography.location'),
              render: (value) => {
                return value.locationName
                  ? value.locationName ?? '-'
                  : value.location?.name ?? '-';
              },
            },
            {
              accessor: 'sampleEnterLabAt',
              title: t('commonTypography.sampleEnterLabAt'),
              render: ({ sampleEnterLabAt }) =>
                formatDate(sampleEnterLabAt) ?? '-',
            },
            ...(renderOtherColumn ?? []),
            ...(renderOtherColumnPercentageLab ?? []),
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
                          `/input-data/quality-control-management/sample-house-lab/read/${id}`
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
                                `/input-data/quality-control-management/sample-house-lab/update/${id}`
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
            label: t('sampleHouseLab.createSample'),
            onClick: () =>
              router.push(
                '/input-data/quality-control-management/sample-house-lab/create'
              ),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: houseSampleAndLabsDataMeta?.totalAllData ?? 0,
          totalData: houseSampleAndLabsDataMeta?.totalData ?? 0,
          totalPage: houseSampleAndLabsDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    houseSampleAndLabsData,
    renderOtherColumn,
    renderOtherColumnPercentageLab,
    houseSampleAndLabsDataLoading,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  return (
    <DashboardCard
      addButton={{
        label: t('sampleHouseLab.createSample'),
        onClick: () =>
          router.push(
            '/input-data/quality-control-management/sample-house-lab/create'
          ),
      }}
      searchBar={{
        placeholder: t('sampleHouseLab.searchPlaceholder'),
        onChange: (e) => {
          setSearchQuery(e.currentTarget.value);
        },
        searchQuery: searchQuery,
        onSearch: () => {
          router.push(url, undefined, { shallow: true });
        },
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
          description: t('commonTypography.alertDescConfirmDelete'),
        }}
        withDivider
      />
    </DashboardCard>
  );
};

export default SampleHouseLabBook;
