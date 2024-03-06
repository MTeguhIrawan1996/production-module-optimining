import { Stack } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
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

import {
  IListDetailRitageDTData,
  IMeta,
  IReadOneRitageDTOperators,
  ITabs,
} from '@/types/global';

interface IListDetailsRitageDTProps<T, D> {
  data?: T[];
  operatorDetail?: D;
  columns?: DataTableColumn<T>[];
  subMaterialHidden?: boolean;
  meta?: IMeta;
  fetching?: boolean;
  tabs: ITabs;
  modalProps?: IImageModalProps;
  onOpenModal: (id: string) => Promise<void>;
}

export default function ListDetailsRitageDT<
  T extends IListDetailRitageDTData,
  D extends IReadOneRitageDTOperators
>({
  data,
  meta,
  fetching,
  tabs,
  columns,
  operatorDetail,
  modalProps,
  subMaterialHidden = false,
  onOpenModal,
}: IListDetailsRitageDTProps<T, D>) {
  const { t } = useTranslation('default');
  const router = useRouter();
  const page = Number(router.query['p']) || 1;
  const date = router.query?.id?.[0] as string;
  const shiftId = router.query?.id?.[1] as string;
  const companyHeavyEquipmentId = router.query?.id?.[2] as string;

  const handleSetPage = (newPage: number) => {
    const urlSet = `/input-data/production/data-ritage/${tabs}/read/dump-truck/${date}/${shiftId}/${companyHeavyEquipmentId}?p=${newPage}&tabs=${tabs}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: data,
          fetching: fetching,
          highlightOnHover: true,
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
              hidden: subMaterialHidden,
            },
            {
              accessor: 'weather',
              title: t('commonTypography.weather'),
              render: ({ weather }) => weather?.name ?? '-',
            },
            {
              accessor: 'fromAt',
              title: t('commonTypography.fromAt'),
              render: ({ fromAt }) => formatDate(fromAt, 'hh:mm:ss A') ?? '-',
            },
            {
              accessor: 'arriveAt',
              title: t('commonTypography.arriveAt'),
              render: ({ arriveAt }) =>
                formatDate(arriveAt, 'hh:mm:ss A') ?? '-',
            },
            {
              accessor: 'ritageDuration',
              title: t('commonTypography.ritageDuration'),
              render: ({ duration }) => secondsDuration(duration),
            },
            ...(columns ?? []),
            {
              accessor: 'desc',
              title: t('commonTypography.desc'),
              render: ({ desc }) => desc ?? '-',
            },
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
  }, [data, columns, fetching, subMaterialHidden]);

  const operator = operatorDetail?.operators?.map((val) => val);
  const newOperatorName =
    operatorDetail && operatorDetail.operators?.length
      ? operator?.join(', ')
      : '-';

  return (
    <>
      <Stack spacing="xs">
        <KeyValueList
          data={[
            {
              dataKey: t('commonTypography.heavyEquipmentCode'),
              value: operatorDetail?.companyHeavyEquipment?.hullNumber,
            },
            {
              dataKey: t('commonTypography.operatorName'),
              value: newOperatorName,
            },
            {
              dataKey: t('commonTypography.date'),
              value: formatDate(operatorDetail?.date) ?? '-',
            },
            {
              dataKey: t('commonTypography.shift'),
              value: operatorDetail?.shift?.name,
            },
          ]}
          type="grid"
          keySpan={3}
          valueSpan={9}
        />
      </Stack>
      {renderTable}
      {modalProps && <ImageModal {...modalProps} />}
    </>
  );
}
