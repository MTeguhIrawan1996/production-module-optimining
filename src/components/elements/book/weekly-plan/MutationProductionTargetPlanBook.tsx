/* eslint-disable unused-imports/no-unused-vars */
import { Flex, Grid } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import InputTableProductionPlan from '@/components/elements/book/weekly-plan/ui/InputTableProductionTargetPlan';
import DashboardCard from '@/components/elements/card/DashboardCard';
import GlobalFormGroup from '@/components/elements/form/GlobalFormGroup';
import CommonWeeklyPlanInformation from '@/components/elements/ui/CommonWeeklyPlanInformation';

import {
  IWeeklyProductionTargetPlanData,
  IWeeklyProductionTargetPlanValues,
  useCreateWeeklyProductionTargetPlan,
} from '@/services/graphql/mutation/plan/weekly/useCreateWeeklyProductionTargetPlan';
import { useReadAllMaterialsMaster } from '@/services/graphql/query/material/useReadAllMaterialMaster';
import { productionTarget } from '@/utils/constants/DefaultValues/production-target-plan';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

interface IMutationBargingTargetPlanBook {
  mutationType?: 'create' | 'update';
  mutationSuccessMassage?: string;
}

const MutationProductionTargetPlan = ({
  mutationType,
  mutationSuccessMassage,
}: IMutationBargingTargetPlanBook) => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const tabs = router.query.tabs as string;
  const [isOpenConfirmation, setIsOpenConfirmation] =
    React.useState<boolean>(false);

  const methods = useForm<IWeeklyProductionTargetPlanValues>({
    // resolver: zodResolver(weeklyBargingTargetPlanMutationValidation),
    defaultValues: {
      productionTargetPlans: [
        {
          id: 'SR',
          materialId: null,
          materialName: 'SR',
          isPerent: true,
          weeklyProductionTargets: productionTarget,
        },
      ],
    },
    mode: 'onBlur',
  });

  const {
    fields: productionTargetPlanFields,
    replace: productionTargetPlanReplace,
    prepend: productionTargetPlanPrepend,
  } = useFieldArray({
    name: 'productionTargetPlans',
    control: methods.control,
    keyName: 'productionTargetPlanId',
  });

  const [executeUpdate, { loading }] = useCreateWeeklyProductionTargetPlan({
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

  const { materialsData, materialsDataLoading } = useReadAllMaterialsMaster({
    variables: {
      limit: null,
      orderDir: 'asc',
      orderBy: 'createdAt',
      parentId: null,
      isHaveParent: false,
      includeIds: null,
    },
    skip: tabs !== 'productionTargetPlan',
    onCompleted: ({ materials }) => {
      const oreMaterial = materials.data.find(
        (v) => v.id === `${process.env.NEXT_PUBLIC_MATERIAL_ORE_ID}`
      );
      const newPerentMaterial: IWeeklyProductionTargetPlanData[] =
        materials.data.map((Obj) => {
          return {
            id: null,
            materialId: Obj.id,
            materialName: Obj.name,
            isPerent: true,
            weeklyProductionTargets: productionTarget,
          };
        });

      const newSubMaterialOre: IWeeklyProductionTargetPlanData[] | undefined =
        oreMaterial?.subMaterials.map((sObj) => {
          return {
            id: null,
            materialId: sObj.id,
            materialName: sObj.name,
            isPerent: false,
            weeklyProductionTargets: productionTarget,
          };
        });

      methods.setValue('productionTargetPlans', [
        ...newPerentMaterial,
        ...(newSubMaterialOre ?? []),
        ...productionTargetPlanFields,
      ]);
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
              <InputTableProductionPlan />
            </Grid.Col>
          );
        },
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  const handleSubmitForm: SubmitHandler<
    IWeeklyProductionTargetPlanValues
  > = async (data) => {
    // console.log(data);
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
    <DashboardCard p={0}>
      <Flex gap={32} direction="column" p={22}>
        <CommonWeeklyPlanInformation />
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

export default MutationProductionTargetPlan;
