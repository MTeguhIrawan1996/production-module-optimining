import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DataTableColumn } from 'mantine-datatable';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  FieldArrayWithId,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormController,
  MantineDataTable,
  PrimaryButton,
} from '@/components/elements';
import DashboardCard from '@/components/elements/card/DashboardCard';
import CommonWeeklyPlanInformation from '@/components/elements/ui/CommonWeeklyPlanInformation';

import {
  IWorkTimeDay,
  IWorkTimePlanActivities,
  IWorkTimePlanValues,
  useCreateWeeklyWorkTimePlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyWorkTimePlan';
import { useReadAllActivityWorkTimePlan } from '@/services/graphql/query/plan/weekly/work-time-plan/useReadAllActivityWorkTimePlan';
import { useReadAllWHPsMaster } from '@/services/graphql/query/working-hours-plan/useReadAllWHPMaster';
import { workTimeDay } from '@/utils/constants/DefaultValues/work-time-plan';
import { weeklyWorkTimePlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-work-time-plan-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

dayjs.extend(isoWeek);

const MutationWorkTimePlanBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;

  const methods = useForm<IWorkTimePlanValues>({
    resolver: zodResolver(weeklyWorkTimePlanMutationValidation),
    defaultValues: {
      workTimePlanActivities: [
        {
          id: 'loseTime',
          isLoseTime: false,
          activityId: null,
          loseTimeId: null,
          name: t('commonTypography.loseTime'),
          weeklyWorkTimes: workTimeDay,
        },
        {
          id: 'amountEffectiveWorkingHours',
          isLoseTime: false,
          activityId: null,
          loseTimeId: null,
          name: t('commonTypography.amountEffectiveWorkingHours'),
          weeklyWorkTimes: workTimeDay,
        },
      ],
    },
    mode: 'onBlur',
  });

  const {
    fields: workTimePlanActivityFields,
    // append: workTimePlanActivityAppend,
    prepend: workTimePlanActivityPrepend,
    // update: workTimePlanActivityUpdate,
    // remove: workTimePlanActivityRemove,
    // replace: workTimePlanActivityReplace,
  } = useFieldArray({
    name: 'workTimePlanActivities',
    control: methods.control,
    keyName: 'workTimePlanActivityId',
  });

  const { workingHourPlansData } = useReadAllWHPsMaster({
    variables: {
      limit: null,
    },
    skip: tabs !== 'workTimePlan',
    onCompleted: ({ workingHourPlans }) => {
      const workTimePlanActivities = workingHourPlans.data.map((obj) => {
        const value = {
          id: null,
          isLoseTime: true,
          activityId: null,
          loseTimeId: obj.id,
          name: obj.activityName,
          weeklyWorkTimes: workTimeDay,
        };
        return value;
      });
      workTimePlanActivityPrepend(workTimePlanActivities);
    },
  });

  const { activityWorkTImePlan } = useReadAllActivityWorkTimePlan({
    skip: tabs !== 'workTimePlan' || !workingHourPlansData,
    onCompleted: ({ activities }) => {
      const workTimePlanActivities = activities.map((obj) => {
        const value = {
          id: null,
          isLoseTime: false,
          activityId: obj.id,
          loseTimeId: null,
          name: obj.name,
          weeklyWorkTimes: workTimeDay,
        };
        return value;
      });
      workTimePlanActivityPrepend(workTimePlanActivities);
    },
  });

  const [executeUpdate, { loading }] = useCreateWeeklyWorkTimePlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('weeklyPlan.successUpdateMessage'),
        icon: <IconCheck />,
      });
      // router.push(
      //   `/plan/weekly/${mutationType}/weekly-plan-group/${id}?tabs=next`
      // );
      // if (mutationType === 'update') {
      //   setIsOpenConfirmation(false);
      // }
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IWorkTimePlanValues>(error);
        if (errorArry.length) {
          errorArry.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message }, { shouldFocus: true });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: error.message,
          icon: <IconX />,
        });
      }
    },
  });

  const recordsWithoutLoseTime = workTimePlanActivityFields.filter(
    (
      val: FieldArrayWithId<
        IWorkTimePlanValues,
        'workTimePlanActivities',
        'workTimePlanActivityId'
      >
    ) => !val.isLoseTime
  );
  const recordsWithLoseTime = workTimePlanActivityFields.filter(
    (
      val: FieldArrayWithId<
        IWorkTimePlanValues,
        'workTimePlanActivities',
        'workTimePlanActivityId'
      >
    ) => val.isLoseTime
  );

  // console.log(workTimePlanActivityFields);
  // // console.log('no losetime', recordsWithoutLoseTime);
  // // console.log('with losetime', recordsWithLoseTime);

  const renderOtherColumnActivityCallback = React.useCallback(
    (obj: IWorkTimeDay, index: number) => {
      const group: DataTableColumn<IWorkTimePlanActivities> = {
        accessor: `${obj['day']}.activity`,
        width: 100,
        title: dayjs()
          .isoWeekday(Number(obj['day'] || 0))
          .format('dddd'),
        render: ({ id }, i: number) => {
          // const recordsWithLoseTimeLength = recordsWithLoseTime?.length || 0;
          if (id === 'loseTime') {
            return <div className="">sistem</div>;
          }
          if (id === 'amountEffectiveWorkingHours') {
            return <div className="">sistem</div>;
          }
          return (
            <FormController
              control="number-input-table-rhf"
              name={`workTimePlanActivities.${i}.weeklyWorkTimes.${index}.hour`}
              precision={0}
            />
          );
        },
      };
      return group;
    },
    []
  );

  const renderOtherColumnActivityDay = workTimeDay?.map(
    renderOtherColumnActivityCallback
  );

  const renderOtherColumnLosetimeCallback = React.useCallback(
    (obj: IWorkTimeDay, index: number) => {
      const group: DataTableColumn<IWorkTimePlanActivities> = {
        accessor: `${obj['day']}.loseTime`,
        width: 100,
        title: dayjs()
          .isoWeekday(Number(obj['day'] || 0))
          .format('dddd'),
        render: (_, i) => {
          const activityWorkTImePlanLength = activityWorkTImePlan?.length || 0;
          return (
            <FormController
              control="number-input-table-rhf"
              name={`workTimePlanActivities.${
                i + activityWorkTImePlanLength
              }.weeklyWorkTimes.${index}.hour`}
              precision={0}
            />
          );
        },
      };
      return group;
    },
    [activityWorkTImePlan]
  );

  const renderOtherColumnLosetimeDay = workTimeDay?.map(
    renderOtherColumnLosetimeCallback
  );

  const handleSubmitForm: SubmitHandler<IWorkTimePlanValues> = async () => {
    const data = methods.getValues();
    const newWorkTimeActivity = data.workTimePlanActivities
      .map((obj) => {
        const weekltWorkTimeValue = obj.weeklyWorkTimes.map((wObj) => {
          const newValue: IWorkTimeDay = {
            id: wObj.id ? wObj.id : undefined,
            day: wObj.day,
            hour: wObj.hour || null,
          };
          return newValue;
        });
        const newValue: Omit<IWorkTimePlanActivities, 'name'> = {
          id: obj.id ? obj.id : undefined,
          activityId: obj.activityId,
          isLoseTime: obj.isLoseTime,
          loseTimeId: obj.loseTimeId,
          weeklyWorkTimes: weekltWorkTimeValue,
        };
        return newValue;
      })
      .filter(
        (v) => v.id !== 'loseTime' && v.id !== 'amountEffectiveWorkingHours'
      );
    await executeUpdate({
      variables: {
        weeklyPlanId: id,
        workTimePlanActivities: newWorkTimeActivity,
      },
    });
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
                idAccessor: (record) => {
                  return record.id ? record.id : record.workTimePlanActivityId;
                },
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
                          return (
                            recordsWithoutLoseTime &&
                            recordsWithoutLoseTime.indexOf(record) + 1
                          );
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
                    recordIds: ['loseTime'],
                  },
                  content: () => (
                    <MantineDataTable
                      tableProps={{
                        noHeader: true,
                        shadow: '0',
                        withBorder: false,
                        minHeight: 0,
                        borderRadius: 0,
                        idAccessor: (record) => {
                          return record.id
                            ? record.id
                            : record.workTimePlanActivityId;
                        },
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
                                accessor: 'name',
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
                        records: recordsWithLoseTime ?? [],
                      }}
                    />
                  ),
                },
                records: recordsWithoutLoseTime ?? [],
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
                onClick={() => {
                  router.push(`/plan/weekly`);
                }}
              />
              <Group spacing="xs">
                <PrimaryButton
                  label={t('commonTypography.save')}
                  loading={loading}
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
