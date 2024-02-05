import {
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DataTableColumnGroup } from 'mantine-datatable';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { GlobalActionTable, MantineDataTable } from '@/components/elements';
import WeeklyPlanInformationData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/WeeklyPlanInformationData';

import {
  IReadOneMaterialUnitCapacityPlan,
  IReadOneTargetPlan,
  IReadOneUnitCapacityPlan,
} from '@/services/graphql/query/plan/weekly/useReadOneUnitCapacityPlan';

import { IMeta } from '@/types/global';
dayjs.extend(isoWeek);

interface IUnitCapacityPlanData {
  id: string;
  tabs?: string;
  data?: IReadOneUnitCapacityPlan[];
  meta?: IMeta;
}

const UnitCapacityPlanData = ({
  data,
  meta,
  id,
  tabs,
}: IUnitCapacityPlanData) => {
  const { t } = useTranslation('default');
  const theme = useMantineTheme();
  const router = useRouter();
  const pageParams = useSearchParams();
  const page = Number(pageParams.get('page')) || 1;
  const [materials, setMaterials] = React.useState<
    IReadOneMaterialUnitCapacityPlan[] | undefined
  >(undefined);
  const [fleetTotal, setFleetTotal] = React.useState<number | ''>('');
  const [dumpTruckCountTotal, setDumpTruckCountTotal] = React.useState<
    number | ''
  >('');
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);

  const handleSetPage = (page: number) => {
    const urlSet = `/plan/weekly/read/weekly-plan-group/${id}?tabs=${tabs}&page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
  };

  const renderOtherColumnCallback = React.useCallback(
    (obj: IReadOneTargetPlan) => {
      const group: DataTableColumnGroup<IReadOneMaterialUnitCapacityPlan> = {
        id: `${obj['day']}`,
        title: dayjs()
          .isoWeekday(Number(obj['day'] || 0))
          .format('dddd'),
        style: { textAlign: 'center' },
        columns: [
          {
            accessor: `rate.${obj.day}`,
            title: 'Rate',
            width: 100,
            render: ({ targetPlans }) => {
              return `${targetPlans[obj.day].rate ?? '-'}`;
            },
          },
          {
            accessor: `ton.${obj.day}`,
            title: 'Ton',
            width: 100,
            render: ({ targetPlans }) => {
              return `${targetPlans[obj.day].ton || '-'}`;
            },
          },
        ],
      };
      return group;
    },
    []
  );

  const renderOtherGroup = materials?.[0].targetPlans.map(
    renderOtherColumnCallback
  );

  return (
    <>
      <WeeklyPlanInformationData />
      <Stack spacing="sm">
        <Text fz={24} fw={600} color="brand">
          {t('commonTypography.unitCapacityPlanInformation')}
        </Text>
        <MantineDataTable
          tableProps={{
            records: data ?? [],
            columns: [
              {
                accessor: 'locations',
                title: t('commonTypography.location'),
                noWrap: false,
                width: 300,
                render: ({ locations }) => {
                  const location = locations.map((val) => val.name);
                  return location?.join(', ');
                },
              },
              {
                accessor: 'activityName',
                title: t('commonTypography.activityName'),
              },
              {
                accessor: 'fleetTotal',
                title: t('commonTypography.amountFleet'),
              },
              {
                accessor: 'averageDistance',
                title: t('commonTypography.averageDistance'),
              },
              {
                accessor: 'dumpTruckCountTotal',
                title: t('commonTypography.dumpTruckTotal'),
              },
              {
                accessor: 'material',
                title: t('commonTypography.material'),
                render: ({ id, fleetTotal, dumpTruckCountTotal }) => {
                  return (
                    <GlobalActionTable
                      actionRead={{
                        onClick: (e) => {
                          e.stopPropagation();
                          const materialById = data?.find(
                            (val) => val.id === id
                          );
                          setMaterials(materialById?.materials);
                          setFleetTotal(fleetTotal);
                          setDumpTruckCountTotal(dumpTruckCountTotal);
                          setIsOpenModal((prev) => !prev);
                        },
                      }}
                    />
                  );
                },
              },
            ],
            shadow: 'none',
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
      </Stack>
      <Modal.Root
        opened={isOpenModal}
        onClose={() => setIsOpenModal((prev) => !prev)}
        centered
        radius="xs"
        size="100%"
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header py="sm">
            <Text component="span" fz={18} fw={500}>
              Material
            </Text>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <ScrollArea h={260}>
              <Group noWrap spacing={0} py={4}>
                <MantineDataTable
                  tableProps={{
                    defaultColumnProps: {
                      footerStyle: {
                        visibility: 'unset',
                        backgroundColor: 'transparent',
                        color: theme.colors.dark[5],
                        fontSize: 14,
                      },
                    },
                    groups: [
                      {
                        id: 'information',
                        title: t('commonTypography.information'),
                        style: { textAlign: 'center' },
                        columns: [
                          {
                            accessor: 'material',
                            render: ({ material }) => material.name ?? '-',
                            footer: <Text>Total</Text>,
                          },
                          {
                            accessor: 'fleet',
                            footer: <Text>{fleetTotal}</Text>,
                          },
                          {
                            accessor: 'heavyEquipmentClass',
                            title: t('commonTypography.heavyEquipmentClass'),
                            width: 180,
                            render: ({ class: heavyEquipmentClass }) =>
                              heavyEquipmentClass.name ?? '-',
                          },
                          {
                            accessor: 'physicalAvailability',
                            title: 'PA',
                            width: 90,
                          },
                          {
                            accessor: 'useOfAvailability',
                            title: 'UA',
                            width: 90,
                          },
                          {
                            accessor: 'effectiveWorkingHour',
                            title: 'EWH',
                            width: 90,
                          },
                          {
                            accessor: 'distance',
                            title: t('commonTypography.distance'),
                            width: 90,
                          },
                          {
                            accessor: 'dumpTruckCount',
                            title: t('commonTypography.dumpTruckCount'),
                            width: 180,
                            footer: <Text>{dumpTruckCountTotal}</Text>,
                          },
                        ],
                      },
                      ...(renderOtherGroup ?? []),
                      {
                        id: 'total',
                        title: 'Total',
                        style: { textAlign: 'center' },
                        columns: [
                          {
                            accessor: `rate`,
                            title: 'Rate',
                            width: 100,
                            render: ({ totalTargetPlan }) => {
                              return totalTargetPlan.rate;
                            },
                          },
                          {
                            accessor: `ton`,
                            title: 'Ton',
                            width: 100,
                            render: ({ totalTargetPlan }) => {
                              return totalTargetPlan.ton;
                            },
                          },
                        ],
                      },
                    ],
                    defaultColumnRender: (record, _, accesor) => {
                      const data = record[
                        accesor as keyof typeof record
                      ] as React.ReactNode;
                      if (accesor === 'physicalAvailability') {
                        return data ? `${data}%` : '-';
                      }
                      if (accesor === 'useOfAvailability') {
                        return data ? `${data}%` : '-';
                      }
                      if (accesor === 'distance') {
                        return data ? `${data} Meter` : '-';
                      }
                      return data ? data : '-';
                    },
                    records: materials,
                    highlightOnHover: false,
                    withColumnBorders: true,
                  }}
                />
              </Group>
            </ScrollArea>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};

export default UnitCapacityPlanData;
