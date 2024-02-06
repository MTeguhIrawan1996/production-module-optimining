import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Group, Text } from '@mantine/core';
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
  CommonWeeklyPlanInformation,
  DashboardCard,
  DisplayLoseTimeAndEffectiveWork,
  FormController,
  MantineDataTable,
  ModalConfirmation,
  PrimaryButton,
} from '@/components/elements';

import {
  IWorkTimeDay,
  IWorkTimePlanActivities,
  IWorkTimePlanValues,
  useCreateWeeklyWorkTimePlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyWorkTimePlan';
import { useReadAllActivityWorkTimePlan } from '@/services/graphql/query/plan/weekly/work-time-plan/useReadAllActivityWorkTimePlan';
import { useReadOneWorkTimePlan } from '@/services/graphql/query/plan/weekly/work-time-plan/useReadOneWorkTimePlan';
import { useReadAllWHPsMaster } from '@/services/graphql/query/working-hours-plan/useReadAllWHPMaster';
import { workTimeDay } from '@/utils/constants/DefaultValues/work-time-plan';
import { weeklyWorkTimePlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-work-time-plan-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

dayjs.extend(isoWeek);

interface IMutationWorkTimePlanBook {
  mutationType?: 'create' | 'update' | 'read';
  mutationSuccessMassage?: string;
}

const MutationWorkTimePlanBook = ({
  mutationType,
  mutationSuccessMassage,
}: IMutationWorkTimePlanBook) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;
  const [skipWorkingHourPlansData, setSkipWorkingHourPlansData] =
    React.useState<boolean>(false);
  const [skipActivityWorkTimePlan, setSkipActivityWorkTimePlan] =
    React.useState<boolean>(false);
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

  const methods = useForm<IWorkTimePlanValues>({
    resolver: zodResolver(weeklyWorkTimePlanMutationValidation),
    defaultValues: {
      totalLoseTimeWeek: '',
      totalEffectiveWorkHourWeek: '',
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
    mode: 'onSubmit',
  });

  const {
    fields: workTimePlanActivityFields,
    replace: workTimePlanActivityReplace,
  } = useFieldArray({
    name: 'workTimePlanActivities',
    control: methods.control,
    keyName: 'workTimePlanActivityId',
  });

  useReadAllWHPsMaster({
    variables: {
      limit: null,
    },
    skip: tabs !== 'workTimePlan' || skipWorkingHourPlansData,
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
      const defaultValue = [
        ...workTimePlanActivities,
        ...workTimePlanActivityFields,
      ];
      workTimePlanActivityReplace(defaultValue);
      setSkipWorkingHourPlansData(true);
    },
  });

  useReadAllActivityWorkTimePlan({
    skip:
      tabs !== 'workTimePlan' ||
      !skipWorkingHourPlansData ||
      skipActivityWorkTimePlan,
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
      const defaultValue = [
        ...workTimePlanActivities,
        ...workTimePlanActivityFields,
      ];
      workTimePlanActivityReplace(defaultValue);
      setSkipActivityWorkTimePlan(true);
    },
  });

  const { weeklyWorkTimePlanLoading } = useReadOneWorkTimePlan({
    variables: {
      weeklyPlanId: id,
    },
    skip:
      !router.isReady ||
      tabs !== 'workTimePlan' ||
      !skipWorkingHourPlansData ||
      !skipActivityWorkTimePlan,
    onCompleted: ({ weeklyWorkTimePlan }) => {
      if (weeklyWorkTimePlan) {
        weeklyWorkTimePlan.workTimePlanActivities.forEach((val) => {
          const newWeeklyWorkTime: IWorkTimeDay[] = val.weeklyWorkTimes.map(
            (wObj) => {
              return {
                id: wObj.id,
                day: wObj.day,
                hour: wObj.hour || '',
              };
            }
          );
          if (!val.loseTime) {
            const index = workTimePlanActivityFields.findIndex(
              (item) => item.activityId === val.activity?.id
            );
            methods.setValue(`workTimePlanActivities.${index}.id`, val.id);
            methods.setValue(
              `workTimePlanActivities.${index}.weeklyWorkTimes`,
              newWeeklyWorkTime
            );
            return;
          }
          const index = workTimePlanActivityFields.findIndex(
            (item) => item.loseTimeId === val.loseTime?.id
          );
          methods.setValue(`workTimePlanActivities.${index}.id`, val.id);
          methods.setValue(
            `workTimePlanActivities.${index}.weeklyWorkTimes`,
            newWeeklyWorkTime
          );
        });
      }
    },
  });

  const [executeUpdate, { loading }] = useCreateWeeklyWorkTimePlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: mutationSuccessMassage,
        icon: <IconCheck />,
      });
      router.push(
        `/plan/weekly/${mutationType}/weekly-plan-group/${id}?tabs=unitCapacityPlan`
      );
      if (mutationType === 'update') {
        setIsOpenConfirmation(false);
      }
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IWorkTimePlanValues>(error);
        if (errorArry.length) {
          errorArry.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
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

  const renderOtherColumnActivityCallback = React.useCallback(
    (obj: IWorkTimeDay, index: number) => {
      const group: DataTableColumn<IWorkTimePlanActivities> = {
        accessor: `${obj['day']}.activity`,
        width: 100,
        title: dayjs()
          .isoWeekday(Number(obj['day'] || 0))
          .format('dddd'),
        render: ({ id }, i: number) => {
          if (id === 'loseTime') {
            return (
              <DisplayLoseTimeAndEffectiveWork
                name="workTimePlanActivities"
                indexOfHour={index}
                variant="unstyled"
                disabled={false}
                readOnly
                calculationType="loseTime"
                styles={{
                  input: {
                    textAlign: 'center',
                  },
                }}
              />
            );
          }
          if (id === 'amountEffectiveWorkingHours') {
            return (
              <DisplayLoseTimeAndEffectiveWork
                name="workTimePlanActivities"
                indexOfHour={index}
                variant="unstyled"
                disabled={false}
                readOnly
                calculationType="amountEffectiveWorkingHours"
                styles={{
                  input: {
                    textAlign: 'center',
                  },
                }}
              />
            );
          }
          return (
            <FormController
              control="number-input-table-rhf"
              name={`workTimePlanActivities.${i}.weeklyWorkTimes.${index}.hour`}
              readOnly={mutationType === 'read' ? true : false}
              variant={mutationType === 'read' ? 'unstyled' : 'default'}
              styles={{
                input: {
                  textAlign: 'center',
                },
              }}
            />
          );
        },
      };
      return group;
    },
    [mutationType]
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
          const activityWorkTimePlan = recordsWithoutLoseTime.filter(
            (val) =>
              val.id !== 'loseTime' && val.id !== 'amountEffectiveWorkingHours'
          );
          const activityWorkTImePlanLength = activityWorkTimePlan?.length || 0;

          return (
            <FormController
              control="number-input-table-rhf"
              name={`workTimePlanActivities.${
                i + activityWorkTImePlanLength
              }.weeklyWorkTimes.${index}.hour`}
              readOnly={mutationType === 'read' ? true : false}
              variant={mutationType === 'read' ? 'unstyled' : 'default'}
              styles={{
                input: {
                  textAlign: 'center',
                },
              }}
            />
          );
        },
      };
      return group;
    },
    [recordsWithoutLoseTime, mutationType]
  );

  const renderOtherColumnLosetimeDay = workTimeDay?.map(
    renderOtherColumnLosetimeCallback
  );

  const handleSubmitForm: SubmitHandler<IWorkTimePlanValues> = async (data) => {
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

  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };

  return (
    <DashboardCard p={0} isLoading={weeklyWorkTimePlanLoading}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
          <Flex
            gap={32}
            direction="column"
            p={mutationType === 'read' ? 0 : 22}
          >
            {mutationType === 'read' ? undefined : (
              <CommonWeeklyPlanInformation />
            )}
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
                    columns: [
                      {
                        accessor: 'amount',
                        title: '',
                        render: ({ id }, index) => {
                          if (id === 'loseTime') {
                            return (
                              <FormController
                                control="number-input"
                                name="totalLoseTimeWeek"
                                variant="unstyled"
                                disabled={false}
                                readOnly
                                styles={{
                                  input: {
                                    textAlign: 'center',
                                  },
                                }}
                              />
                            );
                          }
                          if (id === 'amountEffectiveWorkingHours') {
                            return (
                              <FormController
                                control="number-input"
                                name="totalEffectiveWorkHourWeek"
                                variant="unstyled"
                                disabled={false}
                                readOnly
                                styles={{
                                  input: {
                                    textAlign: 'center',
                                  },
                                }}
                              />
                            );
                          }
                          return (
                            <FormController
                              control="input-sum-array"
                              name={`workTimePlanActivities.${index}.weeklyWorkTimes`}
                              keyObj="hour"
                              variant="unstyled"
                              disabled={false}
                              readOnly
                              styles={{
                                input: {
                                  textAlign: 'center',
                                },
                              }}
                            />
                          );
                        },
                        width: 100,
                      },
                    ],
                  },
                  {
                    id: 'unit',
                    title: 'Unit',
                    style: { textAlign: 'center' },
                    columns: [
                      {
                        accessor: 'unit',
                        title: '',
                        render: (_, index) => {
                          return (
                            <Text>{index === 0 ? 'Jam/Hari' : 'Jam'}</Text>
                          );
                        },
                        width: 100,
                      },
                    ],
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
                                render: ({ name }, index) => {
                                  const indextoAlphabet = String.fromCharCode(
                                    65 + index
                                  );
                                  return (
                                    <Text>{`${indextoAlphabet}. ${name}`}</Text>
                                  );
                                },
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
                              {
                                accessor: 'amount',
                                title: '',
                                render: (_, index) => {
                                  const activityWorkTimePlan =
                                    recordsWithoutLoseTime.filter(
                                      (val) =>
                                        val.id !== 'loseTime' &&
                                        val.id !== 'amountEffectiveWorkingHours'
                                    );
                                  const activityWorkTImePlanLength =
                                    activityWorkTimePlan?.length || 0;
                                  return (
                                    <FormController
                                      control="input-sum-array"
                                      name={`workTimePlanActivities.${
                                        index + activityWorkTImePlanLength
                                      }.weeklyWorkTimes`}
                                      keyObj="hour"
                                      variant="unstyled"
                                      disabled={false}
                                      readOnly
                                      styles={{
                                        input: {
                                          textAlign: 'center',
                                        },
                                      }}
                                    />
                                  );
                                },
                                width: 100,
                              },
                            ],
                          },
                          {
                            id: 'unit',
                            title: 'Unit',
                            style: { textAlign: 'center' },
                            columns: [
                              {
                                accessor: 'unit',
                                title: '',

                                render: () => {
                                  return <Text>Jam</Text>;
                                },
                                width: 100,
                              },
                            ],
                          },
                        ],
                        records: recordsWithLoseTime ?? [],
                        emptyState: undefined,
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
            {mutationType === 'read' ? undefined : (
              <Group w="100%" position="apart">
                <PrimaryButton
                  label={t('commonTypography.back')}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    router.push(
                      mutationType === 'update'
                        ? `/plan/weekly/${mutationType}/${id}`
                        : `/plan/weekly`
                    );
                  }}
                />
                <Group spacing="xs">
                  <PrimaryButton
                    label={t('commonTypography.save')}
                    loading={mutationType === 'create' ? loading : undefined}
                    type={mutationType === 'create' ? 'submit' : 'button'}
                    onClick={
                      mutationType === 'update'
                        ? async () => {
                            const output = await methods.trigger(undefined, {
                              shouldFocus: true,
                            });
                            if (output) setIsOpenConfirmation((prev) => !prev);
                          }
                        : undefined
                    }
                  />
                </Group>
              </Group>
            )}
          </Flex>
          <ModalConfirmation
            isOpenModalConfirmation={isOpenConfirmation}
            actionModalConfirmation={() =>
              setIsOpenConfirmation((prev) => !prev)
            }
            actionButton={{
              label: t('commonTypography.yes'),
              type: 'button',
              onClick: handleConfirmation,
              loading: loading,
            }}
            backButton={{
              label: 'Batal',
            }}
            modalType={{
              type: 'default',
              title: t('commonTypography.alertTitleConfirmUpdate'),
            }}
            withDivider={true}
          />
        </form>
      </FormProvider>
    </DashboardCard>
  );
};

export default MutationWorkTimePlanBook;
