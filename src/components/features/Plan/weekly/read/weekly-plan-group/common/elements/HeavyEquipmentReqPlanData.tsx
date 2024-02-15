import { Group, Modal, ScrollArea, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DataTableColumn } from 'mantine-datatable';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DashboardCard,
  GlobalActionTable,
  MantineDataTable,
} from '@/components/elements';
import WeeklyPlanInformationData from '@/components/features/Plan/weekly/read/weekly-plan-group/common/elements/WeeklyPlanInformationData';

import {
  IHeavyEquipmentRequirementPlanActivity,
  IWeeklyHeavyEquipmentRequirement,
  useReadOneHeavyEquipmentReqPlan,
} from '@/services/graphql/query/plan/weekly/heavy-equipment-req-plan/useReadOneHeavyEquipmentReqPlan';

dayjs.extend(isoWeek);

const HeavyEquipmentReqPlanData = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;
  const page = Number(router.query.page) || 1;
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
      limit: null,
    },
    skip: !router.isReady || tabs !== 'heavyEquipmentReqPlan',
  });

  const handleSetPage = (page: number) => {
    const urlSet = `/plan/weekly/read/weekly-plan-group/${id}?tabs=${tabs}&page=${page}`;
    router.push(urlSet, undefined, { shallow: true });
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
      <DashboardCard p={0} isLoading={weeklyHeavyEquipmentReqPlanDataLoading}>
        <Stack spacing="sm">
          <Text fz={24} fw={600} color="brand">
            {t('commonTypography.heavyEquipmentReqPlanInformation')}
          </Text>
          <MantineDataTable
            tableProps={{
              records: data ?? [],
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
                  render: ({ materials }) => {
                    const material = materials.map((val) => val.name);
                    return material?.join(', ');
                  },
                },
                {
                  accessor: 'locations',
                  title: t('commonTypography.location'),
                  width: 220,

                  render: ({ locations }) => {
                    const location = locations.map((val) => val.name);
                    return location?.join(', ');
                  },
                },
                {
                  accessor: 'averageDistance',
                  title: t('commonTypography.averageDistance'),
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
                {t('commonTypography.formsOfActivity')}
              </Text>
              <Modal.CloseButton />
            </Modal.Header>
            <Modal.Body>
              <ScrollArea h={260}>
                <Group noWrap spacing={0} py={4}>
                  <MantineDataTable
                    tableProps={{
                      columns: [
                        {
                          accessor: 'formsOfActivity',
                          title: t('commonTypography.formsOfActivity'),
                          width: 200,
                          render: ({ activityForm }) =>
                            activityForm.name ?? '-',
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
                </Group>
              </ScrollArea>
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      </DashboardCard>
    </>
  );
};

export default HeavyEquipmentReqPlanData;
