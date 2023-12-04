import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

import { useReadAllRitageOre } from '@/services/graphql/query/ore-ritage/useReadAllOreRitage';
import { globalDateNative } from '@/utils/constants/Field/native-field';
import { formatDate2 } from '@/utils/helper/dateFormat';

import { InputControllerNativeProps } from '@/types/global';

const ListDataRitageDumptruckBook = () => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const { t } = useTranslation('default');
  const [date, setDate] = React.useState('');

  /* #   /**=========== Query =========== */
  const { oreRitagesData, oreRitagesDataLoading, oreRitagesDataMeta } =
    useReadAllRitageOre({
      variables: {
        limit: 10,
        page: page,
        orderDir: 'desc',
        orderBy: 'createdAt',
        date: date === '' ? null : date,
      },
    });

  /* #endregion  /**======== Query =========== */

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
              accessor: 'hullNumber',
              title: t('commonTypography.heavyEquipmentCode'),
              // render: ({ checkerFrom }) =>
              //   checkerFrom?.humanResource?.name ?? '-',
            },
            {
              accessor: 'operatorName',
              title: t('commonTypography.operatorName'),
              // render: ({ checkerTo }) => checkerTo?.humanResource?.name ?? '-',
            },
            {
              accessor: 'shift',
              title: t('commonTypography.shift'),
              render: ({ shift }) => shift?.name ?? '-',
            },
            {
              accessor: 'totalRitage',
              title: t('commonTypography.totalRitage'),
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment?.hullNumber ?? '-',
            },
            {
              accessor: 'tonByRitage',
              title: t('commonTypography.tonByRitage'),
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment?.hullNumber ?? '-',
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
                        router.push(`/input-data/production/data-ritage/${id}`);
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
            onClick: () => router.push('/input-data/production/data-ritage'),
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
      title={t('commonTypography.dataRitageDumpTruck')}
      filterDateWithSelect={{
        colSpan: 3,
        items: filter,
      }}
      p={0}
      py="lg"
    >
      {renderTable}
    </DashboardCard>
  );
};

export default ListDataRitageDumptruckBook;
