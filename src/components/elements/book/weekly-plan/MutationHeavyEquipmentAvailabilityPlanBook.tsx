import { Flex } from '@mantine/core';
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

import DashboardCard from '@/components/elements/card/DashboardCard';
import GlobalFormGroup from '@/components/elements/form/GlobalFormGroup';
import CommonWeeklyPlanInformation from '@/components/elements/ui/CommonWeeklyPlanInformation';

import {
  IMutationHeavyEquipmentAvailabilityPlanValues,
  useCreateHeavyEquipmentAvailabilityPlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateHeavyEquipmentAvailabilityPlan';
import {
  classSelect,
  displayQuietNumber,
  globalNumberInput,
  globalTextArea,
} from '@/utils/constants/Field/global-field';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

type Props = {
  mutationType?: 'create' | 'update';
  mutationSuccessMassage?: string;
};

const MutationHeavyEquipmentAvailabilityPlanBook = ({
  mutationType,
  mutationSuccessMassage,
}: Props) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

  const methods = useForm<IMutationHeavyEquipmentAvailabilityPlanValues>({
    // resolver: zodResolver(heavyEquipmentAvailabilityMutationValidation),
    defaultValues: {
      heavyEquipmentAvailabilityPlans: [
        {
          id: null,
          classId: '',
          totalCount: '',
          damagedCount: '',
          withoutOperatorCount: '',
          desc: '',
        },
      ],
    },
    mode: 'onSubmit',
  });

  const {
    fields: heavyEquipmentAvailabilityFields,
    append: heavyEquipmentAvailabilityAppend,
    // update: heavyEquipmentAvailabilityUpdate,
    remove: heavyEquipmentAvailabilityRemove,
    // replace: heavyEquipmentAvailabilityReplace,
  } = useFieldArray({
    name: 'heavyEquipmentAvailabilityPlans',
    control: methods.control,
    keyName: 'heavyEquipmentAvailabilityPlanId',
  });

  const [executeUpdate, { loading }] = useCreateHeavyEquipmentAvailabilityPlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: mutationSuccessMassage,
        icon: <IconCheck />,
      });
      router.push(
        `/plan/weekly/${mutationType}/weekly-plan-group/${id}?tabs=next`
      );
      if (mutationType === 'update') {
        setIsOpenConfirmation(false);
      }
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IMutationHeavyEquipmentAvailabilityPlanValues>(
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

  // const { weeklyHeavyEquipmentAvailabilityPlanDataLoading } =
  //   useReadOneHeavyEquipmentAvailabilityPlan({
  //     variables: {
  //       weeklyPlanId: id,
  //       limit: null,
  //     },
  //     skip: !router.isReady || tabs !== 'heavyEquipmentAvailabilityPlan',
  //     onCompleted: (data) => {
  //       if (data.weeklyHeavyEquipmentAvailabilityuirementPlans.data.length) {
  //         const weeklyHeavyEquipmentAvailabilityuirementPlans: IMutationHeavyEquipmentAvailabilityPlan[] =
  //           data.weeklyHeavyEquipmentAvailabilityuirementPlans.data.map((obj) => {
  //             const locationIds = obj.locations.map((val) => val.id);
  //             const materialIds = obj.materials.map((val) => val.id);
  //             const activities: IMutationHeavyEquipmentAvailabilityPlanActivity[] =
  //               obj.heavyEquipmentAvailabilityuirementPlanActivities.map((hObj) => {
  //                 const weeklyHeavyEquipmentAvailabilityuirements: IMutationWeeklyHeavyEquipmentAvailabilityuirement[] =
  //                   hObj.weeklyHeavyEquipmentAvailabilityuirements.map((wObj) => {
  //                     return {
  //                       id: wObj.id,
  //                       day: wObj.day,
  //                       value: wObj.value || '',
  //                     };
  //                   });
  //                 return {
  //                   id: hObj.id,
  //                   activityFormId: hObj.activityForm.id,
  //                   classId: hObj.class.id,
  //                   weeklyHeavyEquipmentAvailabilityuirements,
  //                 };
  //               });
  //             return {
  //               id: obj.id,
  //               activityName: obj.activityName,
  //               locationIds,
  //               materialIds,
  //               averageDistance: obj.averageDistance,
  //               desc: obj.desc,
  //               activities,
  //             };
  //           });
  //         heavyEquipmentAvailabilityReplace(weeklyHeavyEquipmentAvailabilityuirementPlans);
  //       }
  //     },
  //   });

  const unitCapacityCallback = React.useCallback(
    (
      obj: FieldArrayWithId<
        IMutationHeavyEquipmentAvailabilityPlanValues,
        'heavyEquipmentAvailabilityPlans',
        'heavyEquipmentAvailabilityPlanId'
      >,
      index: number
    ) => {
      const heavyEquipmentClassItem = classSelect({
        name: `heavyEquipmentAvailabilityPlans.${index}.classId`,
        label: 'heavyEquipmentClass',
        key: `${obj.heavyEquipmentAvailabilityPlanId}.classId`,
        skipQuery: tabs !== 'heavyEquipmentAvailabilityPlan',
        colSpan: 12,
      });
      const totalAvailabilityHeavyEquipmentItem = globalNumberInput({
        name: `heavyEquipmentAvailabilityPlans.${index}.totalCount`,
        label: 'totalAvailabilityHeavyEquipment',
        key: `${obj.heavyEquipmentAvailabilityPlanId}.totalCount`,
        precision: 0,
      });
      const breakdownCountItem = globalNumberInput({
        name: `heavyEquipmentAvailabilityPlans.${index}.damagedCount`,
        label: 'breakdownCount',
        withAsterisk: false,
        key: `${obj.heavyEquipmentAvailabilityPlanId}.damagedCount`,
        precision: 0,
      });
      const withoutOperatorCountItem = globalNumberInput({
        name: `heavyEquipmentAvailabilityPlans.${index}.withoutOperatorCount`,
        label: 'withoutOperatorCount',
        withAsterisk: false,
        key: `${obj.heavyEquipmentAvailabilityPlanId}.withoutOperatorCount`,
        precision: 0,
      });
      const quietNumberItem = displayQuietNumber({
        name: `heavyEquipmentAvailabilityPlans.${index}`,
        label: 'quietNumber',
        withAsterisk: false,
        key: `${obj.heavyEquipmentAvailabilityPlanId}.quietNumber`,
        disabled: true,
      });
      const descItem = globalTextArea({
        name: `heavyEquipmentAvailabilityPlans.${index}.desc`,
        label: 'desc',
        withAsterisk: false,
        key: `${obj.heavyEquipmentAvailabilityPlanId}.desc`,
        colSpan: 12,
      });

      const group: ControllerGroup = {
        group: t('commonTypography.heavyEquipmentAvailabilityPlan'),
        enableGroupLabel: true,
        formControllers: [
          heavyEquipmentClassItem,
          totalAvailabilityHeavyEquipmentItem,
          breakdownCountItem,
          withoutOperatorCountItem,
          quietNumberItem,
          descItem,
        ],
        actionOuterGroup: {
          addButton:
            index === 0
              ? {
                  label: t('commonTypography.createActivity'),
                  onClick: () =>
                    heavyEquipmentAvailabilityAppend({
                      id: null,
                      classId: '',
                      totalCount: '',
                      damagedCount: '',
                      withoutOperatorCount: '',
                      desc: '',
                    }),
                }
              : undefined,
        },
        actionGroup: {
          deleteButton: {
            label: t('commonTypography.delete'),
            onClick: () =>
              heavyEquipmentAvailabilityFields.length > 1
                ? heavyEquipmentAvailabilityRemove(index)
                : null,
          },
        },
      };

      return group;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [heavyEquipmentAvailabilityFields, tabs]
  );
  const fieldGroup = heavyEquipmentAvailabilityFields.map(unitCapacityCallback);

  const handleSubmitForm: SubmitHandler<
    IMutationHeavyEquipmentAvailabilityPlanValues
  > = async (data) => {
    await executeUpdate({
      variables: {
        weeklyPlanId: id,
        heavyEquipmentAvailabilityPlans: data.heavyEquipmentAvailabilityPlans,
      },
    });
  };
  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
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

export default MutationHeavyEquipmentAvailabilityPlanBook;
