import dayjs from 'dayjs';
import { DataTableColumn } from 'mantine-datatable';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

import { globalDateNative } from '@/utils/constants/Field/native-field';
import { formatDate } from '@/utils/helper/dateFormat';

import {
  IDumpTruckRitagesData,
  IMeta,
  InputControllerNativeProps,
  ITabs,
} from '@/types/global';

interface IRitageDTProps<T> {
  data?: T[];
  meta?: IMeta;
  columns?: DataTableColumn<T>[];
  tabs: ITabs;
  urlDetail: string;
  fetching?: boolean;
  page: number;
  setPage: (page: number | undefined) => void;
  setDate: (date: string | null) => void;
  date: string | null;
}

export default function ListDataRitageDumptruckBook<
  T extends IDumpTruckRitagesData
>({
  data,
  date,
  meta,
  tabs,
  fetching,
  urlDetail,
  setDate,
  columns,
  setPage,
  page,
}: IRitageDTProps<T>) {
  const router = useRouter();
  const { t } = useTranslation('default');

  const handleSetPage = (newPage: number) => {
    setPage(newPage);
  };

  const filter = React.useMemo(() => {
    const stockpileNameItem = globalDateNative({
      label: 'date',
      placeholder: 'chooseDate',
      clearable: true,
      onChange: (value) => {
        setPage(1);
        const date = formatDate(value, 'YYYY-MM-DD');
        setDate(date ?? '');
      },
      value: date ? dayjs(date).toDate() : undefined,
    });
    const item: InputControllerNativeProps[] = [stockpileNameItem];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: data,
          fetching: fetching,
          highlightOnHover: true,
          idAccessor: (record) => {
            const key = data && data.indexOf(record) + 1;
            return `${key}`;
          },
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) => data && data.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'date',
              title: t('commonTypography.date'),
              width: 160,
              render: ({ date }) => formatDate(date) ?? '-',
            },
            {
              accessor: 'hullNumber',
              title: t('commonTypography.heavyEquipmentCode'),
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment?.hullNumber ?? '-',
            },
            {
              accessor: 'operatorName',
              title: t('commonTypography.operatorName'),
              width: 250,
              render: ({ operators }) => {
                const operator = operators?.map((val) => val);
                const value =
                  operators && operators.length ? operator.join(', ') : '-';
                return value;
              },
            },
            {
              accessor: 'shift',
              title: t('commonTypography.shift'),
              render: ({ shift }) => shift?.name ?? '-',
            },
            {
              accessor: 'totalRitage',
              title: t('commonTypography.totalRitage'),
              render: ({ ritageCount }) => ritageCount ?? '-',
            },
            {
              accessor: 'tonByRitage',
              title: t('commonTypography.tonByRitage'),
              render: ({ tonByRitage }) => tonByRitage ?? '-',
            },
            ...(columns ?? []),
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ date, shift, companyHeavyEquipment }) => {
                return (
                  <GlobalKebabButton
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        router.push(
                          `${urlDetail}/${date}/${shift?.id}/${companyHeavyEquipment?.id}?tabs=${tabs}`
                        );
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
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: page,
          totalAllData: meta?.totalAllData ?? 0,
          totalData: meta?.totalData ?? 0,
          totalPage: meta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, data, columns, fetching]);
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
}
