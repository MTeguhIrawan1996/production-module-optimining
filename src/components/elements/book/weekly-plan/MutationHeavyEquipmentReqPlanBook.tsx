import { Flex, Grid } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';
import {
  FieldArrayWithId,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import DashboardCard from '@/components/elements/card/DashboardCard';
import GlobalFormGroup from '@/components/elements/form/GlobalFormGroup';
import CommonWeeklyPlanInformation from '@/components/elements/ui/CommonWeeklyPlanInformation';
import InputGroupActivity, {
  IInputGroupActivityProps,
} from '@/components/elements/ui/InputGroupActivity';

import { IMutationHeavyEquipmentReqPlanValues } from '@/services/graphql/mutation/plan/weekly/useCreateHeavyEquipmentReqPlan';
import { activities } from '@/utils/constants/DefaultValues/heavy-equipment-req-plans';
import {
  globalMultipleSelectLocation,
  globalText,
} from '@/utils/constants/Field/global-field';

import { ControllerGroup } from '@/types/global';

type Props = {
  mutationType?: 'create' | 'update';
  mutationSuccessMassage?: string;
};

const MutationHeavyEquipmentReqPlanBook = ({
  mutationType,
  // eslint-disable-next-line unused-imports/no-unused-vars
  mutationSuccessMassage,
}: Props) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const tabs = router.query.tabs as string;

  const methods = useForm<IMutationHeavyEquipmentReqPlanValues>({
    // resolver: zodResolver(weeklyWorkTimePlanMutationValidation),
    defaultValues: {
      heavyEquipmentRequirementPlans: [
        {
          id: null,
          activityName: '',
          materialIds: [],
          locationIds: [],
          averageDistance: '',
          desc: '',
          activities: activities,
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
    // eslint-disable-next-line unused-imports/no-unused-vars
    replace: heavyequipmentReqReplace,
  } = useFieldArray({
    name: 'heavyEquipmentRequirementPlans',
    control: methods.control,
    keyName: 'heavyequipmentReqPlanId',
  });

  const unitCapacityCallback = React.useCallback(
    (
      obj: FieldArrayWithId<
        IMutationHeavyEquipmentReqPlanValues,
        'heavyEquipmentRequirementPlans',
        'heavyequipmentReqPlanId'
      >,
      index: number
    ) => {
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
      });

      const activityGroup: IInputGroupActivityProps[] = obj.activities.map(
        (_, i) => ({
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
                      id: value.id || '',
                      activityName: value.activityName,
                      materialIds: value.materialIds,
                      locationIds: value.locationIds,
                      averageDistance: value.averageDistance,
                      desc: value.desc,
                      activities: [...value.activities, ...activities],
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
                    id: value.id || '',
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
        })
      );

      const group: ControllerGroup = {
        group: t('commonTypography.heavyEquipmentReqPlanInformation'),
        enableGroupLabel: true,
        formControllers: [activityNameItem, multipleSelectLocationItem],
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
                <InputGroupActivity
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
                  label: t('commonTypography.createLocation'),
                  onClick: () =>
                    heavyequipmentReqAppend({
                      id: null,
                      activityName: '',
                      materialIds: [],
                      locationIds: [],
                      averageDistance: '',
                      desc: '',
                      activities: activities,
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
    [heavyequipmentReqFields]
  );

  const fieldGroup = heavyequipmentReqFields.map(unitCapacityCallback);

  const handleSubmitForm: SubmitHandler<
    IMutationHeavyEquipmentReqPlanValues
    // eslint-disable-next-line unused-imports/no-unused-vars
  > = async (data) => {
    // await executeUpdate({
    //   variables: {
    //     weeklyPlanId: id,
    //     workTimePlanActivities: newWorkTimeActivity,
    //   },
    // });
  };
  return (
    <DashboardCard p={0}>
      <Flex gap={32} direction="column" p={22}>
        <CommonWeeklyPlanInformation />
        <GlobalFormGroup
          flexProps={{
            p: 0,
          }}
          field={fieldGroup}
          methods={methods}
          submitForm={handleSubmitForm}
          submitButton={{
            label: t('commonTypography.save'),
            // loading: mutationType === 'create' ? loading : undefined,
            type: mutationType === 'create' ? 'submit' : 'button',
            // onClick:
            //   mutationType === 'update'
            //     ? async () => {
            //         const output = await methods.trigger(undefined, {
            //           shouldFocus: true,
            //         });
            //         if (output) setIsOpenConfirmation((prev) => !prev);
            //       }
            //     : undefined,
          }}
          // backButton={{
          //   onClick: () =>
          //     router.push(
          //       mutationType === 'update'
          //         ? `/plan/weekly/${mutationType}/${id}`
          //         : `/plan/weekly`
          //     ),
          // }}
          // modalConfirmation={{
          //   isOpenModalConfirmation: isOpenConfirmation,
          //   actionModalConfirmation: () => setIsOpenConfirmation((prev) => !prev),
          //   actionButton: {
          //     label: t('commonTypography.yes'),
          //     type: 'button',
          //     onClick: handleConfirmation,
          //     loading: loading,
          //   },
          //   backButton: {
          //     label: 'Batal',
          //   },
          //   modalType: {
          //     type: 'default',
          //     title: t('commonTypography.alertTitleConfirmUpdate'),
          //   },
          //   withDivider: true,
          // }}
        />
      </Flex>
    </DashboardCard>
  );
};

export default MutationHeavyEquipmentReqPlanBook;
