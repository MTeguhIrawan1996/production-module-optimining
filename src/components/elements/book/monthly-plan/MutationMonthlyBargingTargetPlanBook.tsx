import { Flex, Grid } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import CommonMonthlyPlanInformation from '@/components/elements/book/monthly-plan/ui/CommonMonthlyPlanInformation';
import InputMonthlyTableBargingTargetPlan from '@/components/elements/book/monthly-plan/ui/InputMonthlyTableBargingTargetPlan';
import DashboardCard from '@/components/elements/card/DashboardCard';
import GlobalFormGroup from '@/components/elements/form/GlobalFormGroup';

import {
  IMonthlyBargingTarget,
  IMonthlyBargingTargetPlan,
  IMonthlyBargingTargetPlanValue,
  useCreateMonthlyBargingTargetPlan,
} from '@/services/graphql/mutation/plan/monthly/useCreateMonthlyBargingTargetPlan';
import { useReadAllMaterialsMaster } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { useReadOneBargingTargetPlan } from '@/services/graphql/query/plan/weekly/barging-target-plan/useReadOneBargingTargetPlan';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import { useStoreWeeklyInMonthly } from '@/utils/store/useWeekInMonthlyStore';

import { ControllerGroup } from '@/types/global';

interface IMutationMonthlyBargingTargetPlanBook {
  mutationType?: 'create' | 'update';
  mutationSuccessMassage?: string;
}

