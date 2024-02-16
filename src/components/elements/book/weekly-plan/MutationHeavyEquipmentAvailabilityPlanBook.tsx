import { zodResolver } from '@hookform/resolvers/zod';
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
  IMutationHeavyEquipmentAvailabilityPlanData,
  IMutationHeavyEquipmentAvailabilityPlanValues,
  useCreateHeavyEquipmentAvailabilityPlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateHeavyEquipmentAvailabilityPlan';
import { useReadOneHeavyEquipmentAvailabilityPlan } from '@/services/graphql/query/plan/weekly/heavy-equipment-availability-plan.ts/useReadOneHeavyEquipmentAvailabilityPlan';
import {
  classSelect,
  displayQuietNumber,
  globalNumberInput,
  globalTextArea,
} from '@/utils/constants/Field/global-field';
import { heavyEquipmentAvailAbilityMutationValidation } from '@/utils/form-validation/plan/weekly/weekly-heavy-equipment-availability-validation';
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
    resolver: zodResolver(heavyEquipmentAvailAbilityMutationValidation),
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
    remove: heavyEquipmentAvailabilityRemove,
    replace: heavyEquipmentAvailabilityReplace,
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
        `/plan/weekly/${mutationType}/weekly-plan-group/${id}?tabs=productionTargetPlan`
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

  const { weeklyHeavyEquipmentAvailabilityPlanDataLoading } =
    useReadOneHeavyEquipmentAvailabilityPlan({
      variables: {
        weeklyPlanId: id,
        limit: null,
      },
      skip: !router.isReady || tabs !== 'heavyEquipmentAvailabilityPlan',
      onCompleted: ({ weeklyHeavyEquipmentAvailabilityPlans }) => {
        if (weeklyHeavyEquipmentAvailabilityPlans.data.length > 0) {
          const newData: IMutationHeavyEquipmentAvailabilityPlanData[] =
            weeklyHeavyEquipmentAvailabilityPlans.data.map((wObj) => {
              return {
                id: wObj.id,
                classId: wObj.class.id,
                totalCount: wObj.totalCount || '',
                damagedCount: wObj.damagedCount || '',
                withoutOperatorCount: wObj.withoutOperatorCount || '',
                desc: wObj.desc || '',
              };
            });
          heavyEquipmentAvailabilityReplace(newData);
        }
      },
    });

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
        limit: null,
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
                  label: t('commonTypography.createHeavyEquipment'),
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
    const newData: IMutationHeavyEquipmentAvailabilityPlanData[] =
      data.heavyEquipmentAvailabilityPlans.map(
        ({ damagedCount, totalCount, withoutOperatorCount, ...rest }) => {
          return {
            damagedCount: damagedCount || null,
            totalCount: totalCount || null,
            withoutOperatorCount: withoutOperatorCount || null,
            ...rest,
          };
        }
      );
    await executeUpdate({
      variables: {
        weeklyPlanId: id,
        heavyEquipmentAvailabilityPlans: newData,
      },
    });
  };
  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };

  return (
    <DashboardCard
      p={0}
      isLoading={weeklyHeavyEquipmentAvailabilityPlanDataLoading}
    >
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
