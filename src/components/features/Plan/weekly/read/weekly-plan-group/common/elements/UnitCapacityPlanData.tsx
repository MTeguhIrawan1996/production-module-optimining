import { Stack, Text, useMantineTheme } from '@mantine/core';
import { DataTableColumnGroup } from 'mantine-datatable';
import { useRouter } from 'next/router';
import { queryTypes, useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalActionTable,
  GlobalModal,
  MantineDataTable,
} from '@/components/elements';
import WeeklyPlanInformationData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/WeeklyPlanInformationData';

import {
  IReadOneMaterialUnitCapacityPlan,
  IReadOneTargetPlan,
  useReadOneUnitCapacityPlan,
} from '@/services/graphql/query/plan/weekly/useReadOneUnitCapacityPlan';
import dayjs from '@/utils/helper/dayjs.config';

const UnitCapacityPlanData = () => {
  const { t } = useTranslation('default');
  const theme = useMantineTheme();
  const router = useRouter();
  const id = router.query.id as string;
  const [tabs] = useQueryState('tabs');
  const [page, setPage] = useQueryState(
    'page',
    queryTypes.integer.withDefault(1)
  );
  const [materials, setMaterials] = React.useState<
    IReadOneMaterialUnitCapacityPlan[] | undefined
  >(undefined);
  const [fleetTotal, setFleetTotal] = React.useState<number | ''>('');
  const [dumpTruckCountTotal, setDumpTruckCountTotal] = React.useState<
    number | ''
  >('');
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);

  const {
    weeklyUnitCapacityPlanData: data,
    weeklyUnitCapacityPlanMeta: meta,
    weeklyUnitCapacityPlanDataLoading,
  } = useReadOneUnitCapacityPlan({
    variables: {
      weeklyPlanId: id,
      limit: 10,
    },
    skip: tabs !== 'unitCapacityPlan',
  });

  const handleSetPage = (page: number) => {
    setPage(page);
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
      <DashboardCard p={0}>
        <Stack spacing="sm">
          <Text fz={24} fw={600} color="brand">
            {t('commonTypography.unitCapacityPlanInformation')}
          </Text>
          <MantineDataTable
            tableProps={{
              records: data ?? [],
              fetching: weeklyUnitCapacityPlanDataLoading,
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
        <GlobalModal
          actionModal={() => setIsOpenModal((prev) => !prev)}
          isOpenModal={isOpenModal}
          scrollAreaProps={{
            h: 360,
          }}
          label={t('commonTypography.material')}
        >
          <MantineDataTable
            tableProps={{
              defaultColumnProps: {
                footerStyle: {
                  visibility: 'unset',
                  backgroundColor: 'transparent',
                  color: theme.colors.dark[6],
                  fontSize: 14,
                },
              },
              styles: {
                header: {
                  zIndex: 0,
                },
                footer: {
                  zIndex: 0,
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
                      render: ({ material }) => material?.name ?? '-',
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
                        heavyEquipmentClass?.name ?? '-',
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
        </GlobalModal>
      </DashboardCard>
    </>
  );
};

export default UnitCapacityPlanData;