const MutationMonthlyBargingTargetPlanBook = ({
  mutationType,
  mutationSuccessMassage,
}: IMutationMonthlyBargingTargetPlanBook) => {
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

  const methods = useForm<IMonthlyBargingTargetPlanValue>({
    // resolver: zodResolver(weeklyBargingTargetPlanMutationValidation),
    defaultValues: {
      bargingTargetPlans: [
        {
          id: null,
          materialId: null,
          materialName: '',
          weeklyBargingTargets: [],
        },
      ],
      // bargingDomePlans: [
      //   {
      //     id: null,
      //     domeId: null,
      //   },
      // ],
    },
    mode: 'onBlur',
  });

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { fields: bargingTargetPlanFields } = useFieldArray({
    name: 'bargingTargetPlans',
    control: methods.control,
    keyName: 'bargingTargetPlanId',
  });
  // const {
  //   fields: bargingDomePlanFields,
  //   append: bargingDomePlanAppend,
  //   remove: bargingDomePlanRemove,
  //   // replace: bargingDomePlanReplace,
  // } = useFieldArray({
  //   name: 'bargingDomePlans',
  //   control: methods.control,
  //   keyName: 'bargingDomePlanId',
  // });

  const { materialsData, materialsDataLoading } = useReadAllMaterialsMaster({
    variables: {
      limit: null,
      orderDir: 'desc',
      orderBy: 'createdAt',
      parentId: `${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`,
      isHaveParent: null,
      includeIds: null,
    },
    skip: tabs !== 'bargingTargetPlan',
    fetchPolicy: 'cache-and-network',
    onCompleted: ({ materials }) => {
      const newWeekInMonth: IMonthlyBargingTarget[] = weeklyInMonthly.map(
        (val) => ({
          id: null,
          week: val,
          rate: '',
          ton: '',
        })
      );
      const newBargingtargetPlan: IMonthlyBargingTargetPlan[] =
        materials.data.map((Obj) => {
          return {
            id: null,
            materialId: Obj.id,
            materialName: Obj.name,
            weeklyBargingTargets: newWeekInMonth,
          };
        });
      methods.setValue('bargingTargetPlans', newBargingtargetPlan);
    },
  });

  useReadOneBargingTargetPlan({
    variables: {
      weeklyPlanId: id,
    },
    skip: !router.isReady || !materialsData || tabs !== 'bargingTargetPlan',
    // onCompleted: (data) => {
    //   if (
    //     data.weeklyBargingPlan &&
    //     data.weeklyBargingPlan.bargingTargetPlans.length > 0
    //   ) {
    //     data.weeklyBargingPlan.bargingTargetPlans.forEach((val) => {
    //       const newWeeklyBargingTargets: IWeeklyBargingTarget[] =
    //         val.weeklyBargingTargets.map((wObj) => {
    //           return {
    //             id: wObj.id || null,
    //             day: wObj.day,
    //             rate: wObj.rate || '',
    //             ton: wObj.ton || '',
    //           };
    //         });
    //       const bargingTargetPlanIndex = bargingTargetPlanFields.findIndex(
    //         (item) => item.materialId === val.material.id
    //       );
    //       methods.setValue(
    //         `bargingTargetPlans.${bargingTargetPlanIndex}.id`,
    //         val.id
    //       );
    //       methods.setValue(
    //         `bargingTargetPlans.${bargingTargetPlanIndex}.weeklyBargingTargets`,
    //         newWeeklyBargingTargets
    //       );
    //     });
    //   }
    //   if (
    //     data.weeklyBargingPlan &&
    //     data.weeklyBargingPlan.bargingDomePlans.data.length > 0
    //   ) {
    //     const newBargingDomePlans: IBargingDomePlan[] =
    //       data.weeklyBargingPlan.bargingDomePlans.data.map((val) => {
    //         return {
    //           id: val.id,
    //           domeId: val.dome.id,
    //         };
    //       });
    //     bargingDomePlanReplace(newBargingDomePlans);
    //   }
    // },
  });

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [executeUpdate, { loading }] = useCreateMonthlyBargingTargetPlan({
    onCompleted: () => {
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: mutationSuccessMassage,
        icon: <IconCheck />,
      });
      router.push(`/plan/weekly`);
      if (mutationType === 'update') {
        setIsOpenConfirmation(false);
      }
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry =
          errorBadRequestField<IMonthlyBargingTargetPlanValue>(error);
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
    // const domeGroup: IInputGroupDomeProps[] = bargingDomePlanFields.map(
    //   (obj, i) => ({
    //     bargingDomePlanIndex: i,
    //     uniqKey: obj.bargingDomePlanId,
    //     tabs: tabs,
    //     addButtonOuter:
    //       i === 0
    //         ? {
    //             onClick: () => {
    //               bargingDomePlanAppend({
    //                 id: null,
    //                 domeId: '',
    //               });
    //             },
    //           }
    //         : undefined,
    //     deleteButtonInner: {
    //       onClick: () => {
    //         bargingDomePlanFields.length > 1 ? bargingDomePlanRemove(i) : null;
    //       },
    //     },
    //   })
    // );

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.bargingTargetPlan'),
        enableGroupLabel: true,
        formControllers: [],
        renderItem: () => {
          return (
            <>
              <Grid.Col span={12}>
                <InputMonthlyTableBargingTargetPlan />
              </Grid.Col>
              {/* TABLE BARGING DOME */}
              {/* {domeGroup.map(
                ({ bargingDomePlanIndex, uniqKey, ...restDome }) => (
                  <Grid.Col
                    span={12}
                    key={`${bargingDomePlanIndex}.${uniqKey}`}
                  >
                    <InputGroupDome
                      bargingDomePlanIndex={bargingDomePlanIndex}
                      tabs={tabs}
                      {...restDome}
                    />
                  </Grid.Col>
                )
              )} */}
            </>
          );
        },
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  const handleSubmitForm: SubmitHandler<
    IMonthlyBargingTargetPlanValue
  > = async () => {
    // const newBargingTargetPlans: IBargingTargetPlan[] = data.bargingTargetPlans
    //   .map(({ id, materialId, weeklyBargingTargets }) => {
    //     const newWeeklyBargingTargets: IWeeklyBargingTarget[] =
    //       weeklyBargingTargets
    //         .filter((v) => v.rate && v.ton)
    //         .map((wObj) => {
    //           return {
    //             id: wObj.id || undefined,
    //             day: wObj.day,
    //             rate: wObj.rate || null,
    //             ton: wObj.ton || null,
    //           };
    //         });
    //     return {
    //       id: id || undefined,
    //       materialId,
    //       weeklyBargingTargets: newWeeklyBargingTargets,
    //     };
    //   })
    //   .filter((v) => v.weeklyBargingTargets.length > 0);
    // const newBargingDomePlans = data.bargingDomePlans.filter((v) => v.domeId);
    // await executeUpdate({
    //   variables: {
    //     weeklyPlanId: id,
    //     bargingTargetPlans: newBargingTargetPlans,
    //     bargingDomePlans: newBargingDomePlans,
    //   },
    // });
  };

  const handleConfirmation = () => {
    methods.handleSubmit(handleSubmitForm)();
  };

  return (
    <DashboardCard p={0} isLoading={materialsDataLoading}>
      <Flex gap={32} direction="column" p={22}>
        <CommonMonthlyPlanInformation />
        <GlobalFormGroup
          flexProps={{
            p: 0,
          }}
          field={fieldRhf}
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

export default MutationMonthlyBargingTargetPlanBook;
