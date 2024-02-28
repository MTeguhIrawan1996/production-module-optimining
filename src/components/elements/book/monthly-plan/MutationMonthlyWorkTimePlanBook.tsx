import { Flex, Grid } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import CommonMonthlyPlanInformation from '@/components/elements/book/monthly-plan/ui/CommonMonthlyPlanInformation';
import InputMonthlyTableWorkTimePlan from '@/components/elements/book/monthly-plan/ui/InputMonthlyTableWorkTimePlan';
import DashboardCard from '@/components/elements/card/DashboardCard';
import GlobalFormGroup from '@/components/elements/form/GlobalFormGroup';

import {
  IWeeklyProductionTargetPlanValues,
  useCreateWeeklyProductionTargetPlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyProductionTargetPlan';
import { useReadAllActivityWorkTimePlan } from '@/services/graphql/query/plan/weekly/work-time-plan/useReadAllActivityWorkTimePlan';
import { useReadAllWHPsMaster } from '@/services/graphql/query/working-hours-plan/useReadAllWHPMaster';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { useStoreWeeklyInMonthly } from '@/utils/store/useWeekInMonthlyStore';

import { ControllerGroup } from '@/types/global';

interface IMutationMonthlyWorkTimePlanBook {
  mutationType?: 'create' | 'update' | 'read';
  mutationSuccessMassage?: string;
}

const MutationMonthlyWorkTimePlanBook = ({
  mutationType,
  mutationSuccessMassage,
}: IMutationMonthlyWorkTimePlanBook) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);
  const [skipWorkingHourPlansData, setSkipWorkingHourPlansData] =
    React.useState<boolean>(false);
  const [skipActivityWorkTimePlan, setSkipActivityWorkTimePlan] =
    React.useState<boolean>(false);
  const [weeklyInMonthly] = useStoreWeeklyInMonthly(
    (state) => [state.weeklyInMonthly],
    shallow
  );

  const methods = useForm<any>({
    // resolver: zodResolver(weeklyProductionTargetPlanMutationValidation),
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
          weeklyWorkTimes: [],
        },
        {
          id: null,
          isLoseTime: false,
          activityId: 'amountEffectiveWorkingHours',
          loseTimeId: null,
          name: t('commonTypography.amountEffectiveWorkingHours'),
          weeklyWorkTimes: [],
        },
      ],
    },
    mode: 'onBlur',
  });

  const {
    fields: workTimePlanActivityFields,
    // replace: workTimePlanActivityReplace,
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
      const newWeekInMonth = weeklyInMonthly.map((val) => ({
        id: null,
        week: val,
        value: '',
      }));

      const workTimePlanActivities = workingHourPlans.data.map((obj) => {
        const value = {
          id: null,
          isLoseTime: true,
          activityId: null,
          loseTimeId: obj.id,
          name: obj.activityName,
          weeklyWorkTimes: newWeekInMonth,
        };
        return value;
      });
      const newWrokTimeActivityFields = workTimePlanActivityFields.map(
        (wObj) => {
          return {
            ...wObj,
            weeklyWorkTimes: newWeekInMonth,
          };
        }
      );
      const defaultValue = [
        ...workTimePlanActivities,
        ...newWrokTimeActivityFields,
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
      const newWeekInMonth = weeklyInMonthly.map((val) => ({
        id: null,
        week: val,
        value: '',
      }));
      const workTimePlanActivities = activities.map((obj) => {
        const value = {
          id: null,
          isLoseTime: false,
          activityId: obj.id,
          loseTimeId: null,
          name: obj.name,
          weeklyWorkTimes: newWeekInMonth,
        };
        return value;
      });
      const newWrokTimeActivityFields = workTimePlanActivityFields.map(
        (wObj) => {
          return {
            ...wObj,
            weeklyWorkTimes: newWeekInMonth,
          };
        }
      );
      const defaultValue = [
        ...workTimePlanActivities,
        ...newWrokTimeActivityFields,
      ];
      methods.setValue('workTimePlanActivities', defaultValue);
      setSkipActivityWorkTimePlan(true);
    },
  });

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [executeUpdate, { loading }] = useCreateWeeklyProductionTargetPlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: mutationSuccessMassage,
        icon: <IconCheck />,
      });
      router.push(
        `/plan/weekly/${mutationType}/weekly-plan-group/${id}?tabs=miningMapPlan`
      );
      if (mutationType === 'update') {
        setIsOpenConfirmation(false);
      }
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IWeeklyProductionTargetPlanValues>(error);
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
              <InputMonthlyTableWorkTimePlan />
            </Grid.Col>
          );
        },
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, mutationType]);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleSubmitForm: SubmitHandler<any> = async (data) => {
    // const newProductionTargetPlans: Omit<
    //   IWeeklyProductionTargetPlanData,
    //   'materialName' | 'isPerent'
    // >[] = data.productionTargetPlans
    //   .filter((f) => f.materialId !== 'sr')
    //   .map(({ id, materialId, weeklyProductionTargets }) => {
    //     const newWeeklyProductionTargets: IWeeklyProductionTarget[] =
    //       weeklyProductionTargets.map((wObj) => {
    //         return {
    //           id: wObj.id || undefined,
    //           day: wObj.day,
    //           rate: wObj.rate || null,
    //           ton: wObj.ton || null,
    //         };
    //       });
    //     return {
    //       id: id || undefined,
    //       materialId: materialId,
    //       weeklyProductionTargets: newWeeklyProductionTargets,
    //     };
    //   });
    // await executeUpdate({
    //   variables: {
    //     weeklyPlanId: id,
    //     productionTargetPlans: newProductionTargetPlans,
    //   },
    // });
  };

  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };

  return (
    <DashboardCard p={0}>
      <Flex gap={32} direction="column" p={mutationType === 'read' ? 0 : 22}>
        {mutationType === 'read' ? undefined : <CommonMonthlyPlanInformation />}
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
                        ? `/plan/monthly/${mutationType}/${id}`
                        : `/plan/monthly`
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

export default MutationMonthlyWorkTimePlanBook;
