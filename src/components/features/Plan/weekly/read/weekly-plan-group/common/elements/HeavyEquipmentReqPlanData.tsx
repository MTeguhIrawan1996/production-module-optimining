import { Stack, Text } from '@mantine/core';
import { Badge } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useRouter } from 'next/router';
import { useQueryState } from 'next-usequerystate';
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
  IHeavyEquipmentRequirementPlanActivity,
  IWeeklyHeavyEquipmentRequirement,
  useReadOneHeavyEquipmentReqPlan,
} from '@/services/graphql/query/plan/weekly/heavy-equipment-req-plan/useReadOneHeavyEquipmentReqPlan';
import dayjs from '@/utils/helper/dayjs.config';

const HeavyEquipmentReqPlanData = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const [tabs] = useQueryState('tabs');
  const [page, setPage] = React.useState<number>(1);
  const [
    heavyEquipmentRequirementPlanActivities,
    setHeavyEquipmentRequirementPlanActivities,
  ] = React.useState<IHeavyEquipmentRequirementPlanActivity[] | undefined>(
    undefined
  );
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);

  const {
    weeklyHeavyEquipmentReqPlanData: data,
    weeklyHeavyEquipmentReqPlanMeta: meta,
    weeklyHeavyEquipmentReqPlanDataLoading,
  } = useReadOneHeavyEquipmentReqPlan({
    variables: {
      weeklyPlanId: id,
      limit: 10,
      page: page,
    },
    skip: tabs !== 'heavyEquipmentReqPlan',
  });

  const handleSetPage = (page: number) => {
    setPage(page);
  };

  const renderOtherColumnCallback = React.useCallback(
    (obj: IWeeklyHeavyEquipmentRequirement) => {
      const group: DataTableColumn<IHeavyEquipmentRequirementPlanActivity> = {
        accessor: `value.${obj.day}`,
        title: dayjs()
          .isoWeekday(Number(obj['day'] || 0))
          .format('dddd'),
        width: 100,
        render: ({ weeklyHeavyEquipmentRequirements }) => {
          return `${weeklyHeavyEquipmentRequirements[obj.day].value || '-'}`;
        },
      };

      return group;
    },
    []
  );

  const renderOtherGroup =
    heavyEquipmentRequirementPlanActivities?.[0].weeklyHeavyEquipmentRequirements.map(
      renderOtherColumnCallback
    );

  return (
    <>
      <WeeklyPlanInformationData />
      <DashboardCard p={0}>
        <Stack spacing="sm">
          <Text fz={24} fw={600} color="brand">
            {t('commonTypography.heavyEquipmentReqPlanInformation')}
          </Text>
          <MantineDataTable
            tableProps={{
              records: data ?? [],
              fetching: weeklyHeavyEquipmentReqPlanDataLoading,
              columns: [
                {
                  accessor: 'activityName',
                  title: t('commonTypography.activityName'),
                  noWrap: false,
                  width: 300,
                },
                {
                  accessor: 'materials',
                  title: t('commonTypography.material'),
                  width: 220,
                  render: ({ materials }) =>
                    materials.map((val) => (
                      <Badge key={val.id}>{val.name}</Badge>
                    )),
                },
                {
                  accessor: 'locations',
                  title: t('commonTypography.location'),
                  width: 240,
                  render: ({ locations }) =>
                    locations.map((val) => (
                      <Badge key={val.id}>{val.name}</Badge>
                    )),
                },
                {
                  accessor: 'averageDistance',
                  title: t('commonTypography.averageDistance'),
                },
                {
                  accessor: 'activity',
                  title: t('commonTypography.activity2'),
                  render: ({ activityType }) => activityType.name ?? '-',
                },
                {
                  accessor: 'desc',
                  title: t('commonTypography.desc'),
                },
                {
                  accessor: 'formsOfActivity',
                  title: t('commonTypography.formsOfActivity'),
                  render: ({ id }) => {
                    return (
                      <GlobalActionTable
                        actionRead={{
                          onClick: (e) => {
                            e.stopPropagation();
                            const heavyEquipmentRequirementPlanActivitiesById =
                              data?.find((val) => val.id === id);
                            setHeavyEquipmentRequirementPlanActivities(
                              heavyEquipmentRequirementPlanActivitiesById?.heavyEquipmentRequirementPlanActivities
                            );
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
          label={t('commonTypography.formsOfActivity')}
        >
          <MantineDataTable
            tableProps={{
              columns: [
                {
                  accessor: 'formsOfActivity',
                  title: t('commonTypography.formsOfActivity'),
                  width: 200,
                  render: ({ activity }) => activity.name ?? '-',
                },
                {
                  accessor: 'heavyEquipmentClass',
                  title: t('commonTypography.heavyEquipmentClass'),
                  width: 180,
                  render: ({ class: heavyEquipmentClass }) =>
                    heavyEquipmentClass.name ?? '-',
                },
                ...(renderOtherGroup ?? []),
              ],
              records: heavyEquipmentRequirementPlanActivities,
              highlightOnHover: false,
              withColumnBorders: true,
            }}
          />
        </GlobalModal>
      </DashboardCard>
    </>
  );
};

export default HeavyEquipmentReqPlanData;
