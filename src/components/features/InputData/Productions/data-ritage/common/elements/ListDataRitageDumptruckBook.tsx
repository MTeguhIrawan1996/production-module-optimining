import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalKebabButton,
  MantineDataTable,
} from '@/components/elements';

import { globalDateNative } from '@/utils/constants/Field/native-field';
import { formatDate2 } from '@/utils/helper/dateFormat';

import {
  IDumpTruckRitagesData,
  IMeta,
  InputControllerNativeProps,
  ITabs,
} from '@/types/global';

interface IRitageDTProps {
  data?: IDumpTruckRitagesData[];
  meta?: IMeta;
  tabs: ITabs;
  urlDetail: string;
  fetching?: boolean;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}

const ListDataRitageDumptruckBook: React.FC<IRitageDTProps> = ({
  data,
  meta,
  tabs,
  fetching,
  urlDetail,
  setDate,
}) => {
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('rp')) || 1;
  const heavyEquipmentPage = Number(pageParams.get('hp')) || 1;
  const url = `/input-data/production/data-ritage?rp=${page}&hp=1&tabs=${tabs}`;
  const { t } = useTranslation('default');

  const handleSetPage = (newPage: number) => {
    const urlSet = `/input-data/production/data-ritage?rp=${page}&hp=${newPage}&tabs=${tabs}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const filter = React.useMemo(() => {
    const stockpileNameItem = globalDateNative({
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
    const item: InputControllerNativeProps[] = [stockpileNameItem];
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: data,
          fetching: fetching,
          highlightOnHover: true,
          withColumnBorders: false,
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
              accessor: 'hullNumber',
              title: t('commonTypography.heavyEquipmentCode'),
              render: ({ companyHeavyEquipment }) =>
                companyHeavyEquipment?.hullNumber ?? '-',
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
              render: ({ ritageCount }) => ritageCount ?? '-',
            },
            {
              accessor: 'tonByRitage',
              title: t('commonTypography.tonByRitage'),
              render: ({ tonByRitage }) => tonByRitage ?? '-',
            },
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
                          `${urlDetail}/${date}/${shift?.id}/${companyHeavyEquipment?.id}?p=1&shift=${shift?.name}&c=${companyHeavyEquipment?.hullNumber}&tabs=${tabs}`
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
          actionButton: {
            label: t('ritageOre.createRitageOre'),
            onClick: () => router.push('/input-data/production/data-ritage'),
          },
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: heavyEquipmentPage,
          totalAllData: meta?.totalAllData ?? 0,
          totalData: meta?.totalData ?? 0,
          totalPage: meta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, fetching]);
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
