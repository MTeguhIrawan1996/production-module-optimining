import { Stack } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  GlobalActionTable,
  ImageModal,
  MantineDataTable,
} from '@/components/elements';
import KeyValueList from '@/components/elements/global/KeyValueList';
import { IImageModalProps } from '@/components/elements/modal/ImageModal';

import { formatDate, secondsDuration } from '@/utils/helper/dateFormat';

import { IListDetailRitageDTData, IMeta, ITabs } from '@/types/global';

interface IListDetailsRitageDTProps<T> {
  data?: T[];
  columns?: DataTableColumn<T>[];
  meta?: IMeta;
  fetching?: boolean;
  tabs: ITabs;
  modalProps?: IImageModalProps;
  onOpenModal: (id: string) => Promise<void>;
}

export default function ListDetailsRitageDT<T extends IListDetailRitageDTData>({
  data,
  meta,
  fetching,
  tabs,
  columns,
  modalProps,
  onOpenModal,
}: IListDetailsRitageDTProps<T>) {
  const { t } = useTranslation('default');
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('p')) || 1;
  const operatorName = pageParams.get('op') || '-';
  const heavyEquipmentCode = pageParams.get('c') || '-';
  const shift = pageParams.get('shift') || '-';
  const date = router.query?.id?.[0] as string;
  const shiftId = router.query?.id?.[1] as string;
  const companyHeavyEquipmentId = router.query?.id?.[2] as string;

  const handleSetPage = (newPage: number) => {
    const urlSet = `/input-data/production/data-ritage/${tabs}/read/dump-truck/${date}/${shiftId}/${companyHeavyEquipmentId}?p=${newPage}&op=OperatorName&shift=${shift}&c=${heavyEquipmentCode}&tabs=${tabs}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: data,
          fetching: fetching,
          highlightOnHover: true,
          withColumnBorders: false,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) => data && data.indexOf(record) + 1,
              width: 60,
            },
            {
              accessor: 'material',
              title: t('commonTypography.material'),
              render: ({ material }) => material?.name ?? '-',
            },
            {
              accessor: 'subMaterial',
              title: t('commonTypography.subMaterial'),
              render: ({ subMaterial }) => subMaterial?.name ?? '-',
            },
            {
              accessor: 'weather',
              title: t('commonTypography.weather'),
              render: ({ weather }) => weather?.name ?? '-',
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
            ...(columns ?? []),
            {
              accessor: 'photo',
              title: t('commonTypography.photo'),
              width: 100,
              render: ({ id }) => {
                return (
                  <GlobalActionTable
                    actionRead={{
                      onClick: (e) => {
                        e.stopPropagation();
                        onOpenModal(id);
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
  }, [data, columns, fetching]);

  return (
    <>
      <Stack spacing="xs">
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.heavyEquipmentCode'),
              value: heavyEquipmentCode,
            },
            {
              dataKey: t('commonTypography.operatorName'),
              value: operatorName,
            },
            {
              dataKey: t('commonTypography.date'),
              value: formatDate(date) ?? '-',
            },
            {
              dataKey: t('commonTypography.shift'),
              value: shift,
            },
          ]}
          type="grid"
          keySpan={3}
          valueSpan={9}
          keyStyleText={{
            fw: 400,
            fz: 18,
          }}
          valueStyleText={{
            fw: 400,
            fz: 18,
          }}
        />
      </Stack>
      {renderTable}
      {modalProps && <ImageModal {...modalProps} />}
    </>
  );
}
