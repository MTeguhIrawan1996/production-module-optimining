import { Stack } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { GlobalActionTable, MantineDataTable } from '@/components/elements';
import KeyValueList from '@/components/elements/global/KeyValueList';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';
import { formatDate, secondsDuration } from '@/utils/helper/dateFormat';

import {
  IElementsData,
  IListDetailRitageDTData,
  IMeta,
  ITabs,
} from '@/types/global';

interface IListDetailsRitageDTProps {
  data?: IListDetailRitageDTData[];
  meta?: IMeta;
  fetching?: boolean;
  tabs: ITabs;
}

const ListDetailsRitageDT: React.FunctionComponent<
  IListDetailsRitageDTProps
> = ({ data, meta, fetching, tabs }) => {
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
    const urlSet = `/input-data/production/data-ritage/ore/read-dump-truck/${date}/${shiftId}/${companyHeavyEquipmentId}?p=${newPage}&shift=${shift}&c=${heavyEquipmentCode}&tabs=${tabs}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
  });

  const renderOtherColumnCallback = React.useCallback(
    (element: IElementsData) => {
      const column: DataTableColumn<IListDetailRitageDTData> = {
        accessor: `${element.name}`,
        title: `${element.name}`,
        render: ({ houseSampleAndLab }) => {
          const value = houseSampleAndLab?.elements?.find(
            (val) => val.element?.name === element.name
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
            ...(renderOtherColumn ?? []),
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
                        router.push(
                          `/input-data/production/data-ritage/ore/read/${id}`
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
  }, [data, fetching, renderOtherColumn]);

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
    </>
  );
};

export default ListDetailsRitageDT;
