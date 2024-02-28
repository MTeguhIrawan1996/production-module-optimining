import { Flex, Grid } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React from 'react';
import {
  FieldArrayWithId,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import MonthlyInputGroupActivity, {
  IMonthlyInputGroupActivityProps,
} from '@/components/elements/book/monthly-plan/input/MonthlyInputGroupActivity';
import CommonMonthlyPlanInformation from '@/components/elements/book/monthly-plan/ui/CommonMonthlyPlanInformation';
import DashboardCard from '@/components/elements/card/DashboardCard';
import GlobalFormGroup from '@/components/elements/form/GlobalFormGroup';

import {
  IMutationMonthlyHeavyEquipmentReqPlanValues,
  IMutationMonthlyHeavyEquipmentRequirement,
  useCreateMonthlyHeavyEquipmentReqPlan,
} from '@/services/graphql/mutation/plan/monthly/useCreateMonthlyHeavyEquipmentReqPlan';
import { useReadOneHeavyEquipmentReqPlan } from '@/services/graphql/query/plan/weekly/heavy-equipment-req-plan/useReadOneHeavyEquipmentReqPlan';
import {
  globalMultipleSelectLocation,
  globalMultipleSelectMaterial,
  globalNumberInput,
  globalText,
} from '@/utils/constants/Field/global-field';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { useStoreWeeklyInMonthly } from '@/utils/store/useWeekInMonthlyStore';

import { ControllerGroup } from '@/types/global';

type Props = {
  mutationType?: 'create' | 'update';
  mutationSuccessMassage?: string;
};

const MutationMonthlyHeavyEquipmentReqPlanBook = ({
  mutationType,
  mutationSuccessMassage,
}: Props) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);
  const [weeklyInMonthly] = useStoreWeeklyInMonthly(
    (state) => [state.weeklyInMonthly],
    shallow
  );

  const methods = useForm<IMutationMonthlyHeavyEquipmentReqPlanValues>({
    // resolver: zodResolver(heavyEquipmentReqMutationValidation),
    defaultValues: {
      heavyEquipmentRequirementPlans: [
        {
          id: null,
          activityName: '',
          materialIds: [],
          locationIds: [],
          averageDistance: '',
          desc: '',
          activities: [
            {
              id: null,
              activityId: '',
              classId: '',
              weeklyHeavyEquipmentRequirements: [],
            },
          ],
        },
      ],
    },
    mode: 'onSubmit',
  });

  const {
    fields: heavyequipmentReqFields,
    append: heavyequipmentReqAppend,
    update: heavyequipmentReqUpdate,
    remove: heavyequipmentReqRemove,
    // replace: heavyequipmentReqReplace,
  } = useFieldArray({
    name: 'heavyEquipmentRequirementPlans',
    control: methods.control,
    keyName: 'heavyequipmentReqPlanId',
  });

  React.useEffect(() => {
    if (weeklyInMonthly.length > 0) {
      const newWeekInMonth: IMutationMonthlyHeavyEquipmentRequirement[] =
        weeklyInMonthly.map((val) => ({
          id: null,
          week: val,
          value: '',
        }));
      methods.setValue(
        'heavyEquipmentRequirementPlans.0.activities.0.weeklyHeavyEquipmentRequirements',
        newWeekInMonth
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeklyInMonthly]);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [executeUpdate, { loading }] = useCreateMonthlyHeavyEquipmentReqPlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: mutationSuccessMassage,
        icon: <IconCheck />,
      });
      router.push(
        `/plan/weekly/${mutationType}/weekly-plan-group/${id}?tabs=heavyEquipmentAvailabilityPlan`
      );
      if (mutationType === 'update') {
        setIsOpenConfirmation(false);
      }
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IMutationMonthlyHeavyEquipmentReqPlanValues>(
            error
          );
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

  const { weeklyHeavyEquipmentReqPlanDataLoading } =
    useReadOneHeavyEquipmentReqPlan({
      variables: {
        weeklyPlanId: id,
        limit: null,
      },
      skip: !router.isReady || tabs !== 'heavyEquipmentReqPlan',
      onCompleted: () => {
        // if (data.weeklyHeavyEquipmentRequirementPlans.data.length > 0) {
        //   const weeklyHeavyEquipmentRequirementPlans: IMutationHeavyEquipmentReqPlan[] =
        //     data.weeklyHeavyEquipmentRequirementPlans.data.map((obj) => {
        //       const locationIds = obj.locations.map((val) => val.id);
        //       const materialIds = obj.materials.map((val) => val.id);
        //       const activities: IMutationHeavyEquipmentReqPlanActivity[] =
        //         obj.heavyEquipmentRequirementPlanActivities.map((hObj) => {
        //           const weeklyHeavyEquipmentRequirements: IMutationWeeklyHeavyEquipmentRequirement[] =
        //             hObj.weeklyHeavyEquipmentRequirements.map((wObj) => {
        //               return {
        //                 id: wObj.id,
        //                 day: wObj.day,
        //                 value: wObj.value || '',
        //               };
        //             });
        //           return {
        //             id: hObj.id,
        //             activityId: hObj.activity.id,
        //             classId: hObj.class.id,
        //             weeklyHeavyEquipmentRequirements,
        //           };
        //         });
        //       return {
        //         id: obj.id,
        //         activityName: obj.activityName,
        //         locationIds,
        //         materialIds,
        //         averageDistance: obj.averageDistance || '',
        //         desc: obj.desc,
        //         activities,
        //       };
        //     });
        //   heavyequipmentReqReplace(weeklyHeavyEquipmentRequirementPlans);
        // }
      },
    });

  const unitCapacityCallback = React.useCallback(
    (
      obj: FieldArrayWithId<
        IMutationMonthlyHeavyEquipmentReqPlanValues,
        'heavyEquipmentRequirementPlans',
        'heavyequipmentReqPlanId'
      >,
      index: number
    ) => {
      const newWeekInMonth: IMutationMonthlyHeavyEquipmentRequirement[] =
        weeklyInMonthly.map((val) => ({
          id: null,
          week: val,
          value: '',
        }));
      const activityNameItem = globalText({
        name: `heavyEquipmentRequirementPlans.${index}.activityName`,
        label: 'activityName',
        key: `${obj.heavyequipmentReqPlanId}.activityName`,
      });
      const multipleSelectLocationItem = globalMultipleSelectLocation({
        label: 'location',
        withAsterisk: false,
        name: `heavyEquipmentRequirementPlans.${index}.locationIds`,
        key: `${obj.heavyequipmentReqPlanId}.locationIds`,
        skipQuery: tabs !== 'heavyEquipmentReqPlan',
        skipSearchQuery: true,
      });
      const multipleSelectMaterialItem = globalMultipleSelectMaterial({
        label: 'material',
        withAsterisk: false,
        name: `heavyEquipmentRequirementPlans.${index}.materialIds`,
        key: `${obj.heavyequipmentReqPlanId}.materialIds`,
        skipQuery: tabs !== 'heavyEquipmentReqPlan',
      });
      const averageDistanceItem = globalNumberInput({
        name: `heavyEquipmentRequirementPlans.${index}.averageDistance`,
        label: 'averageDistance',
        withAsterisk: false,
        key: `${obj.heavyequipmentReqPlanId}.averageDistance`,
      });
      const descItem = globalText({
        name: `heavyEquipmentRequirementPlans.${index}.desc`,
        label: 'desc',
        withAsterisk: false,
        colSpan: 12,
        key: `${obj.heavyequipmentReqPlanId}.desc`,
      });

      const activityGroup: IMonthlyInputGroupActivityProps[] =
        obj.activities.map((_, i) => ({
          heavyEquipmentRequirementPlanIndex: index,
          activityIndex: i,
          uniqKey: obj.heavyequipmentReqPlanId,
          tabs: tabs,
          addButtonOuter:
            i === 0
              ? {
                  onClick: () => {
                    const value = methods.getValues(
                      `heavyEquipmentRequirementPlans.${index}`
                    );
                    heavyequipmentReqUpdate(index, {
                      id: value.id,
                      activityName: value.activityName,
                      materialIds: value.materialIds,
                      locationIds: value.locationIds,
                      averageDistance: value.averageDistance,
                      desc: value.desc,
                      activities: [
                        ...value.activities,
                        {
                          id: null,
                          activityId: '',
                          classId: '',
                          weeklyHeavyEquipmentRequirements: newWeekInMonth,
                        },
                      ],
                    });
                  },
                }
              : undefined,
          deleteButtonInner: {
            onClick: () => {
              const value = methods.getValues(
                `heavyEquipmentRequirementPlans.${index}`
              );
              const copyArray = value.activities?.slice();
              copyArray.splice(i, 1);
              heavyequipmentReqFields?.[index].activities?.length > 1
                ? heavyequipmentReqUpdate(index, {
                    id: value.id,
                    activityName: value.activityName,
                    materialIds: value.materialIds,
                    locationIds: value.locationIds,
                    averageDistance: value.averageDistance,
                    desc: value.desc,
                    activities: copyArray ?? [],
                  })
                : null;
            },
          },
        }));

      const group: ControllerGroup = {
        group: t('commonTypography.heavyEquipmentReqPlanInformation'),
        enableGroupLabel: true,
        formControllers: [
          activityNameItem,
          multipleSelectMaterialItem,
          multipleSelectLocationItem,
          averageDistanceItem,
          descItem,
        ],
        renderItem: () =>
          activityGroup.map(
            ({
              activityIndex,
              heavyEquipmentRequirementPlanIndex,
              uniqKey,
              ...restMaterial
            }) => (
              <Grid.Col
                span={12}
                key={`${heavyEquipmentRequirementPlanIndex}.${activityIndex}.${uniqKey}`}
              >
                <MonthlyInputGroupActivity
                  activityIndex={activityIndex}
                  heavyEquipmentRequirementPlanIndex={
                    heavyEquipmentRequirementPlanIndex
                  }
                  {...restMaterial}
                />
              </Grid.Col>
            )
          ),
        actionOuterGroup: {
          addButton:
            index === 0
              ? {
                  label: t('commonTypography.createActivity'),
                  onClick: () =>
                    heavyequipmentReqAppend({
                      id: null,
                      activityName: '',
                      materialIds: [],
                      locationIds: [],
                      averageDistance: '',
                      desc: '',
                      activities: [
                        {
                          id: null,
                          activityId: '',
                          classId: '',
                          weeklyHeavyEquipmentRequirements: newWeekInMonth,
                        },
                      ],
                    }),
                }
              : undefined,
        },
        actionGroup: {
          deleteButton: {
            label: t('commonTypography.delete'),
            onClick: () =>
              heavyequipmentReqFields.length > 1
                ? heavyequipmentReqRemove(index)
                : null,
          },
        },
      };

      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [heavyequipmentReqFields, tabs, weeklyInMonthly]
  );
  const fieldGroup = heavyequipmentReqFields.map(unitCapacityCallback);

  const handleSubmitForm: SubmitHandler<
    IMutationMonthlyHeavyEquipmentReqPlanValues
  > = async () => {
    // const newHeavyEquipmentRequirementPlans =
    //   data.heavyEquipmentRequirementPlans.map((hObj) => {
    //     const newActivities = hObj.activities.map(
    //       ({ id, weeklyHeavyEquipmentRequirements, ...restActivity }) => {
    //         const newWeeklyHER = weeklyHeavyEquipmentRequirements.map(
    //           (wObj) => {
    //             const newWeeklyHER: IMutationWeeklyHeavyEquipmentRequirement = {
    //               id: wObj.id,
    //               day: wObj.day,
    //               value: wObj.value === '' ? null : wObj.value,
    //             };
    //             return newWeeklyHER;
    //           }
    //         );
    //         const newActivityObj: IMutationHeavyEquipmentReqPlanActivity = {
    //           id: id || undefined,
    //           weeklyHeavyEquipmentRequirements: newWeeklyHER,
    //           ...restActivity,
    //         };
    //         return newActivityObj;
    //       }
    //     );
    //     const newHeavyEquipmentRequirementPlanObj: IMutationHeavyEquipmentReqPlan =
    //       {
    //         id: hObj.id || undefined,
    //         activityName: hObj.activityName,
    //         materialIds: hObj.materialIds,
    //         locationIds: hObj.locationIds,
    //         averageDistance: hObj.averageDistance || null,
    //         desc: hObj.desc,
    //         activities: newActivities,
    //       };
    //     return newHeavyEquipmentRequirementPlanObj;
    //   });
    // await executeUpdate({
    //   variables: {
    //     weeklyPlanId: id,
    //     heavyEquipmentRequirementPlans: newHeavyEquipmentRequirementPlans,
    //   },
    // });
  };
  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };

  return (
    <DashboardCard p={0} isLoading={weeklyHeavyEquipmentReqPlanDataLoading}>
      <Flex gap={32} direction="column" p={22}>
        <CommonMonthlyPlanInformation />
        <GlobalFormGroup
          flexProps={{
            p: 0,
          }}
          field={fieldGroup}
          methods={methods}
          submitForm={handleSubmitForm}
          submitButton={{
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
          }}
          backButton={{
            onClick: () =>
              router.push(
                mutationType === 'update'
                  ? `/plan/weekly/${mutationType}/${id}`
                  : `/plan/weekly`
              ),
          }}
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

export default MutationMonthlyHeavyEquipmentReqPlanBook;
