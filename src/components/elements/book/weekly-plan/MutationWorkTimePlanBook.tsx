import { Flex, Group } from '@mantine/core';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DataTableColumn } from 'mantine-datatable';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormController,
  MantineDataTable,
  PrimaryButton,
} from '@/components/elements';
import DashboardCard from '@/components/elements/card/DashboardCard';
import CommonWeeklyPlanInformation from '@/components/elements/ui/CommonWeeklyPlanInformation';

import { useReadAllActivityWorkTimePlan } from '@/services/graphql/query/plan/weekly/work-time-plan/useReadAllActivityWorkTimePlan';
import { useReadAllWHPsMaster } from '@/services/graphql/query/working-hours-plan/useReadAllWHPMaster';
import { workTimeDay } from '@/utils/constants/DefaultValues/work-time-plan';

dayjs.extend(isoWeek);

const MutationWorkTimePlanBook = () => {
  const { t } = useTranslation('default');

  const nestedTable = [
    {
      id: '9d7b6df5-aa1e-4203-bfa8-7d9464e331cb',
      name: t('commonTypography.loseTime'),
    },
    {
      id: '3c147f0b-c63f-4830-8ced-f378aad9efc6',
      name: t('commonTypography.amountEffectiveWorkingHours'),
    },
  ];

  const methods = useForm<any>({
    defaultValues: {
      workTimePlanActivities: [
        {
          id: null,
          isLoseTime: false,
          activityId: null,
          loseTimeId: null,
          name: '',
          weeklyWorkTimes: [
            {
              id: null,
              day: 0,
              hour: 0,
            },
            {
              id: null,
              day: 1,
              hour: null,
            },
            {
              id: null,
              day: 2,
              hour: 2,
            },
            {
              id: null,
              day: 3,
              hour: 3,
            },
            {
              id: null,
              day: 4,
              hour: 4,
            },
            {
              id: null,
              day: 5,
              hour: 5,
            },
            {
              id: null,
              day: 6,
              hour: 6,
            },
          ],
        },
      ],
    },
    mode: 'onBlur',
  });

  const { activityWorkTImePlan } = useReadAllActivityWorkTimePlan({});

  const { workingHourPlansData } = useReadAllWHPsMaster({
    variables: {
      limit: null,
    },
  });

  const margeTable = [...(activityWorkTImePlan ?? []), ...nestedTable];

  const renderOtherColumnActivityCallback = React.useCallback((obj: any) => {
    const group: DataTableColumn<any> = {
      accessor: `${obj['day']}.activity`,
      width: 100,
      title: dayjs()
        .isoWeekday(Number(obj['day'] || 0))
        .format('dddd'),
      render: ({ id }) => {
        if (id === '9d7b6df5-aa1e-4203-bfa8-7d9464e331cb') {
          return (
            <FormController
              control="number-input-table-rhf"
              name="foo"
              variant="unstyled"
              readOnly
            />
          );
        }
        if (id === '3c147f0b-c63f-4830-8ced-f378aad9efc6') {
          return (
            <FormController
              control="number-input-table-rhf"
              name="foo"
              variant="unstyled"
              readOnly
            />
          );
        }
        return <FormController control="number-input-table-rhf" name="foo" />;
      },
    };
    return group;
  }, []);

  const renderOtherColumnActivityDay = workTimeDay?.map(
    renderOtherColumnActivityCallback
  );

  const renderOtherColumnLosetimeCallback = React.useCallback((obj: any) => {
    const group: DataTableColumn<any> = {
      accessor: `${obj['day']}.loseTime`,
      width: 100,
      title: dayjs()
        .isoWeekday(Number(obj['day'] || 0))
        .format('dddd'),
      render: ({ id }) => {
        if (id === '9d7b6df5-aa1e-4203-bfa8-7d9464e331cb') {
          return (
            <FormController
              control="number-input-table-rhf"
              name="foo"
              variant="unstyled"
              readOnly
            />
          );
        }
        if (id === '3c147f0b-c63f-4830-8ced-f378aad9efc6') {
          return (
            <FormController
              control="number-input-table-rhf"
              name="foo"
              variant="unstyled"
              readOnly
            />
          );
        }
        return <FormController control="number-input-table-rhf" name="foo" />;
      },
    };
    return group;
  }, []);

  const renderOtherColumnLosetimeDay = workTimeDay?.map(
    renderOtherColumnLosetimeCallback
  );

  const handleSubmitForm: SubmitHandler<any> = async () => {
    // await executeUpdate({
    //   variables: {
    //     weeklyPlanId: id,
    //     unitCapacityPlans: newUnitCapacityPlan,
    //   },
    // });
  };
  return (
    <DashboardCard p={0}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
          <Flex gap={32} direction="column" p={22}>
            <CommonWeeklyPlanInformation />
            <MantineDataTable
              tableProps={{
                highlightOnHover: true,
                withColumnBorders: true,
                groups: [
                  {
                    id: 'no',
                    title: 'No',
                    style: { textAlign: 'center' },
                    columns: [
                      {
                        accessor: 'index',
                        title: '',
                        render: (record) => {
                          return margeTable && margeTable.indexOf(record) + 1;
                        },
                        width: 60,
                      },
                    ],
                  },
                  {
                    id: 'activity',
                    title: t('commonTypography.activity'),
                    style: { textAlign: 'center' },
                    columns: [{ accessor: 'name', title: '', width: 260 }],
                  },
                  {
                    id: 'day',
                    title: t('commonTypography.day'),
                    style: { textAlign: 'center' },
                    columns: renderOtherColumnActivityDay ?? [],
                  },
                  {
                    id: 'amount',
                    title: 'Total',
                    style: { textAlign: 'center' },
                    columns: [{ accessor: 'amount', title: '', width: 100 }],
                  },
                  {
                    id: 'unit',
                    title: 'Unit',
                    style: { textAlign: 'center' },
                    columns: [{ accessor: 'unit', title: '', width: 100 }],
                  },
                ],
                rowExpansion: {
                  allowMultiple: true,
                  expanded: {
                    recordIds: ['9d7b6df5-aa1e-4203-bfa8-7d9464e331cb'],
                  },
                  content: () => (
                    <MantineDataTable
                      tableProps={{
                        noHeader: true,
                        shadow: '0',
                        withBorder: false,
                        minHeight: 0,
                        borderRadius: 0,
                        groups: [
                          {
                            id: 'no',
                            title: 'No',
                            style: { textAlign: 'center' },
                            columns: [
                              {
                                accessor: 'index',
                                title: '',
                                render: () => null,
                                width: 60,
                              },
                            ],
                          },
                          {
                            id: 'activity',
                            title: t('commonTypography.activity'),
                            style: { textAlign: 'center' },
                            columns: [
                              {
                                accessor: 'activityName',
                                title: '',
                                width: 260,
                              },
                            ],
                          },
                          {
                            id: 'day',
                            title: t('commonTypography.day'),
                            style: { textAlign: 'center' },
                            columns: renderOtherColumnLosetimeDay ?? [],
                          },
                          {
                            id: 'amount',
                            title: 'Total',
                            style: { textAlign: 'center' },
                            columns: [
                              { accessor: 'amount', title: '', width: 100 },
                            ],
                          },
                          {
                            id: 'unit',
                            title: 'Unit',
                            style: { textAlign: 'center' },
                            columns: [
                              { accessor: 'unit', title: '', width: 100 },
                            ],
                          },
                        ],
                        records: workingHourPlansData ?? [],
                      }}
                    />
                  ),
                },
                records: margeTable ?? [],
              }}
              emptyStateProps={{
                title: t('commonTypography.dataNotfound'),
              }}
            />
            <Group w="100%" position="apart">
              <PrimaryButton
                label={t('commonTypography.back')}
                type="button"
                variant="outline"
              />
              <Group spacing="xs">
                <PrimaryButton
                  label={t('commonTypography.save')}
                  type="submit"
                />
              </Group>
            </Group>
          </Flex>
        </form>
      </FormProvider>
    </DashboardCard>
  );
};

export default MutationWorkTimePlanBook;
