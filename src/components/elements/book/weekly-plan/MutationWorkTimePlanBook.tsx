import { zodResolver } from '@hookform/resolvers/zod';
import { Flex, Grid } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useQueryState } from 'next-usequerystate';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';
import CommonWeeklyPlanInformation from '@/components/elements/book/weekly-plan/ui/CommonWeeklyPlanInformation';
import InputTableWorkTimePlan from '@/components/elements/book/weekly-plan/ui/InputTableWorkTimePlan';

import {
  IWorkTimeDay,
  IWorkTimePlanActivities,
  IWorkTimePlanValues,
  useCreateWeeklyWorkTimePlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyWorkTimePlan';
import { useReadAllActivityWorkTimePlan } from '@/services/graphql/query/plan/weekly/work-time-plan/useReadAllActivityWorkTimePlan';
import { useReadOneWorkTimePlan } from '@/services/graphql/query/plan/weekly/work-time-plan/useReadOneWorkTimePlan';
import { useReadAllWHPsMaster } from '@/services/graphql/query/working-hours-plan/useReadAllWHPMaster';
import { workTimeDay } from '@/utils/constants/DefaultValues/work-time-plans';
import { weeklyWorkTimePlanMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-work-time-plan-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

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
  const [tabs, setTabs] = useQueryState('tabs');
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
          id: null,
          isLoseTime: false,
          activityId: 'loseTime',
          loseTimeId: null,
          name: t('commonTypography.loseTime'),
          weeklyWorkTimes: workTimeDay,
        },
        {
          id: null,
          isLoseTime: false,
          activityId: 'amountEffectiveWorkingHours',
          loseTimeId: null,
          name: t('commonTypography.amountEffectiveWorkingHours'),
          weeklyWorkTimes: workTimeDay,
        },
      ],
    },
    mode: 'onSubmit',
  });

  const { fields: workTimePlanActivityFields } = useFieldArray({
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
      methods.setValue('workTimePlanActivities', defaultValue);
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
      methods.setValue('workTimePlanActivities', defaultValue);
      setSkipActivityWorkTimePlan(true);
    },
  });

  const { weeklyWorkTimePlanLoading } = useReadOneWorkTimePlan({
    variables: {
      weeklyPlanId: id,
    },
    skip:
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
      setTabs('unitCapacityPlan');
      if (mutationType === 'update') {
        setIsOpenConfirmation(false);
      }
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

  const fieldRhf = React.useMemo(() => {
    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.productionTargetPlan'),
        enableGroupLabel: false,
        formControllers: [],
        paperProps: {
          withBorder: false,
          p: 0,
        },
        renderItem: () => {
          return (
            <Grid.Col span={12}>
              <InputTableWorkTimePlan
                mutationType={mutationType}
                isLoading={weeklyWorkTimePlanLoading}
              />
            </Grid.Col>
          );
        },
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutationType, weeklyWorkTimePlanLoading]);

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
        (v) =>
          v.activityId !== 'loseTime' &&
          v.activityId !== 'amountEffectiveWorkingHours'
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
    <DashboardCard p={0}>
      <Flex gap={32} direction="column" p={mutationType === 'read' ? 0 : 22}>
        {mutationType === 'read' ? undefined : <CommonWeeklyPlanInformation />}
        <GlobalFormGroup
          flexProps={{
            p: 0,
          }}
          field={fieldRhf}
          methods={methods}
          submitForm={handleSubmitForm}
          submitButton={
            mutationType === 'read'
              ? undefined
              : {
                  label: t('commonTypography.save'),
                  loading: mutationType === 'create' ? loading : undefined,
                  type: mutationType === 'create' ? 'submit' : 'button',
                  onClick:
                    mutationType === 'update'
                      ? async () => {
                          const output = await methods.trigger(undefined, {
                            shouldFocus: true,
                          });
                          if (output) setIsOpenConfirmation((prev) => !prev);
                        }
                      : undefined,
                }
          }
          backButton={
            mutationType === 'read'
              ? undefined
              : {
                  onClick: () =>
                    router.push(
                      mutationType === 'update'
                        ? `/plan/weekly/${mutationType}/${id}`
                        : `/plan/weekly`
                    ),
                }
          }
          modalConfirmation={{
            isOpenModalConfirmation: isOpenConfirmation,
            actionModalConfirmation: () =>
              setIsOpenConfirmation((prev) => !prev),
            actionButton: {
              label: t('commonTypography.yes'),
              type: 'button',
              onClick: handleConfirmation,
              loading: loading,
            },
            backButton: {
              label: 'Batal',
            },
            modalType: {
              type: 'default',
              title: t('commonTypography.alertTitleConfirmUpdate'),
            },
            withDivider: true,
          }}
        />
      </Flex>
    </DashboardCard>
  );
};

export default MutationWorkTimePlanBook;
